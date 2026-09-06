// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {INativeQueryVerifier} from "./INativeQueryVerifier.sol";
import {EvmTxDecoder} from "./EvmTxDecoder.sol";

/// @title TemiVault
/// @notice Non-custodial dual-reserve emergency micro-liquidity vault for Tèmi.
///
///         Every deposit is split 85% into the depositor's unencumbered Tier 1 personal vault
///         and 15% into a shared Tier 2 mutual buffer. Nothing is a premium: Tier 1 is
///         withdrawable at any moment, which is the structural difference from insurance.
///
///         Reserves can be funded three ways, all of which land in the same 85/15 accounting:
///           1. `depositReserve()`        — native tCTC on Creditcoin.
///           2. `depositViaAttestcoin()`  — capital deposited on Ethereum Sepolia, proven to
///                                          Creditcoin by the Attestcoin Native Query Verifier.
///           3. the NIBSS virtual-account relayer, which is just path 1 with a different payer.
///
///         Claims are settled against hardware attestation produced in the operator's browser:
///         accelerometer tremor, motion parallax, and (for fixed property) an H3 spatial lock.
///
/// @dev    Deployed to Creditcoin cc3-testnet (chain id 102031). Amounts are wei of tCTC.
contract TemiVault {
    using EvmTxDecoder for bytes;

    /* ------------------------------------------------------------------ */
    /*                              TYPES                                  */
    /* ------------------------------------------------------------------ */

    enum AssetCategory {
        MOVABLE_HARDWARE,
        FIXED_PROPERTY
    }

    struct Asset {
        bytes32 assetId;
        AssetCategory category;
        uint256 declaredValue;
        uint64 h3CellIndex;
        bool isActive;
    }

    struct UserReserve {
        uint256 tier1PersonalBalance;
        uint256 lifetimeDeposits;
        uint256 lastDepositTimestamp;
    }

    /* ------------------------------------------------------------------ */
    /*                        ATTESTCOIN PROTOCOL                          */
    /* ------------------------------------------------------------------ */

    /// @notice The Attestcoin Native Query Verifier precompile baked into the Creditcoin runtime.
    INativeQueryVerifier public constant ATTESTCOIN_VERIFIER =
        INativeQueryVerifier(0x0000000000000000000000000000000000000FD2);

    /// @notice topic0 of `TemiSourcePortal.CrossChainReserveDeposit(address,uint256,uint256)`.
    bytes32 public constant CROSS_CHAIN_DEPOSIT_TOPIC =
        keccak256("CrossChainReserveDeposit(address,uint256,uint256)");

    /// @notice Attestcoin chain keys the vault will accept proofs from, mapped to the portal
    ///         address that is authoritative on that chain. cc3-testnet supports key 1
    ///         (Ethereum Sepolia) and key 3 (Ethereum Mainnet).
    mapping(uint64 => address) public trustedSourcePortal;

    /// @notice Replay guard keyed on the proven payload itself. This is the binding guard:
    ///         `keccak256(txBytes)` is a commitment to the exact bytes the precompile verified,
    ///         so a proof cannot be reused even if the caller relabels the tx hash.
    mapping(bytes32 => bool) public consumedAttestation;

    /// @notice Secondary replay guard on the operator-supplied source tx hash label.
    mapping(bytes32 => bool) public consumedExternalTxHash;

    /// @notice tCTC held to back cross-chain credits. Value deposited on Ethereum Sepolia does
    ///         not physically arrive on Creditcoin, so a cross-chain credit is only honoured
    ///         while there is settlement float to back it. This keeps the vault solvent instead
    ///         of minting a balance that a later claim could not actually pay out.
    uint256 public conduitBackingAvailable;

    uint256 public crossChainDepositsVerified;
    uint256 public crossChainValueVerified;
    uint64 public lastVerifiedSourceHeight;
    uint64 public lastVerifiedChainKey;

    address public treasury;

    /* ------------------------------------------------------------------ */
    /*                            CONSTANTS                                */
    /* ------------------------------------------------------------------ */

    uint256 public constant BPS_DENOMINATOR = 10_000;
    /// @notice 85% of every deposit routes to the caller's personal vault.
    uint256 public constant TIER1_SPLIT_BPS = 8_500;
    /// @notice A single claim may draw at most 10% of the mutual buffer.
    uint256 public constant TIER2_DRAW_CAP_BPS = 1_000;
    /// @notice A single claim may draw at most 3x the claimant's lifetime deposits from Tier 2.
    uint256 public constant LIFETIME_DEPOSIT_MULTIPLE = 3;

    /// @notice Minimum handheld tremor. The client reports sigma * 10_000, so this is sigma >= 0.01.
    uint256 public constant MIN_JITTER_VARIANCE = 100;
    /// @notice Minimum motion-parallax score on a 0-1000 scale. Rejects 2D screens and photographs.
    uint256 public constant MIN_PARALLAX_SCORE = 850;

    /* ------------------------------------------------------------------ */
    /*                             STORAGE                                 */
    /* ------------------------------------------------------------------ */

    uint256 public totalTier2PoolBalance;
    uint256 public totalTier1Balance;
    uint256 public totalClaimsSettled;
    uint256 public totalValueDisbursed;

    mapping(address => UserReserve) public reserves;

    /// @dev Asset identities are global: a serial plate, or an (h3 cell, meter) pair, can only
    ///      ever bind to one operator. That is what makes double registration of the same
    ///      physical object impossible.
    mapping(bytes32 => Asset) private _assets;
    mapping(bytes32 => address) public assetOwner;
    mapping(address => bytes32[]) private _ownedAssetIds;

    uint256 private _reentrancyLock;

    /* ------------------------------------------------------------------ */
    /*                              EVENTS                                 */
    /* ------------------------------------------------------------------ */

    event ReserveDeposited(
        address indexed operator,
        uint256 grossAmount,
        uint256 tier1Amount,
        uint256 tier2Amount,
        uint256 tier1Balance,
        uint256 poolBalance
    );

    event CrossChainReserveVerified(
        address indexed operator,
        uint64 indexed chainKey,
        uint64 indexed sourceHeight,
        bytes32 externalTxHash,
        bytes32 attestationKey,
        address sourcePortal,
        uint256 amount,
        uint256 targetAssetId
    );

    event ConduitLiquidityFunded(address indexed underwriter, uint256 amount, uint256 available);
    event TrustedSourcePortalSet(uint64 indexed chainKey, address portal);

    event AssetRegistered(
        address indexed operator,
        bytes32 indexed assetId,
        AssetCategory category,
        uint256 declaredValue,
        uint64 h3CellIndex
    );

    event ClaimSettled(
        address indexed operator,
        bytes32 indexed assetId,
        uint256 claimedLoss,
        uint256 tier1Draw,
        uint256 tier2Draw,
        uint256 payout,
        uint256 jitterVariance,
        uint256 parallaxScore
    );

    event Tier1Withdrawn(address indexed operator, uint256 amount, uint256 remainingBalance);

    /* ------------------------------------------------------------------ */
    /*                              ERRORS                                 */
    /* ------------------------------------------------------------------ */

    error ZeroDeposit();
    error AssetAlreadyRegistered(bytes32 assetId);
    error DeclaredValueRequired();
    error SpatialCellRequired();
    error UnknownAsset(bytes32 assetId);
    error NotAssetOwner(bytes32 assetId);
    error AssetInactive(bytes32 assetId);
    error InvalidClaimAmount();
    error TremorAttestationFailed(uint256 jitterVariance, uint256 required);
    error ParallaxAttestationFailed(uint256 parallaxScore, uint256 required);
    error SpatialLockFailed(uint64 liveH3Cell, uint64 boundH3Cell);
    error NoSettleableReserve();
    error InsufficientTier1(uint256 requested, uint256 available);
    error TransferFailed();
    error Reentrancy();

    error UntrustedSourceChain(uint64 chainKey);
    error AttestationAlreadyConsumed(bytes32 key);
    error AttestcoinVerificationFailed();
    error DepositLogNotFound(address expectedPortal);
    error AmountMismatch(uint256 declared, uint256 attested);
    error InsufficientConduitBacking(uint256 requested, uint256 available);
    error NotTreasury();

    modifier nonReentrant() {
        if (_reentrancyLock == 1) revert Reentrancy();
        _reentrancyLock = 1;
        _;
        _reentrancyLock = 0;
    }

    modifier onlyTreasury() {
        if (msg.sender != treasury) revert NotTreasury();
        _;
    }

    constructor(address treasury_) {
        treasury = treasury_ == address(0) ? msg.sender : treasury_;
    }

    /* ------------------------------------------------------------------ */
    /*                        NATIVE tCTC DEPOSITS                         */
    /* ------------------------------------------------------------------ */

    /// @notice Fund the dual reserve with native tCTC. 85% is credited to the caller's Tier 1
    ///         personal vault, 15% joins the shared Tier 2 mutual buffer.
    function depositReserve() external payable {
        if (msg.value == 0) revert ZeroDeposit();
        _creditReserve(msg.sender, msg.value);
    }

    /* ------------------------------------------------------------------ */
    /*              ATTESTCOIN CROSS-CHAIN RESERVE INTAKE                  */
    /* ------------------------------------------------------------------ */

    /// @notice Credit a Tèmi reserve from capital that was deposited on an external EVM chain,
    ///         proven to Creditcoin by the Attestcoin Native Query Verifier precompile.
    ///
    /// @dev    This is a genuine Attestcoin Smart Contract path, not a name-check. In one
    ///         Creditcoin transaction it:
    ///           1. decodes the caller-supplied proof bundle,
    ///           2. calls `verifyAndEmit` on the 0x0FD2 precompile, which checks the Merkle
    ///              inclusion proof against the source block and the continuity proof against
    ///              the attestor network's checkpoint chain — the call reverts if either fails,
    ///           3. decodes the now-proven transaction payload and walks its receipt logs,
    ///           4. requires a `CrossChainReserveDeposit` log emitted by the portal this vault
    ///              trusts on that chain key, and
    ///           5. credits the beneficiary named *inside the proven log* — never the caller.
    ///
    ///         Because the beneficiary comes from the attested log rather than from calldata,
    ///         a third-party relayer can submit the proof without being able to redirect funds.
    ///
    /// @param proofData       abi.encode(uint64 chainKey, uint64 height, bytes encodedTransaction,
    ///                        INativeQueryVerifier.MerkleProof, INativeQueryVerifier.ContinuityProof)
    ///                        exactly as returned by the Creditcoin proof builder API.
    /// @param externalTxHash  The source-chain transaction hash, used as a human-readable label
    ///                        and as a secondary replay guard.
    /// @param amount          The amount the submitter expects to be credited. Checked against
    ///                        the attested log; a mismatch reverts rather than silently adjusting.
    function depositViaAttestcoin(
        bytes calldata proofData,
        bytes32 externalTxHash,
        uint256 amount
    ) external returns (address beneficiary, uint256 credited) {
        (
            uint64 chainKey,
            uint64 height,
            bytes memory encodedTransaction,
            INativeQueryVerifier.MerkleProof memory merkleProof,
            INativeQueryVerifier.ContinuityProof memory continuityProof
        ) = abi.decode(
            proofData,
            (uint64, uint64, bytes, INativeQueryVerifier.MerkleProof, INativeQueryVerifier.ContinuityProof)
        );

        address portal = trustedSourcePortal[chainKey];
        if (portal == address(0)) revert UntrustedSourceChain(chainKey);

        // Bind the replay guard to the exact bytes the precompile is about to verify.
        bytes32 attestationKey = keccak256(encodedTransaction);
        if (consumedAttestation[attestationKey]) revert AttestationAlreadyConsumed(attestationKey);
        if (consumedExternalTxHash[externalTxHash]) revert AttestationAlreadyConsumed(externalTxHash);

        // ---- Attestcoin verification. Reverts inside the precompile on a bad proof. ----
        bool verified = ATTESTCOIN_VERIFIER.verifyAndEmit(
            chainKey,
            height,
            encodedTransaction,
            merkleProof,
            continuityProof
        );
        if (!verified) revert AttestcoinVerificationFailed();

        // ---- The payload is now proven. Read the deposit out of its receipt logs. ----
        (, EvmTxDecoder.EvmLog[] memory logs) = EvmTxDecoder.decode(encodedTransaction);

        uint256 attestedAmount;
        uint256 targetAssetId;
        bool found;
        for (uint256 i = 0; i < logs.length; i++) {
            EvmTxDecoder.EvmLog memory log = logs[i];
            if (log.emitter != portal) continue;
            if (log.topics.length != 2) continue;
            if (log.topics[0] != CROSS_CHAIN_DEPOSIT_TOPIC) continue;

            beneficiary = address(uint160(uint256(log.topics[1])));
            (attestedAmount, targetAssetId) = abi.decode(log.data, (uint256, uint256));
            found = true;
            break;
        }
        if (!found) revert DepositLogNotFound(portal);
        if (amount != attestedAmount) revert AmountMismatch(amount, attestedAmount);
        if (attestedAmount > conduitBackingAvailable) {
            revert InsufficientConduitBacking(attestedAmount, conduitBackingAvailable);
        }

        consumedAttestation[attestationKey] = true;
        consumedExternalTxHash[externalTxHash] = true;
        conduitBackingAvailable -= attestedAmount;
        crossChainDepositsVerified += 1;
        crossChainValueVerified += attestedAmount;
        lastVerifiedSourceHeight = height;
        lastVerifiedChainKey = chainKey;

        emit CrossChainReserveVerified(
            beneficiary,
            chainKey,
            height,
            externalTxHash,
            attestationKey,
            portal,
            attestedAmount,
            targetAssetId
        );

        _creditReserve(beneficiary, attestedAmount);
        credited = attestedAmount;
    }

    /// @notice Read-only dry run of a proof bundle. Uses the precompile's `view` overload so a
    ///         wallet can tell the operator whether a proof will land before they pay gas.
    function previewAttestcoinProof(bytes calldata proofData)
        external
        view
        returns (bool proofValid, address beneficiary, uint256 attestedAmount, uint64 chainKey, uint64 height)
    {
        bytes memory encodedTransaction;
        INativeQueryVerifier.MerkleProof memory merkleProof;
        INativeQueryVerifier.ContinuityProof memory continuityProof;
        (chainKey, height, encodedTransaction, merkleProof, continuityProof) = abi.decode(
            proofData,
            (uint64, uint64, bytes, INativeQueryVerifier.MerkleProof, INativeQueryVerifier.ContinuityProof)
        );

        proofValid = ATTESTCOIN_VERIFIER.verify(
            chainKey,
            height,
            encodedTransaction,
            merkleProof,
            continuityProof
        );

        address portal = trustedSourcePortal[chainKey];
        (, EvmTxDecoder.EvmLog[] memory logs) = EvmTxDecoder.decode(encodedTransaction);
        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].emitter != portal) continue;
            if (logs[i].topics.length != 2) continue;
            if (logs[i].topics[0] != CROSS_CHAIN_DEPOSIT_TOPIC) continue;
            beneficiary = address(uint160(uint256(logs[i].topics[1])));
            (attestedAmount, ) = abi.decode(logs[i].data, (uint256, uint256));
            break;
        }
    }

    /// @notice Top up the tCTC float that backs cross-chain credits.
    /// @dev    In production this is the settlement float held against the source-chain portal's
    ///         balance. On testnet the treasury funds it directly.
    function fundConduitLiquidity() external payable {
        if (msg.value == 0) revert ZeroDeposit();
        conduitBackingAvailable += msg.value;
        emit ConduitLiquidityFunded(msg.sender, msg.value, conduitBackingAvailable);
    }

    /// @notice Register the portal contract this vault will accept Attestcoin proofs from.
    function setTrustedSourcePortal(uint64 chainKey, address portal) external onlyTreasury {
        trustedSourcePortal[chainKey] = portal;
        emit TrustedSourcePortalSet(chainKey, portal);
    }

    /* ------------------------------------------------------------------ */
    /*                         ASSET REGISTRATION                          */
    /* ------------------------------------------------------------------ */

    /// @notice Bind a physical asset identity to the caller.
    /// @param assetId       keccak256(serialNumber) for machinery, or
    ///                      keccak256(h3Index, meterNumber) for commercial property.
    /// @param category      MOVABLE_HARDWARE or FIXED_PROPERTY.
    /// @param declaredValue Operator-declared replacement value, in wei of tCTC.
    /// @param h3CellIndex   Uber H3 resolution-10 cell. Required for FIXED_PROPERTY, 0 otherwise.
    function registerAsset(
        bytes32 assetId,
        AssetCategory category,
        uint256 declaredValue,
        uint64 h3CellIndex
    ) external {
        if (assetOwner[assetId] != address(0)) revert AssetAlreadyRegistered(assetId);
        if (declaredValue == 0) revert DeclaredValueRequired();
        if (category == AssetCategory.FIXED_PROPERTY && h3CellIndex == 0) revert SpatialCellRequired();

        _assets[assetId] = Asset({
            assetId: assetId,
            category: category,
            declaredValue: declaredValue,
            h3CellIndex: category == AssetCategory.FIXED_PROPERTY ? h3CellIndex : 0,
            isActive: true
        });
        assetOwner[assetId] = msg.sender;
        _ownedAssetIds[msg.sender].push(assetId);

        emit AssetRegistered(msg.sender, assetId, category, declaredValue, h3CellIndex);
    }

    /* ------------------------------------------------------------------ */
    /*                            SETTLEMENT                               */
    /* ------------------------------------------------------------------ */

    /// @notice Settle a hardware-attested loss and disburse tCTC to the claimant.
    /// @param assetId        The damaged asset.
    /// @param claimedLoss    Loss in wei of tCTC, capped at the asset's declared value.
    /// @param jitterVariance Accelerometer sigma * 10_000, measured over the 3s spatial sweep.
    /// @param parallaxScore  Motion-parallax score on a 0-1000 scale.
    /// @param liveH3Cell     H3 res-10 cell sampled at claim time. Must match for fixed property.
    /// @return payout        tCTC transferred to the caller.
    function settleClaim(
        bytes32 assetId,
        uint256 claimedLoss,
        uint256 jitterVariance,
        uint256 parallaxScore,
        uint64 liveH3Cell
    ) external nonReentrant returns (uint256 payout) {
        Asset storage asset = _assets[assetId];
        if (asset.assetId == bytes32(0)) revert UnknownAsset(assetId);
        if (assetOwner[assetId] != msg.sender) revert NotAssetOwner(assetId);
        if (!asset.isActive) revert AssetInactive(assetId);
        if (claimedLoss == 0 || claimedLoss > asset.declaredValue) revert InvalidClaimAmount();

        // Hardware attestation. The spatial sweep runs for every claim, so both gates apply to
        // both tracks; fixed property carries the additional spatial lock.
        if (jitterVariance < MIN_JITTER_VARIANCE) {
            revert TremorAttestationFailed(jitterVariance, MIN_JITTER_VARIANCE);
        }
        if (parallaxScore < MIN_PARALLAX_SCORE) {
            revert ParallaxAttestationFailed(parallaxScore, MIN_PARALLAX_SCORE);
        }
        if (asset.category == AssetCategory.FIXED_PROPERTY && liveH3Cell != asset.h3CellIndex) {
            revert SpatialLockFailed(liveH3Cell, asset.h3CellIndex);
        }

        UserReserve storage reserve = reserves[msg.sender];

        // Solvency invariant. Tier 1 is the claimant's own money and drains first.
        uint256 tier1Draw = claimedLoss < reserve.tier1PersonalBalance
            ? claimedLoss
            : reserve.tier1PersonalBalance;
        uint256 remainingLoss = claimedLoss - tier1Draw;

        // The mutual buffer covers the excess, bounded by both a pool-solvency cap and an
        // anti-drain cap tied to what this operator has actually contributed.
        uint256 poolCap = (totalTier2PoolBalance * TIER2_DRAW_CAP_BPS) / BPS_DENOMINATOR;
        uint256 lifetimeCap = reserve.lifetimeDeposits * LIFETIME_DEPOSIT_MULTIPLE;
        uint256 tier2Draw = remainingLoss;
        if (tier2Draw > poolCap) tier2Draw = poolCap;
        if (tier2Draw > lifetimeCap) tier2Draw = lifetimeCap;
        if (tier2Draw > totalTier2PoolBalance) tier2Draw = totalTier2PoolBalance;

        payout = tier1Draw + tier2Draw;
        if (payout == 0) revert NoSettleableReserve();

        // Effects before interaction.
        reserve.tier1PersonalBalance -= tier1Draw;
        totalTier1Balance -= tier1Draw;
        totalTier2PoolBalance -= tier2Draw;
        totalClaimsSettled += 1;
        totalValueDisbursed += payout;
        asset.isActive = false;

        emit ClaimSettled(
            msg.sender,
            assetId,
            claimedLoss,
            tier1Draw,
            tier2Draw,
            payout,
            jitterVariance,
            parallaxScore
        );

        (bool ok, ) = msg.sender.call{value: payout}("");
        if (!ok) revert TransferFailed();
    }

    /* ------------------------------------------------------------------ */
    /*                            WITHDRAWAL                               */
    /* ------------------------------------------------------------------ */

    /// @notice Unencumbered withdrawal of personal Tier 1 funds. No lock-up, no forfeiture.
    function withdrawTier1(uint256 amount) external nonReentrant {
        UserReserve storage reserve = reserves[msg.sender];
        if (amount == 0 || amount > reserve.tier1PersonalBalance) {
            revert InsufficientTier1(amount, reserve.tier1PersonalBalance);
        }

        reserve.tier1PersonalBalance -= amount;
        totalTier1Balance -= amount;

        emit Tier1Withdrawn(msg.sender, amount, reserve.tier1PersonalBalance);

        (bool ok, ) = msg.sender.call{value: amount}("");
        if (!ok) revert TransferFailed();
    }

    /* ------------------------------------------------------------------ */
    /*                             INTERNAL                                */
    /* ------------------------------------------------------------------ */

    /// @dev The single 85/15 accounting path shared by every funding rail.
    function _creditReserve(address operator, uint256 grossAmount) private {
        uint256 tier1Amount = (grossAmount * TIER1_SPLIT_BPS) / BPS_DENOMINATOR;
        // Remainder rather than a second multiplication: no wei is ever stranded.
        uint256 tier2Amount = grossAmount - tier1Amount;

        UserReserve storage reserve = reserves[operator];
        reserve.tier1PersonalBalance += tier1Amount;
        reserve.lifetimeDeposits += grossAmount;
        reserve.lastDepositTimestamp = block.timestamp;

        totalTier1Balance += tier1Amount;
        totalTier2PoolBalance += tier2Amount;

        emit ReserveDeposited(
            operator,
            grossAmount,
            tier1Amount,
            tier2Amount,
            reserve.tier1PersonalBalance,
            totalTier2PoolBalance
        );
    }

    /* ------------------------------------------------------------------ */
    /*                               VIEWS                                 */
    /* ------------------------------------------------------------------ */

    function getAsset(bytes32 assetId) external view returns (Asset memory) {
        Asset memory asset = _assets[assetId];
        if (asset.assetId == bytes32(0)) revert UnknownAsset(assetId);
        return asset;
    }

    function getOwnedAssets(address operator) external view returns (Asset[] memory list) {
        bytes32[] storage ids = _ownedAssetIds[operator];
        list = new Asset[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            list[i] = _assets[ids[i]];
        }
    }

    function getReserve(address operator) external view returns (UserReserve memory) {
        return reserves[operator];
    }

    /// @notice The maximum a given operator could draw from the mutual buffer right now.
    function quoteTier2Headroom(address operator) external view returns (uint256) {
        uint256 poolCap = (totalTier2PoolBalance * TIER2_DRAW_CAP_BPS) / BPS_DENOMINATOR;
        uint256 lifetimeCap = reserves[operator].lifetimeDeposits * LIFETIME_DEPOSIT_MULTIPLE;
        uint256 cap = poolCap < lifetimeCap ? poolCap : lifetimeCap;
        return cap < totalTier2PoolBalance ? cap : totalTier2PoolBalance;
    }

    /// @notice Protocol telemetry in one call, for the dashboard console.
    function protocolTelemetry()
        external
        view
        returns (
            uint256 tier1Total,
            uint256 tier2Pool,
            uint256 claimsSettled,
            uint256 valueDisbursed,
            uint256 crossChainCount,
            uint256 crossChainValue,
            uint256 conduitBacking,
            uint64 lastSourceHeight,
            uint64 lastChainKey
        )
    {
        return (
            totalTier1Balance,
            totalTier2PoolBalance,
            totalClaimsSettled,
            totalValueDisbursed,
            crossChainDepositsVerified,
            crossChainValueVerified,
            conduitBackingAvailable,
            lastVerifiedSourceHeight,
            lastVerifiedChainKey
        );
    }

    /// @notice Total tCTC the contract is holding across both tiers.
    function totalReserves() external view returns (uint256) {
        return address(this).balance;
    }
}
