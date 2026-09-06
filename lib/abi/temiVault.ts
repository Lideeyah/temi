// Generated from contracts/TemiVault.sol by scripts/gen-abi.mjs — do not edit by hand.
export const temiVaultAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "treasury_",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "declared",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "attested",
        "type": "uint256"
      }
    ],
    "name": "AmountMismatch",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "expectedAggregator",
        "type": "address"
      }
    ],
    "name": "AnswerUpdatedLogNotFound",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "assetId",
        "type": "bytes32"
      }
    ],
    "name": "AssetAlreadyRegistered",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "assetId",
        "type": "bytes32"
      }
    ],
    "name": "AssetInactive",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "key",
        "type": "bytes32"
      }
    ],
    "name": "AttestationAlreadyConsumed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AttestcoinVerificationFailed",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "required",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "available",
        "type": "uint256"
      }
    ],
    "name": "BondRequired",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "until",
        "type": "uint64"
      }
    ],
    "name": "ChallengeWindowClosed",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "until",
        "type": "uint64"
      }
    ],
    "name": "ChallengeWindowOpen",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "ClaimNotPending",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CtcPriceUnset",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "DeclaredValueRequired",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "posted",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "required",
        "type": "uint256"
      }
    ],
    "name": "InsufficientChallengeBond",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "requested",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "available",
        "type": "uint256"
      }
    ],
    "name": "InsufficientConduitBacking",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "requested",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "available",
        "type": "uint256"
      }
    ],
    "name": "InsufficientTier1",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidClaimAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidPortal",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "answer",
        "type": "int256"
      }
    ],
    "name": "InvalidPriceAnswer",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "MalformedTxPayload",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoPriceObservation",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoSettleableReserve",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "submitted",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "current",
        "type": "uint256"
      }
    ],
    "name": "NonMonotonicRound",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotArbiter",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "assetId",
        "type": "bytes32"
      }
    ],
    "name": "NotAssetOwner",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotTreasury",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "parallaxScore",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "required",
        "type": "uint256"
      }
    ],
    "name": "ParallaxAttestationFailed",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "chainKey",
        "type": "uint64"
      }
    ],
    "name": "PortalAlreadyConfigured",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "chainKey",
        "type": "uint64"
      }
    ],
    "name": "PriceFeedAlreadyConfigured",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "chainKey",
        "type": "uint64"
      }
    ],
    "name": "PriceFeedNotConfigured",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Reentrancy",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "expectedPortal",
        "type": "address"
      }
    ],
    "name": "ReserveFundedLogNotFound",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "observed",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "expected",
        "type": "bytes32"
      }
    ],
    "name": "SerialPlateMismatch",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SourceTransactionReverted",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SpatialCellRequired",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "liveH3Cell",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "boundH3Cell",
        "type": "uint64"
      }
    ],
    "name": "SpatialLockFailed",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "nowTimestamp",
        "type": "uint256"
      }
    ],
    "name": "StalePriceObservation",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TransferFailed",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "jitterVariance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "required",
        "type": "uint256"
      }
    ],
    "name": "TremorAttestationFailed",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "assetId",
        "type": "bytes32"
      }
    ],
    "name": "UnknownAsset",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "UnknownClaim",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "chainKey",
        "type": "uint64"
      }
    ],
    "name": "UntrustedSourceChain",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ZeroDeposit",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "previous",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "current",
        "type": "address"
      }
    ],
    "name": "ArbiterSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "assetId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "enum TemiVault.AssetCategory",
        "name": "category",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "declaredValue",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "h3CellIndex",
        "type": "uint64"
      }
    ],
    "name": "AssetRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "chainKey",
        "type": "uint64"
      },
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "sourceHeight",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "sepTxHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "attestationKey",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "sourcePortal",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "depositor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "AttestcoinProofVerified",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "sepTxHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "AttestcoinReserveCredited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "challenger",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "challengeBond",
        "type": "uint256"
      }
    ],
    "name": "ClaimChallenged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "assetId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "immediatePayout",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "escrowedTier2",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "bond",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "challengeableUntil",
        "type": "uint64"
      }
    ],
    "name": "ClaimEscrowed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "released",
        "type": "uint256"
      }
    ],
    "name": "ClaimFinalised",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "challenger",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "returnedToPool",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "challengerReward",
        "type": "uint256"
      }
    ],
    "name": "ClaimRejected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "assetId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "claimedLoss",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tier1Draw",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tier2Draw",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "payout",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "jitterVariance",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "parallaxScore",
        "type": "uint256"
      }
    ],
    "name": "ClaimSettled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underwriter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "available",
        "type": "uint256"
      }
    ],
    "name": "ConduitLiquidityFunded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "treasury",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "available",
        "type": "uint256"
      }
    ],
    "name": "ConduitLiquidityWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "previousWad",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newWad",
        "type": "uint256"
      }
    ],
    "name": "CtcUsdPriceSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "chainKey",
        "type": "uint64"
      },
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "sourceHeight",
        "type": "uint64"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "aggregator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "answerWad",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
      }
    ],
    "name": "PriceObserved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "grossAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tier1Amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tier2Amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tier1Balance",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "poolBalance",
        "type": "uint256"
      }
    ],
    "name": "ReserveDeposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "remainingBalance",
        "type": "uint256"
      }
    ],
    "name": "Tier1Withdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "chainKey",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "aggregator",
        "type": "address"
      }
    ],
    "name": "TrustedPriceFeedSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "chainKey",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "portal",
        "type": "address"
      }
    ],
    "name": "TrustedSourcePortalSet",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ANSWER_UPDATED_TOPIC",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ATTESTCOIN_VERIFIER",
    "outputs": [
      {
        "internalType": "contract INativeQueryVerifier",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "BPS_DENOMINATOR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "CHAIN_KEY_ETHEREUM_SEPOLIA",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "CHALLENGER_REWARD_BPS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "CHALLENGE_WINDOW",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "CLAIM_BOND_BPS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "INSTANT_TIER2_CAP_BPS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "LIFETIME_DEPOSIT_MULTIPLE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_ORACLE_STALENESS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MIN_JITTER_VARIANCE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MIN_PARALLAX_SCORE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ORACLE_SCALE_TO_WAD",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "RESERVE_FUNDED_TOPIC",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TIER1_SPLIT_BPS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TIER2_DRAW_CAP_BPS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "arbiter",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "assetOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "challengeClaim",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "conduitBackingAvailable",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "consumedAttestation",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "sourceWei",
        "type": "uint256"
      }
    ],
    "name": "convertSourceValueToTctc",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "crossChainDepositsVerified",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "crossChainValueVerified",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ctcUsdWad",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32[]",
        "name": "topics",
        "type": "bytes32[]"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "decodeAnswerUpdated",
    "outputs": [
      {
        "internalType": "int256",
        "name": "answer",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositReserve",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "finaliseClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "released",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fundConduitLiquidity",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "assetId",
        "type": "bytes32"
      }
    ],
    "name": "getAsset",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "assetId",
            "type": "bytes32"
          },
          {
            "internalType": "enum TemiVault.AssetCategory",
            "name": "category",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "declaredValue",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "h3CellIndex",
            "type": "uint64"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "internalType": "struct TemiVault.Asset",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "getOwnedAssets",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "assetId",
            "type": "bytes32"
          },
          {
            "internalType": "enum TemiVault.AssetCategory",
            "name": "category",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "declaredValue",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "h3CellIndex",
            "type": "uint64"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "internalType": "struct TemiVault.Asset[]",
        "name": "list",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "getReserve",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "tier1PersonalBalance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lifetimeDeposits",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lastDepositTimestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lifetimeTier2Drawn",
            "type": "uint256"
          }
        ],
        "internalType": "struct TemiVault.UserReserve",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isPriceFresh",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastVerifiedChainKey",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastVerifiedSourceHeight",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextClaimId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "pendingClaims",
    "outputs": [
      {
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "assetId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "escrowedTier2",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bond",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "challengeBond",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "challenger",
        "type": "address"
      },
      {
        "internalType": "uint64",
        "name": "filedAt",
        "type": "uint64"
      },
      {
        "internalType": "enum TemiVault.ClaimStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "proof",
        "type": "bytes"
      }
    ],
    "name": "previewAttestcoinProof",
    "outputs": [
      {
        "internalType": "bool",
        "name": "proofValid",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "attestedAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "chainKey",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "height",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "processedTxHashes",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolTelemetry",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tier1Total",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tier2Pool",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "claimsSettled",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "valueDisbursed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "crossChainCount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "crossChainValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "conduitBacking",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "lastSourceHeight",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "lastChainKey",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "assetId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "claimedLoss",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      }
    ],
    "name": "quoteClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tier1Draw",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tier2Draw",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "instant",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "bondRequired",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "quoteTier2Headroom",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "assetId",
        "type": "bytes32"
      },
      {
        "internalType": "enum TemiVault.AssetCategory",
        "name": "category",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "declaredValue",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "h3CellIndex",
        "type": "uint64"
      }
    ],
    "name": "registerAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registryTelemetry",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "assetsRegistered",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "spatialCellsLocked",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "crossChainProofs",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "crossChainValue",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "reserves",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tier1PersonalBalance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lifetimeDeposits",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastDepositTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lifetimeTier2Drawn",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "fraudulent",
        "type": "bool"
      }
    ],
    "name": "resolveChallenge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newArbiter",
        "type": "address"
      }
    ],
    "name": "setArbiter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newWad",
        "type": "uint256"
      }
    ],
    "name": "setCtcUsdPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "chainKey",
        "type": "uint64"
      },
      {
        "internalType": "address",
        "name": "aggregator",
        "type": "address"
      }
    ],
    "name": "setTrustedPriceFeed",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "chainKey",
        "type": "uint64"
      },
      {
        "internalType": "address",
        "name": "portal",
        "type": "address"
      }
    ],
    "name": "setTrustedSourcePortal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "assetId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "claimedLoss",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "jitterVariance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "parallaxScore",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "liveH3Cell",
        "type": "uint64"
      },
      {
        "internalType": "bytes32",
        "name": "claimAssetHash",
        "type": "bytes32"
      }
    ],
    "name": "settleClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "payout",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sourceAssetUsd",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "answerWad",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "provenAt",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "sourceHeight",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "proof",
        "type": "bytes"
      }
    ],
    "name": "submitPriceProof",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "answerWad",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalAssetsRegistered",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalClaimsSettled",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalEscrowed",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalReserves",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSpatialCellsLocked",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTier1Balance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTier2PoolBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalValueDisbursed",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasury",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "name": "trustedPriceFeed",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "name": "trustedSourcePortal",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "proof",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "sepTxHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "verifyAndDeposit",
    "outputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "credited",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawConduitLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawTier1",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const temiVaultBytecode = "0x608034609557601f6136f238819003918201601f19168301916001600160401b03831184841017609957808492602094604052833981010312609557516001600160a01b0381168082036095576001601a5560915750335b600780546001600160a01b03929092166001600160a01b03199283168117909155601c805490921617905560405161364490816100ae8239f35b6057565b5f80fd5b634e487b7160e01b5f52604160045260245ffdfe60806040526004361015610011575f80fd5b5f3560e01c8063056044db146122a95780630de5bcb81461220f5780630e020252146121f25780630f80924714610ee75780631904b973146121d55780631a4d388814611dcf5780631c9c088a14611d475780631f4d6a0314611d2a57806324acd5bb14611cf15780632829281c14611cb757806328d1db7314611c9c57806329eb2cf414611c7f5780632cc3ce8014611bdc5780632e9c88e314611a7e5780632f76464414611a4f578063306c820c146118e7578063318f1a64146118a8578063374beed814611636578063380b9bc91461161957806338666089146112995780634595bed6146115ea5780634779db56146115c65780634fc663b2146115a857806359a835981461157f5780635dc565c21461156357806361d027b31461153b5780636213e981146113e25780636b7a7fd8146113845780636dd89124146113675780636fb3cfb41461129e57806372dd74c01461129957806375afc18f1461125f578063788338361461124357806379cd1764146112275780637b775ebc146111ce57806381e368b71461118e5780638480d57a14611171578063876574eb1461112957806388dcb1691461110a5780638b0ad976146110d85780638f840ddd146110bd57806391656fba146110a057806392c824d814610f6257806394a754e014610f09578063a0021cf114610eec578063a2db6e1814610ee7578063a435e93714610e79578063ad49b53b14610dc0578063b44edecb14610da5578063b816fc1114610cc4578063c9a396e914610c26578063cdcddaf514610902578063d62aad29146108e5578063d66bd52414610889578063e1a452181461086d578063e1a72b4a14610851578063e5d3925914610834578063e69282921461080e578063ee3da05514610760578063f106f89614610744578063f24335db146104e1578063f251c381146104b5578063f490bea514610447578063f776a0ad1461042a578063f91682311461040d578063fe25e00a146103e55763ffd0984d146102fa575f80fd5b346103e15760203660031901126103e1576004356001601d54146103d2576001601d55335f52601560205260405f20811580156103c8575b6103b1575f8083836103478396849654612819565b815561035582601054612819565b601055546040519082825260208201527f2cd8de105dd0197df9875e5090b06ecfe6c56304b8e12418dc87f5ea08d6b57260403392a2335af16103966130b7565b50156103a2575f601d55005b6312171d8360e31b5f5260045ffd5b5490630483a59360e51b5f5260045260245260445ffd5b5080548211610332565b63558a1e0360e11b5f5260045ffd5b5f80fd5b346103e1575f3660031901126103e157601c546040516001600160a01b039091168152602090f35b346103e1575f3660031901126103e1576020601b54604051908152f35b346103e1575f3660031901126103e1576020601454604051908152f35b346103e15760403660031901126103e1576004356001600160401b0381116103e15761047790369060040161248e565b6024356001600160401b0381116103e15760609161049c6104a2923690600401612506565b90613089565b9060405192835260208301526040820152f35b5f3660031901126103e15734156104d2576104d0343361352a565b005b6356316e8760e01b5f5260045ffd5b346103e15760803660031901126103e15760043560243560028110156103e157604435606435906001600160401b038216918281036103e1575f858152601760205260409020546001600160a01b0316610731578115610722576001841490818061071a575b61070b578115610704575b60405161055e81612405565b8681526020810161056f8782612850565b604082018581526001600160401b036060840194168452608083019260018452895f52601660205260405f20905181556001810192519160028310156106f0576001600160401b039360039360ff80198354169116179055516002820155019251166001600160401b031983541617825551151560ff60401b82549160401b169060ff60401b1916179055845f52601760205260405f2060018060a01b0333166001600160601b0360a01b825416179055335f52601860205260405f208054600160401b8110156106dc5761064991600182018155612926565b81549060031b9087821b915f19901b1916179055601354600181018091116106c8576013556106b2575b6106806040518094612373565b602083015260408201527f1142a6affc917ff7f4eea502d1d1f8f982eb3107dc5cbaebd6b4531d745c216260603392a3005b601454600181018091116106c857601455610673565b634e487b7160e01b5f52601160045260245ffd5b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52602160045260245ffd5b505f610552565b63cd345e3b60e01b5f5260045ffd5b508315610547565b63394a288960e11b5f5260045ffd5b84633d39a51b60e11b5f5260045260245ffd5b346103e1575f3660031901126103e15760206040516113888152f35b346103e15760203660031901126103e1576001600160a01b03610781612347565b165f52601560205260405f20600f546103e881028181046103e814821517156106c857612710900460018301546003810290808204600314901517156106c857600360209401548082115f14610806576107da91612819565b808210156107fe5750905b808210156107f757505b604051908152f35b90506107ef565b9050906107e5565b50505f6107da565b346103e1575f3660031901126103e15760206001600160401b0360065416604051908152f35b346103e1575f3660031901126103e1576020600354604051908152f35b346103e1575f3660031901126103e15760206040516121348152f35b346103e1575f3660031901126103e15760206040516127108152f35b346103e15760203660031901126103e1576001600160a01b036108aa612347565b165f90815260156020908152604091829020805460018201546002830154600390930154855192835293820152928301526060820152608090f35b346103e1575f3660031901126103e1576020604051620151808152f35b346103e15760203660031901126103e1576004356001600160401b0381116103e15761093561094191369060040161231a565b91905f92810190612559565b6001600160401b0385165f818152600860205260409020546001600160a01b03169690959093929091908715610c13578392610996602093889360405196879586956302f4d16760e01b8752600487016126d2565b03815f610fd25af1908115610c08575f91610bce575b5015610bbf576109bb90613162565b5f929150829081805b8251861015610bb0576109d78684612805565b5180519095906001600160a01b03168a9003610ba257602086019687516003815103610b9157610a277f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f916127c4565b5103610b7a575050505050506040610a43925191015190613089565b94919290929360015b15610b67575f851315610b5457600a5480851115610b3e575061546086018087116106c8574211610b27576402540be4008502948086046402540be40014901517156106c8577fb470e361f4be258af4a3b5952c49b1393a49c5f87f88c1da39aef7386834339a60606040976080946001600160401b038a5191610acf83612405565b8a8352896020840152838c84015242858401521695869101528760095586600a5580600b5542600c55846001600160401b0319600d541617600d5588519088825287602083015289820152a482519182526020820152f35b8563746c24ab60e01b5f526004524260245260445ffd5b846364ec291360e11b5f5260045260245260445ffd5b846335779cb160e21b5f5260045260245ffd5b8263420811e160e01b5f5260045260245ffd5b90929496506001919395505b0194929093916109c4565b509092949650600191939550610b86565b919395600191939550610b86565b96929150969350939193610a4c565b636f5f608760e01b5f5260045ffd5b90506020813d602011610c00575b81610be960209383612456565b810103126103e157610bfa906126c5565b866109ac565b3d9150610bdc565b6040513d5f823e3d90fd5b8663f5ddb80160e01b5f5260045260245ffd5b346103e15760203660031901126103e157610c3f612347565b5f6060604051610c4e81612420565b828152826020820152826040820152015260018060a01b03165f526015602052608060405f20604051610c8081612420565b815491828252600181015460208301908152606060036002840154936040860194855201549301928352604051938452516020840152516040830152516060820152f35b346103e15760403660031901126103e157610cdd6123c0565b610ce561235d565b6007549091906001600160a01b03163303610d96576001600160401b031690815f525f60205260018060a01b0360405f205416610d83576001600160a01b03168015610d745760207fe03727d120899f344de184df2af9378a5efa275abe949641225634ab0f25f79991835f525f825260405f20816001600160601b0360a01b825416179055604051908152a2005b63032a203560e51b5f5260045ffd5b50639271091d60e01b5f5260045260245ffd5b63b90cdbb160e01b5f5260045ffd5b346103e1575f3660031901126103e157602060405160038152f35b346103e15760203660031901126103e157600754600435906001600160a01b03163303610d96576001601d54146103d2576001601d5580158015610e6e575b610e555780610e13610e4f92600354612819565b806003556040519082825260208201527f6209da68c49a1ab82f87924910d69ee9b9f9c42619a0f339b158f9fb26bb0fa560403392a2336135ec565b5f601d55005b6003549063cd081bd160e01b5f5260045260245260445ffd5b506003548111610dff565b346103e1575f3660031901126103e1576101206010546001600160401b03600f54601154601254600454600554916003549360065495604051988952602089015260408801526060870152608086015260a085015260c084015281811660e084015260401c16610100820152f35b6122fe565b346103e1575f3660031901126103e1576020601a54604051908152f35b346103e15760403660031901126103e15760243580151581036103e157601c546001600160a01b03163303610f53576001601d54146103d257610e4f906001601d55600435612ea0565b63665b32d360e11b5f5260045ffd5b60203660031901126103e1576004356001601d54146103d2576001601d555f81815260196020526040902080546001600160a01b03161561108d5760058101805460ff8160e01c1660058110156106f05760010361107a57610fd06001600160401b03809260a01c1661285c565b16804210156110685750600382015480341061105257508054600168ff000000000000000160a01b0319163317600160e11b17905534600491909101819055601b5461101c919061254c565b601b55604051903482527ff73ea5a6268a47d5e2083978af28c0bdf16703b75a1a1dbc31fd1f750d1d89a860203393a35f601d55005b6311700e4f60e21b5f523460045260245260445ffd5b630e10189960e31b5f5260045260245ffd5b83637794cc0160e11b5f5260045260245ffd5b506379ee13b960e11b5f5260045260245ffd5b346103e1575f3660031901126103e1576020601354604051908152f35b346103e1575f3660031901126103e157602047604051908152f35b346103e15760203660031901126103e1576004355f526017602052602060018060a01b0360405f205416604051908152f35b346103e1575f3660031901126103e15760206040516402540be4008152f35b346103e1575f3660031901126103e15760a0600954600a54600b54600c54906001600160401b03600d5416926040519485526020850152604084015260608301526080820152f35b346103e1575f3660031901126103e1576020601254604051908152f35b346103e15760203660031901126103e1576001600160401b036111af6123c0565b165f526008602052602060018060a01b0360405f205416604051908152f35b60c03660031901126103e1576084356001600160401b03811681036103e1576001601d54146103d2576112176040916001601d5560a4359060643560443560243560043561293b565b5f601d5582519182526020820152f35b346103e1575f3660031901126103e1576020604051610fd28152f35b346103e1575f3660031901126103e15760206040516103528152f35b346103e1575f3660031901126103e15760206040517f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f8152f35b6123ea565b346103e15760403660031901126103e1576112b76123c0565b6112bf61235d565b6007549091906001600160a01b03163303610d96576001600160401b03165f818152600860205260409020549091906001600160a01b0316611354576001600160a01b03168015610d745760207fe56f7cd60e9fc73619fc4c0efdc539901a05499d514f0abb23f23c301eeec15491835f526008825260405f20816001600160601b0360a01b825416179055604051908152a2005b506359fb5db160e01b5f5260045260245ffd5b346103e1575f3660031901126103e1576020600e54604051908152f35b346103e15760203660031901126103e157600754600435906001600160a01b03163303610d96577f62cb5b8f95d2f71b121e4423241cf007a3e5a5a99b63891d7395f8066df5935f6040600e548151908152836020820152a1600e55005b346103e15760203660031901126103e1576001600160a01b03611403612347565b165f52601860205260405f20805461141a81612477565b916114286040519384612456565b818352601f1961143783612477565b015f5b8181106115245750505f5b82811061149c57836040518091602082016020835281518091526020604084019201905f5b818110611478575050500390f35b91935091602060a08261148e6001948851612380565b01940191019184939261146a565b806114a960019284612926565b90549060031b1c5f52601660205260405f2060ff6003604051926114cc84612405565b805484526114e283878301541660208601612850565b6002810154604085015201546001600160401b038116606084015260401c16151560808201526115128287612805565b5261151d8186612805565b5001611445565b60209061152f612826565b8282880101520161143a565b346103e1575f3660031901126103e1576007546040516001600160a01b039091168152602090f35b346103e1575f3660031901126103e15760206040516154608152f35b346103e1575f3660031901126103e15760206001600160401b0360065460401c16604051908152f35b346103e15760203660031901126103e15760206107ef6004356128b9565b346103e1575f3660031901126103e15760206115e0612895565b6040519015158152f35b346103e15760203660031901126103e1576004355f526001602052602060ff60405f2054166040519015158152f35b346103e1575f3660031901126103e1576020600f54604051908152f35b346103e15760203660031901126103e1576004356001600160401b0381116103e1576116696116b391369060040161231a565b9190602061168e5f925f9561167c61287c565b5061168561287c565b50810190612559565b906040969493959296519788928392630f989c4b60e31b8452898988600487016126d2565b0381610fd25afa948515610c08575f95611864575b506001600160401b03165f818152602081905260409020546001600160a01b03169590939091906116f890613162565b9690505f925b875184101561184d57816001600160a01b0361171a868b612805565b515116036118425760036020611730868b612805565b5101515103611842577f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f36117716020611769878c612805565b5101516127c4565b510361183257506001600160a01b03915061179b905060206117938489612805565b5101516127f5565b51169485156117fe575b6040916117b191612805565b51015191602083519381808201958692010103126103e15760a0946001600160401b039351905b6040519515158652600180881b0316602086015260408501526060840152166080820152f35b94506040906117b1906001600160a01b03611826602061181e848b612805565b5101516127e5565b511696915091506117a5565b9091926001905b019291906116fe565b909192600190611839565b91905060a096506001600160401b039492506117d8565b9094506020813d6020116118a0575b8161188060209383612456565b810103126103e1576118996001600160401b03916126c5565b94906116c8565b3d9150611873565b346103e15760203660031901126103e1576001600160401b036118c96123c0565b165f525f602052602060018060a01b0360405f205416604051908152f35b346103e15760603660031901126103e1576024356044356001600160a01b038116908190036103e1575f52601560205260405f209081548082105f14611a495750805b600f54906103e882028281046103e814831517156106c8576127109004936001810154906003820291808304600314901517156106c8576003015490849082811115611a3c576119839261197d91612819565b92612819565b93808511611a34575b50808411611a2c575b50808311611a24575b826119a891612819565b6064810290808204606414901517156106c8576127109004821180159290611a03576080925f5b83808211156119fa576119e191612819565b915b604051938452602084015260408301526060820152f35b50505f916119e3565b6103e88102928184046103e814821517156106c857612710608094046119cf565b91508161199e565b925083611995565b93508461198c565b5061198391505f92612819565b9061192a565b346103e15760203660031901126103e1576004355f526002602052602060ff60405f2054166040519015158152f35b346103e15760203660031901126103e1576004356001601d54146103d2576001601d555f81815260196020526040902080549091906001600160a01b031615611bca576005820190815460ff8160e01c1660058110156106f057600103611bb757611af56001600160401b03809260a01c1661285c565b16804210611ba5575060028301611b12815460038601549061254c565b835460ff60e01b1916600360e01b17909355601b54611b32908490612819565b601b5560115491600183018093116106c857602094611b5c8593611b99956011555460125461254c565b60125560018060a01b0390541680917f3b708080dffedc35c6c87a6c85e86c0a56baeb9aa144e51e08849f1c28fba8c387604051868152a36135ec565b5f601d55604051908152f35b639db52e4960e01b5f5260045260245ffd5b50637794cc0160e11b5f5260045260245ffd5b6379ee13b960e11b5f5260045260245ffd5b346103e15760203660031901126103e157600435611bf8612826565b50805f52601660205260405f2060ff600360405192611c1684612405565b80548452611c2d8360018301541660208601612850565b6002810154604085015201546001600160401b038116606084015260401c1615156080820152805115611c6c5760a090611c6a6040518092612380565bf35b5063082cdf1f60e11b5f5260045260245ffd5b346103e1575f3660031901126103e1576020601154604051908152f35b346103e1575f3660031901126103e157602060405160018152f35b346103e1575f3660031901126103e15760206040517f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f38152f35b346103e1575f3660031901126103e157601354601454600454600554604080519485526020850193909352918301526060820152608090f35b346103e1575f3660031901126103e1576020600554604051908152f35b346103e15760203660031901126103e157611d60612347565b6007546001600160a01b03163303610d96576001600160a01b03168015610d7457601c54604080516001600160a01b0383168152602081018490527fa99fc739cab6b19d8ee27aaf57eabd8d86b73474801240c86a747a5f5ee888419190a16001600160a01b03191617601c55005b346103e15760603660031901126103e1576004356001600160401b0381116103e157611dff90369060040161231a565b602435604435925f92825f52600260205260ff60405f2054166121c25790611e2991810190612559565b9691949092936001600160401b03811695865f525f60205260018060a01b0360405f2054169889156121af578151602083012095865f52600160205260ff60405f20541661219c576040516302f4d16760e01b81529160209183918291611e979190878d8a600487016126d2565b03815f610fd25af1908115610c08575f91612162575b5015610bbf57611ebc90613162565b9390505f5f945f915f9a5b82518c101561215657611eda8c84612805565b5180519098906001600160a01b03168e900361214757602089019c8d51600381510361213557611f2a7f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f3916127c4565b510361211c5750505050505060018060a01b03611f4789516127e5565b5198519816976001600160a01b0390611f5f906127f5565b5116938415612114575b60400151602081519181808201938492010103126103e157519060015b15612101578181036120ec5750611f9c906128b9565b956003548088116120d65750825f52600260205260405f20600160ff19825416179055845f52600160205260405f20600160ff19825416179055611fe287600354612819565b6003556004549860018a01809a116106c8577f5655105af0dd9d0e81ccf3b81987e9eed31e59bacb5da431fe95f386832bc08a60a089976001600160401b036120ca9a60409e6004556120378b60055461254c565b6005551695866fffffffffffffffff00000000000000006006549260401b16916fffffffffffffffffffffffffffffffff19161717600655600180831b0388169b8c948e519289845260208401528e830152600180841b03166060820152886080820152a47fb6b5d830d9ee7e772866b65acf8e51ea4a2ff1c6e602d092d0bf366bf3e9b27160208851858152a261352a565b82519182526020820152f35b8763cd081bd160e01b5f5260045260245260445ffd5b63ce6b173b60e01b5f5260045260245260445ffd5b8963785a3a3b60e11b5f5260045260245ffd5b889450611f69565b9092949c50600191939598505b019a9290969391611ec7565b509092949c5060019193959850612129565b91939b60019193959850612129565b96939291509950611f86565b90506020813d602011612194575b8161217d60209383612456565b810103126103e15761218e906126c5565b8a611ead565b3d9150612170565b8663b0eea50760e01b5f5260045260245ffd5b876337eab18360e11b5f5260045260245ffd5b8263b0eea50760e01b5f5260045260245ffd5b346103e1575f3660031901126103e1576020600454604051908152f35b346103e1575f3660031901126103e1576020601054604051908152f35b346103e15760203660031901126103e1576004355f52601960205260405f2060018060a01b038154166001600160401b036001830154926002810154906003810154600560048301549201549260ff8460e01c1696604051968752602087015260408601526060850152608084015260018060a01b03811660a084015260a01c1660c082015260058210156106f0576101009160e0820152f35b5f3660031901126103e15734156104d2576122c63460035461254c565b806003556040519034825260208201527f15873de5b5375786541a057377d4d2719c0a5f3769d1af962d2263e406cda57460403392a2005b346103e1575f3660031901126103e15760206040516103e88152f35b9181601f840112156103e1578235916001600160401b0383116103e157602083818601950101116103e157565b600435906001600160a01b03821682036103e157565b602435906001600160a01b03821682036103e157565b9060028210156106f05752565b608080918051845261239a60208201516020860190612373565b604081015160408501526001600160401b03606082015116606085015201511515910152565b600435906001600160401b03821682036103e157565b35906001600160401b03821682036103e157565b346103e1575f3660031901126103e157602060405160648152f35b60a081019081106001600160401b038211176106dc57604052565b608081019081106001600160401b038211176106dc57604052565b604081019081106001600160401b038211176106dc57604052565b90601f801991011681019081106001600160401b038211176106dc57604052565b6001600160401b0381116106dc5760051b60200190565b9080601f830112156103e15781356124a581612477565b926124b36040519485612456565b81845260208085019260051b8201019283116103e157602001905b8282106124db5750505090565b81358152602091820191016124ce565b6001600160401b0381116106dc57601f01601f191660200190565b81601f820112156103e15780359061251d826124eb565b9261252b6040519485612456565b828452602083830101116103e157815f926020809301838601378301015290565b919082018092116106c857565b919060a0838203126103e15761256e836123d6565b9261257b602082016123d6565b9260408201356001600160401b0381116103e1578361259b918401612506565b9260608301356001600160401b0381116103e15783016040818303126103e157604051906125c88261243b565b803582526020810135906001600160401b0382116103e1570182601f820112156103e15780356125f781612477565b916126056040519384612456565b81835260208084019260061b820101908582116103e157602001915b818310612686575050506020820152926080810135906001600160401b0382116103e157016040818303126103e1576040519161265d8361243b565b8135835260208201356001600160401b0381116103e15761267e920161248e565b602082015290565b6040838703126103e1576040519061269d8261243b565b8335825260208401359081151582036103e15782602092836040950152815201920191612621565b519081151582036103e157565b92906020926001600160401b038092979697168552168284015260a0604084015280519182918260a08601520160c084015e5f60c08284010152601f801991011681019260c0828503016060830152602061012081610100870193805160c0890152015195604060e08201528651809452019401905f5b8181106127a057505050608081840391015260206060816040850193805186520151936040838201528451809452019201905f5b81811061278a5750505090565b825184526020938401939092019160010161277d565b82518051875260209081015115158188015260409096019590920191600101612749565b8051156127d15760200190565b634e487b7160e01b5f52603260045260245ffd5b8051600110156127d15760400190565b8051600210156127d15760600190565b80518210156127d15760209160051b010190565b919082039182116106c857565b6040519061283382612405565b5f6080838281528260208201528260408201528260608201520152565b60028210156106f05752565b6001600160401b0362015180911601906001600160401b0382116106c857565b604051906128898261243b565b60606020835f81520152565b600b5480151590816128a5575090565b905061546081018091116106c85742111590565b600b548015612917576128ca612895565b156129015750600e549081156128f257600954908181029181830414901517156106c8570490565b63078c583760e51b5f5260045ffd5b63746c24ab60e01b5f526004524260245260445ffd5b639578db0b60e01b5f5260045ffd5b80548210156127d1575f5260205f2001905f90565b9291949593835f52601660205260405f20805415612e8d575f858152601760205260409020546001600160a01b03163303612e7a57600381019788549160ff8360401c1615612e675784158015612e5a575b612e4b5760648910612e33576103528610612e1a576001015460ff1660028110156106f057600103612df357506001600160401b038091169116818103612dde5750505b335f52601560205260405f20908154928382105f14612dd75781965b87986129f98985612819565b95600f54956103e887028781046103e814881517156106c8576127109004916001820154976003890298808a04600314901517156106c85760038301938454998a8082115f14612dce57612a4c91612819565b905b808c11612dc6575b50808b11612dbe575b50808a11612db6575b50612a73898d61254c565b15612da7578997612a9092612a898e8c94612819565b905561254c565b9055612a9e89601054612819565b601055612aad86600f54612819565b600f55805468ff000000000000000019169055612aca858961254c565b6040519384528860208501528560408501526060840152608083015260a08201527f32c067efd8d3985facc3f3795ff191139ab27e7c1c64b23a12312f1ea0123d6360c03392a3600f546064810290808204606414901517156106c8576127109004811115612d56576103e881028181046103e814821517156106c857612710900494348611612d5057855b612b608134612819565b95612b6b8289612819565b9182612d11575b505050601a54905f1982146106c85760018201601a5581956040519161010083018381106001600160401b038211176106dc5760409081523384526020808501888152858301888152606087018d81525f6080890181815260a0808b01838152426001600160401b031660c08d01908152600160e08e018181528f87526019909a52999094209b518c546001600160a01b0319166001600160a01b03918216178d559651988c0198909855935160028b0155915160038a01559051600489015593516005978801805495516001600160e01b0319909616919093161793901b67ffffffffffffffff60a01b1692909217825551938410156106f057805460ff60e01b191660e09490941b60ff60e01b1693909317909255612caa91612ca2612c9a8a8761254c565b601b5461254c565b601b5561254c565b956201518042018042116106c8576001600160401b039160405194898652602086015260408501521660608301527f56d3980e774139cbfcd8dce989759b318800fdc79f67f3a0be40e399f784834660803393a482612d0557565b612d0f83336135ec565b565b90918093508210612d2f575090612d2791612819565b5f8080612b72565b8791612d3a9161254c565b90634426b53560e11b5f5260045260245260445ffd5b34612b56565b9193505060115490600182018092116106c857612d9892612d9192601155612d89612d81838361254c565b60125461254c565b60125561254c565b349061254c565b612da281336135ec565b905f90565b631e1f16ef60e31b5f5260045ffd5b98505f612a68565b99505f612a5f565b9a505f612a56565b50505f90612a4e565b83966129ed565b634402954960e11b5f5260045260245260445ffd5b915050838103612e0357506129d1565b839063736af44560e11b5f5260045260245260445ffd5b85637fdb281960e01b5f5260045261035260245260445ffd5b88635fd3165360e11b5f52600452606460245260445ffd5b63843ce46b60e01b5f5260045ffd5b506002810154851161298d565b866371066ef160e01b5f5260045260245ffd5b84631461f53360e11b5f5260045260245ffd5b8463082cdf1f60e11b5f5260045260245ffd5b5f81815260196020526040902080546001600160a01b0316918215611bca57600582019081549160ff8360e01c1660058110156106f057600203611bb75760028401549560038501549460048101549460018060a01b031691612f17612f0f87612f0a8a8d61254c565b61254c565b601b54612819565b601b55612fa2575050805460ff60e01b1916600360e01b17905560115460018101939084106106c857612d0f9585612f0a93612f9c96601155612f5c8360125461254c565b6012557f3b708080dffedc35c6c87a6c85e86c0a56baeb9aa144e51e08849f1c28fba8c36020612f9088612f0a888861254c565b604051908152a361254c565b906135ec565b6001919695949397928260e21b60ff60e01b19825416179055612fc783600f5461254c565b600f55855f526015602052600360405f2001612fe4848254612819565b905501545f526016602052600360405f2001600160401b60ff60401b1982541617905561138883029383850461138814841517156106c857612d0f967f38604170f33463cc95592b641733f7263cf8808e24f4bf0f775fa05f0c35171960406130788995613073612710612f9c9b04998a9261306b6130638584612819565b600f5461254c565b600f5561254c565b612819565b8151908152876020820152a461254c565b9161309d613096846127e5565b51936127f5565b5191602081519181808201938492010103126103e1575190565b3d156130e1573d906130c8826124eb565b916130d66040519384612456565b82523d5f602084013e565b606090565b519060ff821682036103e157565b81601f820112156103e15780519061310b826124eb565b926131196040519485612456565b828452602083830101116103e157815f9260208093018386015e8301015290565b51906001600160401b03821682036103e157565b51906001600160a01b03821682036103e157565b906040519160e083018381106001600160401b038211176106dc576040525f835260208301925f845260408101935f8552606082015f815260808301915f835260a08401915f835260c0850193606085528598875188019760408160208b019a03126103e1576131d4602082016130e6565b506040810151906001600160401b0382116103e157019780603f8a0112156103e157602089015161320481612477565b996132126040519b8c612456565b818b52602080808d019360051b83010101918383116103e15760408201905b8382106134fb57505050505060038851106134ec5761324f886127c4565b5195865187019360e0888603126103e15761326c6020890161313a565b9661327960408a0161313a565b9461328660608b0161314e565b938a613294608082016126c5565b936132a160a0830161314e565b9260e060c08401519301516001600160401b0381116103e1576001600160401b039e8f9c6132d69260208092019201016130f4565b9052526001600160a01b0390811690915290151590915216905216905216905280515f1981019081116106c85761330c91612805565b5190815182019160208301906080818503126103e15761332e602082016130e6565b9361333b6040830161313a565b5060608201516001600160401b0381116103e157820183603f820112156103e15760208101519161336b83612477565b926133796040519485612456565b8084526020808086019260051b85010101928684116103e15760408101915b8483106133e357505050505060808201516001600160401b0381116103e15760019360206133ca9260ff9501016130f4565b509316036133d457565b63678747ed60e01b5f5260045ffd5b82516001600160401b0381116103e15782016020810191906060908603601f1901126103e15760405190606082018281106001600160401b038211176106dc5760405260208301516001600160a01b03811681036103e157825260408301516001600160401b0381116103e1576020908401018a601f820112156103e15780519061346d82612477565b9161347b6040519384612456565b80835260208084019160051b830101918d83116103e157602001905b8282106134dc5750505060208301526060830151916001600160401b0383116103e1576134cc8b6020809695819601016130f4565b6040820152815201920191613398565b8151815260209182019101613497565b63d797fa2760e01b5f5260045ffd5b81516001600160401b0381116103e15760209161351f8784808095890101016130f4565b815201910190613231565b90612134810281810461213414821517156106c8577ff8ce2022830beb6ec696a46e42bce832af3c51a200a9b65f3e0c4113ecde21e59161271060a09204936135738583612819565b90600180851b031694855f52601560205260405f209161359482845461254c565b8355600183016135a585825461254c565b90554260028401556135b98260105461254c565b6010556135c881600f5461254c565b9283600f5554916040519485526020850152604084015260608301526080820152a2565b811561360a575f80809381935af16136026130b7565b50156103a257565b505056fea26469706673582212201fc286f4b884c900c3e7236ac3962d501fea2a45cbba0ec06a2591fa5200059464736f6c634300081c0033" as const;
