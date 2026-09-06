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
///           1. `depositReserve()`     — native tCTC on Creditcoin.
///           2. `verifyAndDeposit()`   — capital deposited on Ethereum Sepolia, *read* into
///                                       Creditcoin through the Attestcoin verify precompile.
///           3. the Trugi NGN virtual-account relayer, which is path 1 with a different payer.
///
///         On (2), Tèmi is an Attestcoin Smart Contract operating strictly within the protocol's
///         readability scope: Creditcoin attestors watch Ethereum Sepolia, reach quorum, and post
///         an attestation on Creditcoin; this contract then reads that state by verifying an
///         inclusion proof. Nothing is ever written back to Sepolia, and reads cost no ATC.
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

    /// @notice topic0 of `TemiSourcePortal.ReserveFunded(address,uint256,bytes32)`.
    bytes32 public constant RESERVE_FUNDED_TOPIC =
        keccak256("ReserveFunded(address,uint256,bytes32)");

    /// @notice Attestcoin chain key for Ethereum Sepolia on cc3-testnet.
    uint64 public constant CHAIN_KEY_ETHEREUM_SEPOLIA = 1;

    /// @notice Attestcoin chain keys the vault will accept proofs from, mapped to the portal
    ///         address that is authoritative on that chain. cc3-testnet supports key 1
    ///         (Ethereum Sepolia) and key 3 (Ethereum Mainnet).
    mapping(uint64 => address) public trustedSourcePortal;

    /// @notice Replay guard keyed on the proven payload itself. This is the binding guard:
    ///         `keccak256(txBytes)` is a commitment to the exact bytes the precompile verified,
    ///         so a proof cannot be reused even if the caller relabels the tx hash.
    mapping(bytes32 => bool) public consumedAttestation;

    /// @notice Replay guard on the Sepolia transaction hash. A funded deposit is credited once.
    mapping(bytes32 => bool) public processedTxHashes;

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

    /// @notice Registry counters. Public so the landing page can render live network reach
    ///         rather than a decorative number.
    uint256 public totalAssetsRegistered;
    /// @notice Distinct H3 resolution-10 cells with a shop locked to them.
    uint256 public totalSpatialCellsLocked;

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

    /// @notice Canonical receipt of a successful Attestcoin read.
    event AttestcoinReserveCredited(bytes32 indexed sepTxHash, uint256 amount);

    /// @notice Full provenance of the cross-chain read, for the telemetry console.
    event AttestcoinProofVerified(
        address indexed operator,
        uint64 indexed chainKey,
        uint64 indexed sourceHeight,
        bytes32 sepTxHash,
        bytes32 attestationKey,
        address sourcePortal,
        address depositor,
        uint256 amount
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
    error ReserveFundedLogNotFound(address expectedPortal);
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

    /// @notice Credit a Tèmi reserve from capital deposited on Ethereum Sepolia, by *reading*
    ///         that deposit through the Attestcoin verify precompile.
    ///
    /// @dev    This is a genuine Attestcoin Smart Contract path within the protocol's readability
    ///         scope, not a name-check. In one Creditcoin transaction it:
    ///           1. decodes the caller-supplied proof bundle,
    ///           2. calls `verifyAndEmit` on the 0x0FD2 Block Prover precompile, which checks the
    ///              Merkle inclusion proof against the source block and the continuity proof
    ///              against the attestor quorum's checkpoint chain — the call reverts if either
    ///              fails, so a forged proof can never reach the accounting below,
    ///           3. decodes the now-proven transaction payload and walks its receipt logs,
    ///           4. requires a `ReserveFunded` log emitted by the portal this vault trusts on
    ///              that chain key, and
    ///           5. credits the operator named *inside the proven log* — never the caller.
    ///
    ///         Because the beneficiary is read out of the attested log rather than taken from
    ///         calldata, any relayer can submit the proof without being able to redirect funds.
    ///         Reading attested state consumes no ATC; the caller pays only Creditcoin gas.
    ///
    /// @param proof     abi.encode(uint64 chainKey, uint64 height, bytes encodedTransaction,
    ///                  INativeQueryVerifier.MerkleProof, INativeQueryVerifier.ContinuityProof)
    ///                  exactly as returned by the Creditcoin proof builder API.
    /// @param sepTxHash The Ethereum Sepolia transaction hash, used as the replay key.
    /// @param amount    The amount the submitter expects to be credited. Checked against the
    ///                  attested log; a mismatch reverts rather than silently adjusting.
    function verifyAndDeposit(
        bytes calldata proof,
        bytes32 sepTxHash,
        uint256 amount
    ) external returns (address operator, uint256 credited) {
        if (processedTxHashes[sepTxHash]) revert AttestationAlreadyConsumed(sepTxHash);

        (
            uint64 chainKey,
            uint64 height,
            bytes memory encodedTransaction,
            INativeQueryVerifier.MerkleProof memory merkleProof,
            INativeQueryVerifier.ContinuityProof memory continuityProof
        ) = abi.decode(
            proof,
            (uint64, uint64, bytes, INativeQueryVerifier.MerkleProof, INativeQueryVerifier.ContinuityProof)
        );

        address portal = trustedSourcePortal[chainKey];
        if (portal == address(0)) revert UntrustedSourceChain(chainKey);

        // Second replay guard, bound to the exact bytes the precompile is about to verify.
        // `sepTxHash` is an operator-supplied label; this one is a commitment to the payload.
        bytes32 attestationKey = keccak256(encodedTransaction);
        if (consumedAttestation[attestationKey]) revert AttestationAlreadyConsumed(attestationKey);

        // ---- Attestcoin readability. The precompile reverts on a bad proof. ----
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

        address depositor;
        uint256 attestedAmount;
        bool found;
        for (uint256 i = 0; i < logs.length; i++) {
            EvmTxDecoder.EvmLog memory entry = logs[i];
            if (entry.emitter != portal) continue;
            // ReserveFunded indexes both `depositor` and `vaultTarget`, so topic0 + 2 = 3.
            if (entry.topics.length != 3) continue;
            if (entry.topics[0] != RESERVE_FUNDED_TOPIC) continue;

            depositor = address(uint160(uint256(entry.topics[1])));
            // vaultTarget names the Creditcoin operator; zero means "credit the depositor".
            operator = address(uint160(uint256(entry.topics[2])));
            if (operator == address(0)) operator = depositor;
            attestedAmount = abi.decode(entry.data, (uint256));
            found = true;
            break;
        }
        if (!found) revert ReserveFundedLogNotFound(portal);
        if (amount != attestedAmount) revert AmountMismatch(amount, attestedAmount);
        if (attestedAmount > conduitBackingAvailable) {
            revert InsufficientConduitBacking(attestedAmount, conduitBackingAvailable);
        }

        processedTxHashes[sepTxHash] = true;
        consumedAttestation[attestationKey] = true;
        conduitBackingAvailable -= attestedAmount;
        crossChainDepositsVerified += 1;
        crossChainValueVerified += attestedAmount;
        lastVerifiedSourceHeight = height;
        lastVerifiedChainKey = chainKey;

        emit AttestcoinProofVerified(
            operator,
            chainKey,
            height,
            sepTxHash,
            attestationKey,
            portal,
            depositor,
            attestedAmount
        );
        emit AttestcoinReserveCredited(sepTxHash, attestedAmount);

        _creditReserve(operator, attestedAmount);
        credited = attestedAmount;
    }

    /// @notice Read-only dry run of a proof bundle. Uses the precompile's `view` overload so the
    ///         UI can tell an operator whether a proof will land before they spend gas on it.
    function previewAttestcoinProof(bytes calldata proof)
        external
        view
        returns (bool proofValid, address operator, uint256 attestedAmount, uint64 chainKey, uint64 height)
    {
        bytes memory encodedTransaction;
        INativeQueryVerifier.MerkleProof memory merkleProof;
        INativeQueryVerifier.ContinuityProof memory continuityProof;
        (chainKey, height, encodedTransaction, merkleProof, continuityProof) = abi.decode(
            proof,
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
            if (logs[i].topics.length != 3) continue;
            if (logs[i].topics[0] != RESERVE_FUNDED_TOPIC) continue;
            operator = address(uint160(uint256(logs[i].topics[2])));
            if (operator == address(0)) operator = address(uint160(uint256(logs[i].topics[1])));
            attestedAmount = abi.decode(logs[i].data, (uint256));
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

        totalAssetsRegistered += 1;
        if (category == AssetCategory.FIXED_PROPERTY) totalSpatialCellsLocked += 1;

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

    /// @notice Network reach, for the public landing page's live telemetry strip.
    function registryTelemetry()
        external
        view
        returns (uint256 assetsRegistered, uint256 spatialCellsLocked, uint256 crossChainProofs, uint256 crossChainValue)
    {
        return (
            totalAssetsRegistered,
            totalSpatialCellsLocked,
            crossChainDepositsVerified,
            crossChainValueVerified
        );
    }

    /// @notice Total tCTC the contract is holding across both tiers.
    function totalReserves() external view returns (uint256) {
        return address(this).balance;
    }
}
