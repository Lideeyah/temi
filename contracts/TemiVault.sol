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
        bool isActive;
        uint64 h3CellIndex;
        /// @notice Months the operator chose to reach `targetReserve` over.
        uint64 targetHorizonMonths;
        uint64 registeredAt;
        uint256 declaredValue;
        /// @notice The reserve this asset should be backed by, in wei of tCTC.
        /// @dev    Tèmi charges no premium, so there is no policy to underwrite. What replaces
        ///         underwriting is sizing: telling an operator how much to hold rather than
        ///         leaving them to guess. Stored so the dashboard can show funding progress
        ///         against a figure the chain agrees with, not one the client invented.
        uint256 targetReserve;
    }

    enum ClaimStatus {
        None,
        Pending,
        Challenged,
        Settled,
        Rejected
    }

    struct PendingClaim {
        address claimant;
        bytes32 assetId;
        /// @notice Tier 2 held back from the pool until the window closes.
        uint256 escrowedTier2;
        /// @notice Withheld from the claimant. Forfeited if the claim is found fraudulent.
        uint256 bond;
        /// @notice Matching stake posted by a challenger, returned if they are right.
        uint256 challengeBond;
        address challenger;
        uint64 filedAt;
        ClaimStatus status;
    }

    struct UserReserve {
        uint256 tier1PersonalBalance;
        uint256 lifetimeDeposits;
        uint256 lastDepositTimestamp;
        /// @notice Cumulative tCTC this operator has ever drawn from the mutual buffer.
        /// @dev    The 3x cap has to be evaluated against this running total, not per claim.
        ///         Evaluated per claim it does not compose: an operator could register many
        ///         assets and collect 3x lifetime deposits on each one, because settlement
        ///         only deactivates the asset it settled. Tracking the draw makes the cap
        ///         a true lifetime bound.
        uint256 lifetimeTier2Drawn;
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

    /// @notice topic0 of Chainlink's `AnswerUpdated(int256,uint256,uint256)`.
    /// @dev    `current` and `roundId` are both indexed, so a valid log carries three topics and
    ///         the price lives in topics[1] — not in the data payload, which holds only updatedAt.
    bytes32 public constant ANSWER_UPDATED_TOPIC =
        keccak256("AnswerUpdated(int256,uint256,uint256)");

    /// @notice Chainlink USD feeds report 8 decimals; the vault works in 18.
    uint256 public constant ORACLE_SCALE_TO_WAD = 1e10;

    /// @notice How old a proven price may be before the vault refuses to price anything with it.
    /// @dev    Deliberately loose. Two latencies stack: the Sepolia ETH/USD feed only writes on
    ///         a heartbeat or a deviation (roughly hourly in practice on testnet), and the
    ///         Attestcoin quorum trails Sepolia's head by ~35 blocks before a proof can even be
    ///         built. A tight window would make the feed unusable rather than safe. Monotonic
    ///         round ids do the real anti-cherry-picking work; this is the outer backstop.
    uint256 public constant MAX_ORACLE_STALENESS = 6 hours;

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

    /// @notice Chainlink aggregator this vault will accept price proofs from, per chain key.
    /// @dev    Write-once, for the same reason as the source portal.
    mapping(uint64 => address) public trustedPriceFeed;

    struct PriceObservation {
        /// @notice USD per unit of the source asset, scaled to 18 decimals.
        uint256 answerWad;
        /// @notice Chainlink round id. Strictly increasing; this is what blocks a replayed dip.
        uint256 roundId;
        /// @notice When the feed itself last wrote, in source-chain time.
        uint256 updatedAt;
        /// @notice When Creditcoin accepted the proof.
        uint256 provenAt;
        /// @notice Source-chain block the proof was drawn from.
        uint64 sourceHeight;
    }

    /// @notice The most recent price read out of Ethereum through the Attestcoin precompile.
    PriceObservation public sourceAssetUsd;

    /// @notice USD per tCTC, 18 decimals.
    /// @dev    The honest gap in this design. Sepolia carries an ETH/USD feed we can prove
    ///         trustlessly; there is no CTC/USD feed on any chain the cc3-testnet attestor set
    ///         covers, so this leg stays a governance parameter until one exists. Both legs are
    ///         surfaced in the UI so nobody has to guess which is which.
    uint256 public ctcUsdWad;

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

    /* ---------------- protocol revenue ---------------- */

    /// @notice Taken from the mutual buffer's contribution to a payout, in basis points.
    /// @dev    Charged on the Tier 2 draw only, never on Tier 1.
    ///
    ///         Tier 1 is the operator's own money and `withdrawTier1` hands it back for nothing.
    ///         Charging to receive it through a claim would be charging for a service already
    ///         available free — and worse, it would be arbitrageable: a merchant whose loss is
    ///         covered by their own balance would withdraw instead of claiming, skipping the
    ///         attestation pipeline entirely and learning to route around the protocol for
    ///         exactly the small, frequent repairs it should be capturing.
    ///
    ///         Charging the mutual draw alone puts the fee where the service is: the protocol
    ///         earns if and only if the community buffer steps in and multiplies an operator's
    ///         capital beyond what they put in. No premium, no subscription, nothing on deposits
    ///         or withdrawals, and nothing at all on a rejected claim.
    uint256 public constant PROTOCOL_SETTLEMENT_FEE_BPS = 150;

    /// @notice The protocol's share of yield earned on idle reserves. 1500 = 15%.
    uint256 public constant YIELD_PROTOCOL_SHARE_BPS = 1_500;

    /// @notice Suggested reserve target as a share of declared value, per asset class.
    /// @dev    Movable hardware fails more often and is replaced whole; commercial property
    ///         damage is usually partial. Exposed on-chain so the figure the interface shows an
    ///         operator is the same one the contract records against their asset.
    uint256 public constant TARGET_RESERVE_MOVABLE_BPS = 3_000; // 30%
    uint256 public constant TARGET_RESERVE_PROPERTY_BPS = 2_000; // 20%

    /* ---------------- optimistic settlement ---------------- */

    /// @notice How long a large mutual-buffer draw sits open to challenge.
    uint256 public constant CHALLENGE_WINDOW = 24 hours;

    /// @notice A Tier 2 draw at or below this share of the buffer settles instantly.
    /// @dev    The escrow exists to protect *other people's* money, so it is keyed to the draw
    ///         from the mutual buffer and not to the size of the claim. A merchant taking their
    ///         own Tier 1 back is never delayed by it, whatever the headline figure.
    uint256 public constant INSTANT_TIER2_CAP_BPS = 100; // 1% of the pool

    /// @notice Bond posted against an escrowed claim, as a share of the escrowed amount.
    uint256 public constant CLAIM_BOND_BPS = 1_000; // 10%

    /// @notice Share of a forfeited bond paid to whoever caught the fraud. The rest joins the pool.
    uint256 public constant CHALLENGER_REWARD_BPS = 5_000; // 50%

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

    mapping(uint256 => PendingClaim) public pendingClaims;
    uint256 public nextClaimId = 1;

    /// @notice tCTC held against open claims — escrowed Tier 2, bonds and challenge stakes.
    /// @dev    Tracked separately so solvency stays checkable: the contract's balance must
    ///         always cover Tier 1 plus the pool plus this.
    uint256 public totalEscrowed;

    /// @notice Resolves challenges. A trust point, and named as one.
    address public arbiter;

    /// @notice Receives settlement fees and the protocol's share of yield.
    address public protocolTreasury;
    uint256 public totalProtocolFees;
    uint256 public totalYieldDistributed;

    /// @notice Cumulative yield per unit of Tier 1, scaled by 1e18.
    /// @dev    The standard scalable-distribution index. Paying every holder directly on each
    ///         distribution would cost gas proportional to the number of merchants; this makes
    ///         a distribution O(1) and each operator's entitlement computable on demand.
    uint256 public yieldPerTier1Wad;
    mapping(address => uint256) private _yieldSnapshot;
    mapping(address => uint256) public accruedYield;

    /// @notice Where idle reserves are put to work. Unset today — see `distributeYield`.
    address public yieldStrategy;

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
    event ConduitLiquidityWithdrawn(address indexed treasury, uint256 amount, uint256 available);

    event PriceObserved(
        uint64 indexed chainKey,
        uint64 indexed sourceHeight,
        address indexed aggregator,
        uint256 answerWad,
        uint256 roundId,
        uint256 updatedAt
    );

    event CtcUsdPriceSet(uint256 previousWad, uint256 newWad);
    event TrustedPriceFeedSet(uint64 indexed chainKey, address aggregator);
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

    event ClaimEscrowed(
        uint256 indexed claimId,
        address indexed claimant,
        bytes32 indexed assetId,
        uint256 immediatePayout,
        uint256 escrowedTier2,
        uint256 bond,
        uint64 challengeableUntil
    );
    event ClaimChallenged(uint256 indexed claimId, address indexed challenger, uint256 challengeBond);
    event ClaimFinalised(uint256 indexed claimId, address indexed claimant, uint256 released);
    event ClaimRejected(
        uint256 indexed claimId,
        address indexed claimant,
        address indexed challenger,
        uint256 returnedToPool,
        uint256 challengerReward
    );
    event ArbiterSet(address previous, address current);
    event ProtocolTreasurySet(address previous, address current);
    event SettlementFeeTaken(
        address indexed operator,
        uint256 tier1Part,
        uint256 tier2Part,
        uint256 fee,
        uint256 net
    );
    event YieldDistributed(uint256 total, uint256 toOperators, uint256 toProtocol, uint256 indexDelta);
    event YieldCompounded(address indexed operator, uint256 amount, uint256 newTier1Balance);
    event YieldStrategySet(address previous, address current);

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
    error PortalAlreadyConfigured(uint64 chainKey);
    error InvalidPortal();
    error SerialPlateMismatch(bytes32 observed, bytes32 expected);
    error PriceFeedNotConfigured(uint64 chainKey);
    error PriceFeedAlreadyConfigured(uint64 chainKey);
    error AnswerUpdatedLogNotFound(address expectedAggregator);
    error InvalidPriceAnswer(int256 answer);
    error NonMonotonicRound(uint256 submitted, uint256 current);
    error StalePriceObservation(uint256 updatedAt, uint256 nowTimestamp);
    error NoPriceObservation();
    error CtcPriceUnset();
    error NotArbiter();
    error UnknownClaim(uint256 claimId);
    error ClaimNotPending(uint256 claimId);
    error ChallengeWindowOpen(uint64 until);
    error ChallengeWindowClosed(uint64 until);
    error InsufficientChallengeBond(uint256 posted, uint256 required);
    error BondRequired(uint256 required, uint256 available);
    error NoYieldToCompound();
    error NoTier1ToDistributeTo();
    error TargetReserveRequired();

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
        arbiter = treasury;
        protocolTreasury = treasury;
    }

    modifier onlyArbiter() {
        if (msg.sender != arbiter) revert NotArbiter();
        _;
    }

    /// @notice Hand challenge resolution to a DAO or dispute-resolution contract.
    function setArbiter(address newArbiter) external onlyTreasury {
        if (newArbiter == address(0)) revert InvalidPortal();
        emit ArbiterSet(arbiter, newArbiter);
        arbiter = newArbiter;
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

        // The attested amount is denominated in the source chain's native asset. Price it
        // through the rate this vault proved for itself out of Ethereum, rather than pretending
        // one ETH is one tCTC.
        uint256 creditedAmount = convertSourceValueToTctc(attestedAmount);
        if (creditedAmount > conduitBackingAvailable) {
            revert InsufficientConduitBacking(creditedAmount, conduitBackingAvailable);
        }

        processedTxHashes[sepTxHash] = true;
        consumedAttestation[attestationKey] = true;
        conduitBackingAvailable -= creditedAmount;
        crossChainDepositsVerified += 1;
        crossChainValueVerified += creditedAmount;
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
            creditedAmount
        );
        emit AttestcoinReserveCredited(sepTxHash, creditedAmount);

        _creditReserve(operator, creditedAmount);
        credited = creditedAmount;
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

    /* ------------------------------------------------------------------ */
    /*            ATTESTCOIN LIVE VALUATION (CHAINLINK READ)               */
    /* ------------------------------------------------------------------ */

    /// @notice Decode a Chainlink `AnswerUpdated` log.
    /// @dev    Pure and public so the decoding can be tested directly, without a proof.
    ///         Both `current` and `roundId` are indexed, so the layout is:
    ///           topics[0] = keccak256("AnswerUpdated(int256,uint256,uint256)")
    ///           topics[1] = int256  current   (the price, at the feed's own decimals)
    ///           topics[2] = uint256 roundId
    ///           data      = uint256 updatedAt
    function decodeAnswerUpdated(bytes32[] memory topics, bytes memory data)
        public
        pure
        returns (int256 answer, uint256 roundId, uint256 updatedAt)
    {
        answer = int256(uint256(topics[1]));
        roundId = uint256(topics[2]);
        updatedAt = abi.decode(data, (uint256));
    }

    /// @notice Read a Chainlink price update off Ethereum and adopt it as the vault's rate.
    ///
    /// @dev    This is the same Attestcoin readability path the deposit rail uses, pointed at a
    ///         different contract. The precompile proves a Chainlink `transmit` transaction was
    ///         included in an attested Ethereum block; we then read the `AnswerUpdated` log out
    ///         of its receipt. No oracle operator, no bridge, and no price is ever pushed to
    ///         Creditcoin — the vault pulls it and verifies inclusion itself.
    ///
    ///         Three guards, in order of how much work they do:
    ///           - the round id must strictly increase, which is what actually prevents someone
    ///             replaying a favourable historical round;
    ///           - the observation must be within MAX_ORACLE_STALENESS, as an outer backstop
    ///             against a feed that has stopped writing altogether;
    ///           - the answer must be positive, since a Chainlink answer is a signed integer.
    ///
    /// @param proof Same encoding as `verifyAndDeposit`: abi.encode(chainKey, height, txBytes,
    ///              MerkleProof, ContinuityProof) straight from the proof builder.
    function submitPriceProof(bytes calldata proof)
        external
        returns (uint256 answerWad, uint256 roundId)
    {
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

        address aggregator = trustedPriceFeed[chainKey];
        if (aggregator == address(0)) revert PriceFeedNotConfigured(chainKey);

        bool verified = ATTESTCOIN_VERIFIER.verifyAndEmit(
            chainKey,
            height,
            encodedTransaction,
            merkleProof,
            continuityProof
        );
        if (!verified) revert AttestcoinVerificationFailed();

        (, EvmTxDecoder.EvmLog[] memory logs) = EvmTxDecoder.decode(encodedTransaction);

        int256 answer;
        uint256 updatedAt;
        bool found;
        for (uint256 i = 0; i < logs.length; i++) {
            EvmTxDecoder.EvmLog memory entry = logs[i];
            if (entry.emitter != aggregator) continue;
            // current + roundId indexed => topic0 plus two.
            if (entry.topics.length != 3) continue;
            if (entry.topics[0] != ANSWER_UPDATED_TOPIC) continue;

            (answer, roundId, updatedAt) = decodeAnswerUpdated(entry.topics, entry.data);
            found = true;
            break;
        }
        if (!found) revert AnswerUpdatedLogNotFound(aggregator);
        if (answer <= 0) revert InvalidPriceAnswer(answer);
        if (roundId <= sourceAssetUsd.roundId) {
            revert NonMonotonicRound(roundId, sourceAssetUsd.roundId);
        }
        if (block.timestamp > updatedAt + MAX_ORACLE_STALENESS) {
            revert StalePriceObservation(updatedAt, block.timestamp);
        }

        // 8 decimals at the feed, 18 everywhere in this contract.
        answerWad = uint256(answer) * ORACLE_SCALE_TO_WAD;

        sourceAssetUsd = PriceObservation({
            answerWad: answerWad,
            roundId: roundId,
            updatedAt: updatedAt,
            provenAt: block.timestamp,
            sourceHeight: height
        });

        emit PriceObserved(chainKey, height, aggregator, answerWad, roundId, updatedAt);
    }

    /// @notice Whether the last proven price is still inside the staleness window.
    function isPriceFresh() public view returns (bool) {
        return
            sourceAssetUsd.updatedAt != 0 &&
            block.timestamp <= sourceAssetUsd.updatedAt + MAX_ORACLE_STALENESS;
    }

    /// @notice Convert an amount of the source chain's native asset into tCTC at the proven rate.
    /// @dev    Reverts rather than falling back to a guess. A silent 1:1 fallback is exactly the
    ///         kind of default that quietly mis-credits a reserve.
    function convertSourceValueToTctc(uint256 sourceWei) public view returns (uint256) {
        if (sourceAssetUsd.updatedAt == 0) revert NoPriceObservation();
        if (!isPriceFresh()) {
            revert StalePriceObservation(sourceAssetUsd.updatedAt, block.timestamp);
        }
        if (ctcUsdWad == 0) revert CtcPriceUnset();

        // sourceWei * (USD per source unit) / (USD per tCTC). Both rates are 18dp, so the
        // scaling cancels and the result is back in wei of tCTC.
        return (sourceWei * sourceAssetUsd.answerWad) / ctcUsdWad;
    }

    /// @notice Register the Chainlink aggregator this vault reads prices from. Write-once.
    function setTrustedPriceFeed(uint64 chainKey, address aggregator) external onlyTreasury {
        if (trustedPriceFeed[chainKey] != address(0)) revert PriceFeedAlreadyConfigured(chainKey);
        if (aggregator == address(0)) revert InvalidPortal();

        trustedPriceFeed[chainKey] = aggregator;
        emit TrustedPriceFeedSet(chainKey, aggregator);
    }

    /// @notice Set USD per tCTC, 18 decimals.
    /// @dev    Mutable, unlike the feed addresses, because it has to track a real market and no
    ///         attested CTC/USD feed exists yet. This is the one trusted input left in the
    ///         valuation path and it is labelled as such in the UI.
    function setCtcUsdPrice(uint256 newWad) external onlyTreasury {
        emit CtcUsdPriceSet(ctcUsdWad, newWad);
        ctcUsdWad = newWad;
    }

    /// @notice Top up the tCTC float that backs cross-chain credits.
    /// @dev    In production this is the settlement float held against the source-chain portal's
    ///         balance. On testnet the treasury funds it directly.
    function fundConduitLiquidity() external payable {
        if (msg.value == 0) revert ZeroDeposit();
        conduitBackingAvailable += msg.value;
        emit ConduitLiquidityFunded(msg.sender, msg.value, conduitBackingAvailable);
    }

    /// @notice Reclaim conduit float that has not been allocated to anyone's reserve.
    /// @dev    The counterpart to `fundConduitLiquidity`, and its absence was a genuine mistake:
    ///         float paid in was a one-way trip, which strands an underwriter's capital the
    ///         moment cross-chain volume is lower than they provisioned for.
    ///
    ///         Only unallocated backing can leave. Once a credit has been issued the tCTC belongs
    ///         to an operator's Tier 1 or to the mutual buffer, and nothing here can reach it —
    ///         `conduitBackingAvailable` has already been decremented by then.
    function withdrawConduitLiquidity(uint256 amount) external onlyTreasury nonReentrant {
        if (amount == 0 || amount > conduitBackingAvailable) {
            revert InsufficientConduitBacking(amount, conduitBackingAvailable);
        }
        conduitBackingAvailable -= amount;
        emit ConduitLiquidityWithdrawn(msg.sender, amount, conduitBackingAvailable);
        _pay(msg.sender, amount);
    }

    /// @notice Register the portal contract this vault will accept Attestcoin proofs from.
    /// @dev    Write-once per chain key. A mutable setter would let a compromised treasury
    ///         repoint the vault at a portal it controls and mint reserve credit up to the
    ///         available float, in one transaction and with no warning. Making it immutable
    ///         removes that path entirely rather than slowing it down with a timelock: there
    ///         is no legitimate reason to change where a chain's attested deposits come from.
    function setTrustedSourcePortal(uint64 chainKey, address portal) external onlyTreasury {
        if (trustedSourcePortal[chainKey] != address(0)) revert PortalAlreadyConfigured(chainKey);
        if (portal == address(0)) revert InvalidPortal();

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
    /// @param targetReserve        Reserve the operator is aiming to hold behind this asset.
    ///                             Pass 0 to accept the protocol's suggestion.
    /// @param targetHorizonMonths  Months they intend to reach it over.
    function registerAsset(
        bytes32 assetId,
        AssetCategory category,
        uint256 declaredValue,
        uint64 h3CellIndex,
        uint256 targetReserve,
        uint64 targetHorizonMonths
    ) external {
        if (assetOwner[assetId] != address(0)) revert AssetAlreadyRegistered(assetId);
        if (declaredValue == 0) revert DeclaredValueRequired();
        if (category == AssetCategory.FIXED_PROPERTY && h3CellIndex == 0) revert SpatialCellRequired();

        uint256 target = targetReserve == 0
            ? suggestedTargetReserve(category, declaredValue)
            : targetReserve;
        if (target == 0) revert TargetReserveRequired();

        _assets[assetId] = Asset({
            assetId: assetId,
            category: category,
            isActive: true,
            h3CellIndex: category == AssetCategory.FIXED_PROPERTY ? h3CellIndex : 0,
            targetHorizonMonths: targetHorizonMonths == 0 ? 6 : targetHorizonMonths,
            registeredAt: uint64(block.timestamp),
            declaredValue: declaredValue,
            targetReserve: target
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
    /// @param claimAssetHash keccak256 of the serial number read off the plate during the sweep.
    ///                       Must equal the assetId for movable hardware, binding the claim to
    ///                       the physical machine that was registered rather than to any damaged
    ///                       object. Ignored for fixed property, which is bound spatially instead.
    /// @return payout  tCTC transferred immediately.
    /// @return claimId  Non-zero when part of the settlement was escrowed for challenge.
    function settleClaim(
        bytes32 assetId,
        uint256 claimedLoss,
        uint256 jitterVariance,
        uint256 parallaxScore,
        uint64 liveH3Cell,
        bytes32 claimAssetHash
    ) external payable nonReentrant returns (uint256 payout, uint256 claimId) {
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
        if (asset.category == AssetCategory.FIXED_PROPERTY) {
            if (liveH3Cell != asset.h3CellIndex) {
                revert SpatialLockFailed(liveH3Cell, asset.h3CellIndex);
            }
        } else if (claimAssetHash != assetId) {
            // Parallax proves the claimant is standing in front of something real. Only the
            // serial plate proves it is *their* machine.
            revert SerialPlateMismatch(claimAssetHash, assetId);
        }

        _accrueYield(msg.sender);
        UserReserve storage reserve = reserves[msg.sender];

        // Solvency invariant. Tier 1 is the claimant's own money and drains first.
        uint256 tier1Draw = claimedLoss < reserve.tier1PersonalBalance
            ? claimedLoss
            : reserve.tier1PersonalBalance;
        uint256 remainingLoss = claimedLoss - tier1Draw;

        // The mutual buffer covers the excess, bounded by a pool-solvency cap and by a
        // lifetime anti-drain allowance tied to what this operator has actually contributed.
        uint256 poolCap = (totalTier2PoolBalance * TIER2_DRAW_CAP_BPS) / BPS_DENOMINATOR;
        uint256 lifetimeCap = reserve.lifetimeDeposits * LIFETIME_DEPOSIT_MULTIPLE;
        uint256 allowance = lifetimeCap > reserve.lifetimeTier2Drawn
            ? lifetimeCap - reserve.lifetimeTier2Drawn
            : 0;

        uint256 tier2Draw = remainingLoss;
        if (tier2Draw > poolCap) tier2Draw = poolCap;
        if (tier2Draw > allowance) tier2Draw = allowance;
        if (tier2Draw > totalTier2PoolBalance) tier2Draw = totalTier2PoolBalance;

        if (tier1Draw + tier2Draw == 0) revert NoSettleableReserve();

        // Accounting first, in both paths.
        reserve.tier1PersonalBalance -= tier1Draw;
        reserve.lifetimeTier2Drawn += tier2Draw;
        totalTier1Balance -= tier1Draw;
        totalTier2PoolBalance -= tier2Draw;
        asset.isActive = false;

        emit ClaimSettled(
            msg.sender,
            assetId,
            claimedLoss,
            tier1Draw,
            tier2Draw,
            tier1Draw + tier2Draw,
            jitterVariance,
            parallaxScore
        );

        // A draw small enough not to matter to anyone else settles on the spot, and so does a
        // claim that only touches the claimant's own Tier 1. That is the common case: the
        // product promise is emergency liquidity, and most honest claims never wait.
        uint256 instantCap = (totalTier2PoolBalance * INSTANT_TIER2_CAP_BPS) / BPS_DENOMINATOR;
        if (tier2Draw <= instantCap) {
            totalClaimsSettled += 1;
            totalValueDisbursed += tier1Draw + tier2Draw;
            // Only the mutual draw is charged. Any bond sent is not a payout and returns whole.
            payout = _disburseClaim(msg.sender, tier1Draw, tier2Draw);
            _pay(msg.sender, msg.value);
            return (payout, 0);
        }

        // Above that, the mutual buffer's share is escrowed and put at risk of challenge.
        uint256 bond = (tier2Draw * CLAIM_BOND_BPS) / BPS_DENOMINATOR;

        // The bond may be posted with the transaction, but it does not have to be: any shortfall
        // is withheld from the claimant's own immediate payout. An honest merchant whose shop
        // just burned down should not need to find spare tCTC before they can file.
        uint256 fromValue = msg.value >= bond ? bond : msg.value;
        uint256 refund = msg.value - fromValue;
        uint256 shortfall = bond - fromValue;
        if (shortfall > 0) {
            if (tier1Draw < shortfall) revert BondRequired(bond, fromValue + tier1Draw);
            tier1Draw -= shortfall;
        }

        claimId = nextClaimId++;
        pendingClaims[claimId] = PendingClaim({
            claimant: msg.sender,
            assetId: assetId,
            escrowedTier2: tier2Draw,
            bond: bond,
            challengeBond: 0,
            challenger: address(0),
            filedAt: uint64(block.timestamp),
            status: ClaimStatus.Pending
        });
        totalEscrowed += tier2Draw + bond;

        // Tier 1 is delivered now and carries no fee. The escrowed mutual portion is charged
        // when it is actually released, and not at all if the claim is rejected.
        payout = _disburseClaim(msg.sender, tier1Draw, 0);

        emit ClaimEscrowed(
            claimId,
            msg.sender,
            assetId,
            payout,
            tier2Draw,
            bond,
            uint64(block.timestamp + CHALLENGE_WINDOW)
        );

        if (refund > 0) _pay(msg.sender, refund);
    }

    /* ------------------------------------------------------------------ */
    /*                      OPTIMISTIC SETTLEMENT                          */
    /* ------------------------------------------------------------------ */

    /// @notice Release an escrowed claim once its window has closed unchallenged.
    /// @dev    Callable by anyone: the claimant should not have to be online, and nobody needs
    ///         permission to complete a settlement the protocol already accepted.
    function finaliseClaim(uint256 claimId) external nonReentrant returns (uint256 released) {
        PendingClaim storage claim = pendingClaims[claimId];
        if (claim.claimant == address(0)) revert UnknownClaim(claimId);
        if (claim.status != ClaimStatus.Pending) revert ClaimNotPending(claimId);

        uint64 until = claim.filedAt + uint64(CHALLENGE_WINDOW);
        if (block.timestamp < until) revert ChallengeWindowOpen(until);

        claim.status = ClaimStatus.Settled;
        totalEscrowed -= claim.escrowedTier2 + claim.bond;
        totalClaimsSettled += 1;
        totalValueDisbursed += claim.escrowedTier2;

        // Everything escrowed came from the mutual buffer, so all of it is fee-bearing.
        released = _disburseClaim(claim.claimant, 0, claim.escrowedTier2);
        _pay(claim.claimant, claim.bond); // their own stake, returned whole

        emit ClaimFinalised(claimId, claim.claimant, released + claim.bond);
    }

    /// @notice Contest an escrowed claim, staking a matching bond against it.
    /// @dev    The stake is what stops the challenge mechanism becoming a free denial-of-service
    ///         against honest merchants: a wrong challenger pays the person they delayed.
    function challengeClaim(uint256 claimId) external payable nonReentrant {
        PendingClaim storage claim = pendingClaims[claimId];
        if (claim.claimant == address(0)) revert UnknownClaim(claimId);
        if (claim.status != ClaimStatus.Pending) revert ClaimNotPending(claimId);

        uint64 until = claim.filedAt + uint64(CHALLENGE_WINDOW);
        if (block.timestamp >= until) revert ChallengeWindowClosed(until);
        if (msg.value < claim.bond) revert InsufficientChallengeBond(msg.value, claim.bond);

        claim.status = ClaimStatus.Challenged;
        claim.challenger = msg.sender;
        claim.challengeBond = msg.value;
        totalEscrowed += msg.value;

        emit ClaimChallenged(claimId, msg.sender, msg.value);
    }

    /// @notice Resolve a challenged claim.
    /// @param fraudulent True if the challenge was correct and the claim should be refused.
    function resolveChallenge(uint256 claimId, bool fraudulent) external onlyArbiter nonReentrant {
        PendingClaim storage claim = pendingClaims[claimId];
        if (claim.claimant == address(0)) revert UnknownClaim(claimId);
        if (claim.status != ClaimStatus.Challenged) revert ClaimNotPending(claimId);

        uint256 escrow = claim.escrowedTier2;
        uint256 bond = claim.bond;
        uint256 challengeBond = claim.challengeBond;
        address claimant = claim.claimant;
        address challenger = claim.challenger;

        totalEscrowed -= escrow + bond + challengeBond;

        if (fraudulent) {
            claim.status = ClaimStatus.Rejected;

            // The buffer is made whole, and the allowance the claim consumed is given back —
            // a rejected claim must not permanently cost an operator their headroom.
            totalTier2PoolBalance += escrow;
            UserReserve storage reserve = reserves[claimant];
            reserve.lifetimeTier2Drawn -= escrow;

            // The asset goes back into cover so an honest re-claim remains possible.
            _assets[claim.assetId].isActive = true;

            uint256 reward = (bond * CHALLENGER_REWARD_BPS) / BPS_DENOMINATOR;
            totalTier2PoolBalance += bond - reward;

            emit ClaimRejected(claimId, claimant, challenger, escrow + bond - reward, reward);
            _pay(challenger, challengeBond + reward);
            return;
        }

        // The challenge was wrong. The claimant is paid, and compensated for the delay out of
        // the challenger's stake.
        claim.status = ClaimStatus.Settled;
        totalClaimsSettled += 1;
        totalValueDisbursed += escrow;

        uint256 net = _disburseClaim(claimant, 0, escrow);
        _pay(claimant, bond + challengeBond); // own stake back, plus the failed challenger's

        emit ClaimFinalised(claimId, claimant, net + bond + challengeBond);
    }

    /// @notice What a claim would do right now, so the interface can show it before it is signed.
    /// @dev    Mirrors `settleClaim` exactly, including the declared-value cap and the fact that
    ///         only the mutual draw is charged. A merchant should never learn the shape of their
    ///         settlement from the receipt.
    /// @return tier1Draw     From the operator's own reserve. Fee-free.
    /// @return tier2Draw     From the mutual buffer. The fee-bearing part.
    /// @return instant       Whether this settles in the same block or waits out a challenge.
    /// @return bondRequired  Extra tCTC the caller must send, beyond what can be withheld.
    /// @return settlementFee What the protocol takes.
    /// @return netPayout     What reaches the merchant.
    function quoteClaim(bytes32 assetId, uint256 claimedLoss, address claimant)
        external
        view
        returns (
            uint256 tier1Draw,
            uint256 tier2Draw,
            bool instant,
            uint256 bondRequired,
            uint256 settlementFee,
            uint256 netPayout
        )
    {
        Asset memory asset = _assets[assetId];
        // Settlement refuses a claim above the declared value, so a quote must too.
        if (asset.declaredValue != 0 && claimedLoss > asset.declaredValue) {
            claimedLoss = asset.declaredValue;
        }

        UserReserve storage reserve = reserves[claimant];
        tier1Draw = claimedLoss < reserve.tier1PersonalBalance ? claimedLoss : reserve.tier1PersonalBalance;

        uint256 poolCap = (totalTier2PoolBalance * TIER2_DRAW_CAP_BPS) / BPS_DENOMINATOR;
        uint256 lifetimeCap = reserve.lifetimeDeposits * LIFETIME_DEPOSIT_MULTIPLE;
        uint256 allowance = lifetimeCap > reserve.lifetimeTier2Drawn
            ? lifetimeCap - reserve.lifetimeTier2Drawn
            : 0;

        tier2Draw = claimedLoss - tier1Draw;
        if (tier2Draw > poolCap) tier2Draw = poolCap;
        if (tier2Draw > allowance) tier2Draw = allowance;
        if (tier2Draw > totalTier2PoolBalance) tier2Draw = totalTier2PoolBalance;

        uint256 remainingPool = totalTier2PoolBalance - tier2Draw;
        instant = tier2Draw <= (remainingPool * INSTANT_TIER2_CAP_BPS) / BPS_DENOMINATOR;
        bondRequired = instant ? 0 : (tier2Draw * CLAIM_BOND_BPS) / BPS_DENOMINATOR;

        // Only the part the claimant cannot cover from their own payout needs new funds.
        if (bondRequired > tier1Draw) bondRequired -= tier1Draw;
        else bondRequired = 0;

        settlementFee = (tier2Draw * PROTOCOL_SETTLEMENT_FEE_BPS) / BPS_DENOMINATOR;
        netPayout = tier1Draw + tier2Draw - settlementFee;
    }

    function _pay(address to, uint256 amount) private {
        if (amount == 0) return;
        (bool ok, ) = to.call{value: amount}("");
        if (!ok) revert TransferFailed();
    }

    /// @notice Pay a claim, net of the settlement fee on its mutual-buffer portion.
    /// @dev    Every path that hands claim money to a merchant goes through here, so the fee is
    ///         charged exactly once per unit disbursed and cannot be forgotten on a new path.
    ///         Returning a bond or a challenger's stake does not go through here: that is the
    ///         operator's own money coming back, not a payout.
    /// @param tier1Part The operator's own reserve. Never charged.
    /// @param tier2Part The mutual buffer's contribution. The only fee-bearing component.
    function _disburseClaim(address to, uint256 tier1Part, uint256 tier2Part)
        private
        returns (uint256 net)
    {
        uint256 gross = tier1Part + tier2Part;
        if (gross == 0) return 0;

        uint256 fee = (tier2Part * PROTOCOL_SETTLEMENT_FEE_BPS) / BPS_DENOMINATOR;
        net = gross - fee;

        if (fee > 0) {
            totalProtocolFees += fee;
            _pay(protocolTreasury, fee);
        }
        emit SettlementFeeTaken(to, tier1Part, tier2Part, fee, net);
        _pay(to, net);
    }

    /* ------------------------------------------------------------------ */
    /*                        PROTOCOL REVENUE                             */
    /* ------------------------------------------------------------------ */

    function setProtocolTreasury(address newTreasury) external onlyTreasury {
        if (newTreasury == address(0)) revert InvalidPortal();
        emit ProtocolTreasurySet(protocolTreasury, newTreasury);
        protocolTreasury = newTreasury;
    }

    /// @notice Nominate the contract that will put idle reserves to work.
    /// @dev    Unset at the time of writing, and deliberately so. Creditcoin exposes no staking
    ///         precompile to the EVM — the runtime's precompile set is signature verification,
    ///         hashing, `SubstrateTransfer` and the USC verifiers — so a vault cannot nominate
    ///         validators from Solidity. A DEX venue would need a router and pool address that
    ///         can be verified on cc3-testnet. Until one of those exists this stays address(0)
    ///         and the interface reports no strategy rather than quoting a yield nobody earned.
    function setYieldStrategy(address strategy) external onlyTreasury {
        emit YieldStrategySet(yieldStrategy, strategy);
        yieldStrategy = strategy;
    }

    /// @notice Bring earned yield into the vault and split it 85/15.
    /// @dev    Payable and permissionless by design: whatever generates the yield — a strategy
    ///         adapter, a validator payout, the treasury during a demonstration — simply sends
    ///         it here. The split and the per-operator accounting are the parts that have to be
    ///         right, and they are the same regardless of where the money came from.
    function distributeYield() external payable {
        if (msg.value == 0) revert ZeroDeposit();
        if (totalTier1Balance == 0) revert NoTier1ToDistributeTo();

        uint256 toProtocol = (msg.value * YIELD_PROTOCOL_SHARE_BPS) / BPS_DENOMINATOR;
        uint256 toOperators = msg.value - toProtocol;

        uint256 delta = (toOperators * 1e18) / totalTier1Balance;
        yieldPerTier1Wad += delta;
        totalYieldDistributed += toOperators;

        if (toProtocol > 0) {
            totalProtocolFees += toProtocol;
            _pay(protocolTreasury, toProtocol);
        }
        emit YieldDistributed(msg.value, toOperators, toProtocol, delta);
    }

    /// @dev Fold an operator's share of everything distributed since we last looked at them.
    ///      Must run before any change to their Tier 1 balance, or the new balance would earn
    ///      yield distributed before they held it.
    function _accrueYield(address operator) private {
        uint256 index = yieldPerTier1Wad;
        uint256 snapshot = _yieldSnapshot[operator];
        if (index > snapshot) {
            uint256 earned = (reserves[operator].tier1PersonalBalance * (index - snapshot)) / 1e18;
            if (earned > 0) accruedYield[operator] += earned;
        }
        _yieldSnapshot[operator] = index;
    }

    /// @notice Yield an operator has earned but not yet compounded.
    function pendingYield(address operator) public view returns (uint256) {
        uint256 index = yieldPerTier1Wad;
        uint256 snapshot = _yieldSnapshot[operator];
        uint256 unrealised = index > snapshot
            ? (reserves[operator].tier1PersonalBalance * (index - snapshot)) / 1e18
            : 0;
        return accruedYield[operator] + unrealised;
    }

    /// @notice Move earned yield into the withdrawable Tier 1 balance.
    function compoundYield() external returns (uint256 amount) {
        _accrueYield(msg.sender);
        amount = accruedYield[msg.sender];
        if (amount == 0) revert NoYieldToCompound();

        accruedYield[msg.sender] = 0;
        reserves[msg.sender].tier1PersonalBalance += amount;
        totalTier1Balance += amount;

        emit YieldCompounded(msg.sender, amount, reserves[msg.sender].tier1PersonalBalance);
    }

    /// @notice The reserve Tèmi suggests backing an asset with, given its declared value.
    function suggestedTargetReserve(AssetCategory category, uint256 declaredValue)
        public
        pure
        returns (uint256)
    {
        uint256 bps = category == AssetCategory.FIXED_PROPERTY
            ? TARGET_RESERVE_PROPERTY_BPS
            : TARGET_RESERVE_MOVABLE_BPS;
        return (declaredValue * bps) / BPS_DENOMINATOR;
    }

    /// @notice How far an operator has funded an asset's target, in basis points.
    /// @dev    Measured against lifetime deposits rather than the current balance, so drawing
    ///         your own money down does not read as losing cover you paid for.
    function coverageHealthBps(bytes32 assetId) external view returns (uint256) {
        Asset memory asset = _assets[assetId];
        if (asset.targetReserve == 0) return 0;
        uint256 funded = reserves[assetOwner[assetId]].lifetimeDeposits;
        uint256 bps = (funded * BPS_DENOMINATOR) / asset.targetReserve;
        return bps > BPS_DENOMINATOR ? BPS_DENOMINATOR : bps;
    }

    /* ------------------------------------------------------------------ */
    /*                            WITHDRAWAL                               */
    /* ------------------------------------------------------------------ */

    /// @notice Unencumbered withdrawal of personal Tier 1 funds. No lock-up, no forfeiture.
    function withdrawTier1(uint256 amount) external nonReentrant {
        _accrueYield(msg.sender);
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
        // Settle what they have earned so far before their balance moves, or the new balance
        // would retroactively earn yield distributed before they held it.
        _accrueYield(operator);

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

    /// @notice The maximum a given operator could draw from the mutual buffer right now,
    ///         net of everything they have already drawn.
    function quoteTier2Headroom(address operator) external view returns (uint256) {
        UserReserve storage reserve = reserves[operator];
        uint256 poolCap = (totalTier2PoolBalance * TIER2_DRAW_CAP_BPS) / BPS_DENOMINATOR;
        uint256 lifetimeCap = reserve.lifetimeDeposits * LIFETIME_DEPOSIT_MULTIPLE;
        uint256 allowance = lifetimeCap > reserve.lifetimeTier2Drawn
            ? lifetimeCap - reserve.lifetimeTier2Drawn
            : 0;

        uint256 cap = poolCap < allowance ? poolCap : allowance;
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
