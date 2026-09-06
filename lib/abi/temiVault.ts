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
    "name": "withdrawTier1",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const temiVaultBytecode = "0x608034609557601f61363438819003918201601f19168301916001600160401b03831184841017609957808492602094604052833981010312609557516001600160a01b0381168082036095576001601a5560915750335b600780546001600160a01b03929092166001600160a01b03199283168117909155601c805490921617905560405161358690816100ae8239f35b6057565b5f80fd5b634e487b7160e01b5f52604160045260245ffdfe60806040526004361015610011575f80fd5b5f3560e01c8063056044db146121eb5780630de5bcb8146121515780630e020252146121345780630f80924714610e235780631904b973146121175780631a4d388814611d115780631c9c088a14611c895780631f4d6a0314611c6c57806324acd5bb14611c335780632829281c14611bf957806328d1db7314611bde57806329eb2cf414611bc15780632cc3ce8014611b1e5780632e9c88e3146119c05780632f76464414611991578063306c820c14611829578063318f1a64146117ea578063374beed814611578578063380b9bc91461155b57806338666089146111db5780634595bed61461152c5780634779db56146115085780634fc663b2146114ea57806359a83598146114c15780635dc565c2146114a557806361d027b31461147d5780636213e981146113245780636b7a7fd8146112c65780636dd89124146112a95780636fb3cfb4146111e057806372dd74c0146111db57806375afc18f146111a1578063788338361461118557806379cd1764146111695780637b775ebc1461111057806381e368b7146110d05780638480d57a146110b3578063876574eb1461106b57806388dcb1691461104c5780638b0ad9761461101a5780638f840ddd14610fff57806391656fba14610fe257806392c824d814610ea457806394a754e014610e45578063a0021cf114610e28578063a2db6e1814610e23578063a435e93714610db5578063b44edecb14610d9a578063b816fc1114610cb9578063c9a396e914610c1b578063cdcddaf5146108f7578063d62aad29146108da578063d66bd5241461087e578063e1a4521814610862578063e1a72b4a14610846578063e5d3925914610829578063e692829214610803578063ee3da05514610755578063f106f89614610739578063f24335db146104d6578063f251c381146104aa578063f490bea51461043c578063f776a0ad1461041f578063f916823114610402578063fe25e00a146103da5763ffd0984d146102ef575f80fd5b346103d65760203660031901126103d6576004356001601d54146103c7576001601d55335f52601560205260405f20811580156103bd575b6103a6575f80838361033c839684965461275b565b815561034a8260105461275b565b601055546040519082825260208201527f2cd8de105dd0197df9875e5090b06ecfe6c56304b8e12418dc87f5ea08d6b57260403392a2335af161038b612ff9565b5015610397575f601d55005b6312171d8360e31b5f5260045ffd5b5490630483a59360e51b5f5260045260245260445ffd5b5080548211610327565b63558a1e0360e11b5f5260045ffd5b5f80fd5b346103d6575f3660031901126103d657601c546040516001600160a01b039091168152602090f35b346103d6575f3660031901126103d6576020601b54604051908152f35b346103d6575f3660031901126103d6576020601454604051908152f35b346103d65760403660031901126103d6576004356001600160401b0381116103d65761046c9036906004016123d0565b6024356001600160401b0381116103d657606091610491610497923690600401612448565b90612fcb565b9060405192835260208301526040820152f35b5f3660031901126103d65734156104c7576104c5343361346c565b005b6356316e8760e01b5f5260045ffd5b346103d65760803660031901126103d65760043560243560028110156103d657604435606435906001600160401b038216918281036103d6575f858152601760205260409020546001600160a01b0316610726578115610717576001841490818061070f575b6107005781156106f9575b60405161055381612347565b868152602081016105648782612792565b604082018581526001600160401b036060840194168452608083019260018452895f52601660205260405f20905181556001810192519160028310156106e5576001600160401b039360039360ff80198354169116179055516002820155019251166001600160401b031983541617825551151560ff60401b82549160401b169060ff60401b1916179055845f52601760205260405f2060018060a01b0333166001600160601b0360a01b825416179055335f52601860205260405f208054600160401b8110156106d15761063e91600182018155612868565b81549060031b9087821b915f19901b1916179055601354600181018091116106bd576013556106a7575b61067560405180946122b5565b602083015260408201527f1142a6affc917ff7f4eea502d1d1f8f982eb3107dc5cbaebd6b4531d745c216260603392a3005b601454600181018091116106bd57601455610668565b634e487b7160e01b5f52601160045260245ffd5b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52602160045260245ffd5b505f610547565b63cd345e3b60e01b5f5260045ffd5b50831561053c565b63394a288960e11b5f5260045ffd5b84633d39a51b60e11b5f5260045260245ffd5b346103d6575f3660031901126103d65760206040516113888152f35b346103d65760203660031901126103d6576001600160a01b03610776612289565b165f52601560205260405f20600f546103e881028181046103e814821517156106bd57612710900460018301546003810290808204600314901517156106bd57600360209401548082115f146107fb576107cf9161275b565b808210156107f35750905b808210156107ec57505b604051908152f35b90506107e4565b9050906107da565b50505f6107cf565b346103d6575f3660031901126103d65760206001600160401b0360065416604051908152f35b346103d6575f3660031901126103d6576020600354604051908152f35b346103d6575f3660031901126103d65760206040516121348152f35b346103d6575f3660031901126103d65760206040516127108152f35b346103d65760203660031901126103d6576001600160a01b0361089f612289565b165f90815260156020908152604091829020805460018201546002830154600390930154855192835293820152928301526060820152608090f35b346103d6575f3660031901126103d6576020604051620151808152f35b346103d65760203660031901126103d6576004356001600160401b0381116103d65761092a61093691369060040161225c565b91905f9281019061249b565b6001600160401b0385165f818152600860205260409020546001600160a01b03169690959093929091908715610c0857839261098b602093889360405196879586956302f4d16760e01b875260048701612614565b03815f610fd25af1908115610bfd575f91610bc3575b5015610bb4576109b0906130a4565b5f929150829081805b8251861015610ba5576109cc8684612747565b5180519095906001600160a01b03168a9003610b9757602086019687516003815103610b8657610a1c7f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f91612706565b5103610b6f575050505050506040610a38925191015190612fcb565b94919290929360015b15610b5c575f851315610b4957600a5480851115610b33575061546086018087116106bd574211610b1c576402540be4008502948086046402540be40014901517156106bd577fb470e361f4be258af4a3b5952c49b1393a49c5f87f88c1da39aef7386834339a60606040976080946001600160401b038a5191610ac483612347565b8a8352896020840152838c84015242858401521695869101528760095586600a5580600b5542600c55846001600160401b0319600d541617600d5588519088825287602083015289820152a482519182526020820152f35b8563746c24ab60e01b5f526004524260245260445ffd5b846364ec291360e11b5f5260045260245260445ffd5b846335779cb160e21b5f5260045260245ffd5b8263420811e160e01b5f5260045260245ffd5b90929496506001919395505b0194929093916109b9565b509092949650600191939550610b7b565b919395600191939550610b7b565b96929150969350939193610a41565b636f5f608760e01b5f5260045ffd5b90506020813d602011610bf5575b81610bde60209383612398565b810103126103d657610bef90612607565b866109a1565b3d9150610bd1565b6040513d5f823e3d90fd5b8663f5ddb80160e01b5f5260045260245ffd5b346103d65760203660031901126103d657610c34612289565b5f6060604051610c4381612362565b828152826020820152826040820152015260018060a01b03165f526015602052608060405f20604051610c7581612362565b815491828252600181015460208301908152606060036002840154936040860194855201549301928352604051938452516020840152516040830152516060820152f35b346103d65760403660031901126103d657610cd2612302565b610cda61229f565b6007549091906001600160a01b03163303610d8b576001600160401b031690815f525f60205260018060a01b0360405f205416610d78576001600160a01b03168015610d695760207fe03727d120899f344de184df2af9378a5efa275abe949641225634ab0f25f79991835f525f825260405f20816001600160601b0360a01b825416179055604051908152a2005b63032a203560e51b5f5260045ffd5b50639271091d60e01b5f5260045260245ffd5b63b90cdbb160e01b5f5260045ffd5b346103d6575f3660031901126103d657602060405160038152f35b346103d6575f3660031901126103d6576101206010546001600160401b03600f54601154601254600454600554916003549360065495604051988952602089015260408801526060870152608086015260a085015260c084015281811660e084015260401c16610100820152f35b612240565b346103d6575f3660031901126103d6576020601a54604051908152f35b346103d65760403660031901126103d65760243580151581036103d657601c546001600160a01b03163303610e95576001601d54146103c757610e8f906001601d55600435612de2565b5f601d55005b63665b32d360e11b5f5260045ffd5b60203660031901126103d6576004356001601d54146103c7576001601d555f81815260196020526040902080546001600160a01b031615610fcf5760058101805460ff8160e01c1660058110156106e557600103610fbc57610f126001600160401b03809260a01c1661279e565b1680421015610faa57506003820154803410610f9457508054600168ff000000000000000160a01b0319163317600160e11b17905534600491909101819055601b54610f5e919061248e565b601b55604051903482527ff73ea5a6268a47d5e2083978af28c0bdf16703b75a1a1dbc31fd1f750d1d89a860203393a35f601d55005b6311700e4f60e21b5f523460045260245260445ffd5b630e10189960e31b5f5260045260245ffd5b83637794cc0160e11b5f5260045260245ffd5b506379ee13b960e11b5f5260045260245ffd5b346103d6575f3660031901126103d6576020601354604051908152f35b346103d6575f3660031901126103d657602047604051908152f35b346103d65760203660031901126103d6576004355f526017602052602060018060a01b0360405f205416604051908152f35b346103d6575f3660031901126103d65760206040516402540be4008152f35b346103d6575f3660031901126103d65760a0600954600a54600b54600c54906001600160401b03600d5416926040519485526020850152604084015260608301526080820152f35b346103d6575f3660031901126103d6576020601254604051908152f35b346103d65760203660031901126103d6576001600160401b036110f1612302565b165f526008602052602060018060a01b0360405f205416604051908152f35b60c03660031901126103d6576084356001600160401b03811681036103d6576001601d54146103c7576111596040916001601d5560a4359060643560443560243560043561287d565b5f601d5582519182526020820152f35b346103d6575f3660031901126103d6576020604051610fd28152f35b346103d6575f3660031901126103d65760206040516103528152f35b346103d6575f3660031901126103d65760206040517f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f8152f35b61232c565b346103d65760403660031901126103d6576111f9612302565b61120161229f565b6007549091906001600160a01b03163303610d8b576001600160401b03165f818152600860205260409020549091906001600160a01b0316611296576001600160a01b03168015610d695760207fe56f7cd60e9fc73619fc4c0efdc539901a05499d514f0abb23f23c301eeec15491835f526008825260405f20816001600160601b0360a01b825416179055604051908152a2005b506359fb5db160e01b5f5260045260245ffd5b346103d6575f3660031901126103d6576020600e54604051908152f35b346103d65760203660031901126103d657600754600435906001600160a01b03163303610d8b577f62cb5b8f95d2f71b121e4423241cf007a3e5a5a99b63891d7395f8066df5935f6040600e548151908152836020820152a1600e55005b346103d65760203660031901126103d6576001600160a01b03611345612289565b165f52601860205260405f20805461135c816123b9565b9161136a6040519384612398565b818352601f19611379836123b9565b015f5b8181106114665750505f5b8281106113de57836040518091602082016020835281518091526020604084019201905f5b8181106113ba575050500390f35b91935091602060a0826113d060019488516122c2565b0194019101918493926113ac565b806113eb60019284612868565b90549060031b1c5f52601660205260405f2060ff60036040519261140e84612347565b8054845261142483878301541660208601612792565b6002810154604085015201546001600160401b038116606084015260401c16151560808201526114548287612747565b5261145f8186612747565b5001611387565b602090611471612768565b8282880101520161137c565b346103d6575f3660031901126103d6576007546040516001600160a01b039091168152602090f35b346103d6575f3660031901126103d65760206040516154608152f35b346103d6575f3660031901126103d65760206001600160401b0360065460401c16604051908152f35b346103d65760203660031901126103d65760206107e46004356127fb565b346103d6575f3660031901126103d65760206115226127d7565b6040519015158152f35b346103d65760203660031901126103d6576004355f526001602052602060ff60405f2054166040519015158152f35b346103d6575f3660031901126103d6576020600f54604051908152f35b346103d65760203660031901126103d6576004356001600160401b0381116103d6576115ab6115f591369060040161225c565b919060206115d05f925f956115be6127be565b506115c76127be565b5081019061249b565b906040969493959296519788928392630f989c4b60e31b845289898860048701612614565b0381610fd25afa948515610bfd575f956117a6575b506001600160401b03165f818152602081905260409020546001600160a01b031695909390919061163a906130a4565b9690505f925b875184101561178f57816001600160a01b0361165c868b612747565b515116036117845760036020611672868b612747565b5101515103611784577f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f36116b360206116ab878c612747565b510151612706565b510361177457506001600160a01b0391506116dd905060206116d58489612747565b510151612737565b5116948515611740575b6040916116f391612747565b51015191602083519381808201958692010103126103d65760a0946001600160401b039351905b6040519515158652600180881b0316602086015260408501526060840152166080820152f35b94506040906116f3906001600160a01b036117686020611760848b612747565b510151612727565b511696915091506116e7565b9091926001905b01929190611640565b90919260019061177b565b91905060a096506001600160401b0394925061171a565b9094506020813d6020116117e2575b816117c260209383612398565b810103126103d6576117db6001600160401b0391612607565b949061160a565b3d91506117b5565b346103d65760203660031901126103d6576001600160401b0361180b612302565b165f525f602052602060018060a01b0360405f205416604051908152f35b346103d65760603660031901126103d6576024356044356001600160a01b038116908190036103d6575f52601560205260405f209081548082105f1461198b5750805b600f54906103e882028281046103e814831517156106bd576127109004936001810154906003820291808304600314901517156106bd57600301549084908281111561197e576118c5926118bf9161275b565b9261275b565b93808511611976575b5080841161196e575b50808311611966575b826118ea9161275b565b6064810290808204606414901517156106bd576127109004821180159290611945576080925f5b838082111561193c576119239161275b565b915b604051938452602084015260408301526060820152f35b50505f91611925565b6103e88102928184046103e814821517156106bd5761271060809404611911565b9150816118e0565b9250836118d7565b9350846118ce565b506118c591505f9261275b565b9061186c565b346103d65760203660031901126103d6576004355f526002602052602060ff60405f2054166040519015158152f35b346103d65760203660031901126103d6576004356001601d54146103c7576001601d555f81815260196020526040902080549091906001600160a01b031615611b0c576005820190815460ff8160e01c1660058110156106e557600103611af957611a376001600160401b03809260a01c1661279e565b16804210611ae7575060028301611a54815460038601549061248e565b835460ff60e01b1916600360e01b17909355601b54611a7490849061275b565b601b5560115491600183018093116106bd57602094611a9e8593611adb956011555460125461248e565b60125560018060a01b0390541680917f3b708080dffedc35c6c87a6c85e86c0a56baeb9aa144e51e08849f1c28fba8c387604051868152a361352e565b5f601d55604051908152f35b639db52e4960e01b5f5260045260245ffd5b50637794cc0160e11b5f5260045260245ffd5b6379ee13b960e11b5f5260045260245ffd5b346103d65760203660031901126103d657600435611b3a612768565b50805f52601660205260405f2060ff600360405192611b5884612347565b80548452611b6f8360018301541660208601612792565b6002810154604085015201546001600160401b038116606084015260401c1615156080820152805115611bae5760a090611bac60405180926122c2565bf35b5063082cdf1f60e11b5f5260045260245ffd5b346103d6575f3660031901126103d6576020601154604051908152f35b346103d6575f3660031901126103d657602060405160018152f35b346103d6575f3660031901126103d65760206040517f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f38152f35b346103d6575f3660031901126103d657601354601454600454600554604080519485526020850193909352918301526060820152608090f35b346103d6575f3660031901126103d6576020600554604051908152f35b346103d65760203660031901126103d657611ca2612289565b6007546001600160a01b03163303610d8b576001600160a01b03168015610d6957601c54604080516001600160a01b0383168152602081018490527fa99fc739cab6b19d8ee27aaf57eabd8d86b73474801240c86a747a5f5ee888419190a16001600160a01b03191617601c55005b346103d65760603660031901126103d6576004356001600160401b0381116103d657611d4190369060040161225c565b602435604435925f92825f52600260205260ff60405f2054166121045790611d6b9181019061249b565b9691949092936001600160401b03811695865f525f60205260018060a01b0360405f2054169889156120f1578151602083012095865f52600160205260ff60405f2054166120de576040516302f4d16760e01b81529160209183918291611dd99190878d8a60048701612614565b03815f610fd25af1908115610bfd575f916120a4575b5015610bb457611dfe906130a4565b9390505f5f945f915f9a5b82518c101561209857611e1c8c84612747565b5180519098906001600160a01b03168e900361208957602089019c8d51600381510361207757611e6c7f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f391612706565b510361205e5750505050505060018060a01b03611e898951612727565b5198519816976001600160a01b0390611ea190612737565b5116938415612056575b60400151602081519181808201938492010103126103d657519060015b156120435781810361202e5750611ede906127fb565b956003548088116120185750825f52600260205260405f20600160ff19825416179055845f52600160205260405f20600160ff19825416179055611f248760035461275b565b6003556004549860018a01809a116106bd577f5655105af0dd9d0e81ccf3b81987e9eed31e59bacb5da431fe95f386832bc08a60a089976001600160401b0361200c9a60409e600455611f798b60055461248e565b6005551695866fffffffffffffffff00000000000000006006549260401b16916fffffffffffffffffffffffffffffffff19161717600655600180831b0388169b8c948e519289845260208401528e830152600180841b03166060820152886080820152a47fb6b5d830d9ee7e772866b65acf8e51ea4a2ff1c6e602d092d0bf366bf3e9b27160208851858152a261346c565b82519182526020820152f35b8763cd081bd160e01b5f5260045260245260445ffd5b63ce6b173b60e01b5f5260045260245260445ffd5b8963785a3a3b60e11b5f5260045260245ffd5b889450611eab565b9092949c50600191939598505b019a9290969391611e09565b509092949c506001919395985061206b565b91939b6001919395985061206b565b96939291509950611ec8565b90506020813d6020116120d6575b816120bf60209383612398565b810103126103d6576120d090612607565b8a611def565b3d91506120b2565b8663b0eea50760e01b5f5260045260245ffd5b876337eab18360e11b5f5260045260245ffd5b8263b0eea50760e01b5f5260045260245ffd5b346103d6575f3660031901126103d6576020600454604051908152f35b346103d6575f3660031901126103d6576020601054604051908152f35b346103d65760203660031901126103d6576004355f52601960205260405f2060018060a01b038154166001600160401b036001830154926002810154906003810154600560048301549201549260ff8460e01c1696604051968752602087015260408601526060850152608084015260018060a01b03811660a084015260a01c1660c082015260058210156106e5576101009160e0820152f35b5f3660031901126103d65734156104c7576122083460035461248e565b806003556040519034825260208201527f15873de5b5375786541a057377d4d2719c0a5f3769d1af962d2263e406cda57460403392a2005b346103d6575f3660031901126103d65760206040516103e88152f35b9181601f840112156103d6578235916001600160401b0383116103d657602083818601950101116103d657565b600435906001600160a01b03821682036103d657565b602435906001600160a01b03821682036103d657565b9060028210156106e55752565b60808091805184526122dc602082015160208601906122b5565b604081015160408501526001600160401b03606082015116606085015201511515910152565b600435906001600160401b03821682036103d657565b35906001600160401b03821682036103d657565b346103d6575f3660031901126103d657602060405160648152f35b60a081019081106001600160401b038211176106d157604052565b608081019081106001600160401b038211176106d157604052565b604081019081106001600160401b038211176106d157604052565b90601f801991011681019081106001600160401b038211176106d157604052565b6001600160401b0381116106d15760051b60200190565b9080601f830112156103d65781356123e7816123b9565b926123f56040519485612398565b81845260208085019260051b8201019283116103d657602001905b82821061241d5750505090565b8135815260209182019101612410565b6001600160401b0381116106d157601f01601f191660200190565b81601f820112156103d65780359061245f8261242d565b9261246d6040519485612398565b828452602083830101116103d657815f926020809301838601378301015290565b919082018092116106bd57565b919060a0838203126103d6576124b083612318565b926124bd60208201612318565b9260408201356001600160401b0381116103d657836124dd918401612448565b9260608301356001600160401b0381116103d65783016040818303126103d6576040519061250a8261237d565b803582526020810135906001600160401b0382116103d6570182601f820112156103d6578035612539816123b9565b916125476040519384612398565b81835260208084019260061b820101908582116103d657602001915b8183106125c8575050506020820152926080810135906001600160401b0382116103d657016040818303126103d6576040519161259f8361237d565b8135835260208201356001600160401b0381116103d6576125c092016123d0565b602082015290565b6040838703126103d657604051906125df8261237d565b8335825260208401359081151582036103d65782602092836040950152815201920191612563565b519081151582036103d657565b92906020926001600160401b038092979697168552168284015260a0604084015280519182918260a08601520160c084015e5f60c08284010152601f801991011681019260c0828503016060830152602061012081610100870193805160c0890152015195604060e08201528651809452019401905f5b8181106126e257505050608081840391015260206060816040850193805186520151936040838201528451809452019201905f5b8181106126cc5750505090565b82518452602093840193909201916001016126bf565b8251805187526020908101511515818801526040909601959092019160010161268b565b8051156127135760200190565b634e487b7160e01b5f52603260045260245ffd5b8051600110156127135760400190565b8051600210156127135760600190565b80518210156127135760209160051b010190565b919082039182116106bd57565b6040519061277582612347565b5f6080838281528260208201528260408201528260608201520152565b60028210156106e55752565b6001600160401b0362015180911601906001600160401b0382116106bd57565b604051906127cb8261237d565b60606020835f81520152565b600b5480151590816127e7575090565b905061546081018091116106bd5742111590565b600b5480156128595761280c6127d7565b156128435750600e5490811561283457600954908181029181830414901517156106bd570490565b63078c583760e51b5f5260045ffd5b63746c24ab60e01b5f526004524260245260445ffd5b639578db0b60e01b5f5260045ffd5b8054821015612713575f5260205f2001905f90565b9291949593835f52601660205260405f20805415612dcf575f858152601760205260409020546001600160a01b03163303612dbc57600381019788549160ff8360401c1615612da95784158015612d9c575b612d8d5760648910612d75576103528610612d5c576001015460ff1660028110156106e557600103612d3557506001600160401b038091169116818103612d205750505b335f52601560205260405f20908154928382105f14612d195781965b879861293b898561275b565b95600f54956103e887028781046103e814881517156106bd576127109004916001820154976003890298808a04600314901517156106bd5760038301938454998a8082115f14612d105761298e9161275b565b905b808c11612d08575b50808b11612d00575b50808a11612cf8575b506129b5898d61248e565b15612ce95789976129d2926129cb8e8c9461275b565b905561248e565b90556129e08960105461275b565b6010556129ef86600f5461275b565b600f55805468ff000000000000000019169055612a0c858961248e565b6040519384528860208501528560408501526060840152608083015260a08201527f32c067efd8d3985facc3f3795ff191139ab27e7c1c64b23a12312f1ea0123d6360c03392a3600f546064810290808204606414901517156106bd576127109004811115612c98576103e881028181046103e814821517156106bd57612710900494348611612c9257855b612aa2813461275b565b95612aad828961275b565b9182612c53575b505050601a54905f1982146106bd5760018201601a5581956040519161010083018381106001600160401b038211176106d15760409081523384526020808501888152858301888152606087018d81525f6080890181815260a0808b01838152426001600160401b031660c08d01908152600160e08e018181528f87526019909a52999094209b518c546001600160a01b0319166001600160a01b03918216178d559651988c0198909855935160028b0155915160038a01559051600489015593516005978801805495516001600160e01b0319909616919093161793901b67ffffffffffffffff60a01b1692909217825551938410156106e557805460ff60e01b191660e09490941b60ff60e01b1693909317909255612bec91612be4612bdc8a8761248e565b601b5461248e565b601b5561248e565b956201518042018042116106bd576001600160401b039160405194898652602086015260408501521660608301527f56d3980e774139cbfcd8dce989759b318800fdc79f67f3a0be40e399f784834660803393a482612c4757565b612c51833361352e565b565b90918093508210612c71575090612c699161275b565b5f8080612ab4565b8791612c7c9161248e565b90634426b53560e11b5f5260045260245260445ffd5b34612a98565b9193505060115490600182018092116106bd57612cda92612cd392601155612ccb612cc3838361248e565b60125461248e565b60125561248e565b349061248e565b612ce4813361352e565b905f90565b631e1f16ef60e31b5f5260045ffd5b98505f6129aa565b99505f6129a1565b9a505f612998565b50505f90612990565b839661292f565b634402954960e11b5f5260045260245260445ffd5b915050838103612d455750612913565b839063736af44560e11b5f5260045260245260445ffd5b85637fdb281960e01b5f5260045261035260245260445ffd5b88635fd3165360e11b5f52600452606460245260445ffd5b63843ce46b60e01b5f5260045ffd5b50600281015485116128cf565b866371066ef160e01b5f5260045260245ffd5b84631461f53360e11b5f5260045260245ffd5b8463082cdf1f60e11b5f5260045260245ffd5b5f81815260196020526040902080546001600160a01b0316918215611b0c57600582019081549160ff8360e01c1660058110156106e557600203611af95760028401549560038501549460048101549460018060a01b031691612e59612e5187612e4c8a8d61248e565b61248e565b601b5461275b565b601b55612ee4575050805460ff60e01b1916600360e01b17905560115460018101939084106106bd57612c519585612e4c93612ede96601155612e9e8360125461248e565b6012557f3b708080dffedc35c6c87a6c85e86c0a56baeb9aa144e51e08849f1c28fba8c36020612ed288612e4c888861248e565b604051908152a361248e565b9061352e565b6001919695949397928260e21b60ff60e01b19825416179055612f0983600f5461248e565b600f55855f526015602052600360405f2001612f2684825461275b565b905501545f526016602052600360405f2001600160401b60ff60401b1982541617905561138883029383850461138814841517156106bd57612c51967f38604170f33463cc95592b641733f7263cf8808e24f4bf0f775fa05f0c3517196040612fba8995612fb5612710612ede9b04998a92612fad612fa5858461275b565b600f5461248e565b600f5561248e565b61275b565b8151908152876020820152a461248e565b91612fdf612fd884612727565b5193612737565b5191602081519181808201938492010103126103d6575190565b3d15613023573d9061300a8261242d565b916130186040519384612398565b82523d5f602084013e565b606090565b519060ff821682036103d657565b81601f820112156103d65780519061304d8261242d565b9261305b6040519485612398565b828452602083830101116103d657815f9260208093018386015e8301015290565b51906001600160401b03821682036103d657565b51906001600160a01b03821682036103d657565b906040519160e083018381106001600160401b038211176106d1576040525f835260208301925f845260408101935f8552606082015f815260808301915f835260a08401915f835260c0850193606085528598875188019760408160208b019a03126103d65761311660208201613028565b506040810151906001600160401b0382116103d657019780603f8a0112156103d6576020890151613146816123b9565b996131546040519b8c612398565b818b52602080808d019360051b83010101918383116103d65760408201905b83821061343d575050505050600388511061342e5761319188612706565b5195865187019360e0888603126103d6576131ae6020890161307c565b966131bb60408a0161307c565b946131c860608b01613090565b938a6131d660808201612607565b936131e360a08301613090565b9260e060c08401519301516001600160401b0381116103d6576001600160401b039e8f9c613218926020809201920101613036565b9052526001600160a01b0390811690915290151590915216905216905216905280515f1981019081116106bd5761324e91612747565b5190815182019160208301906080818503126103d65761327060208201613028565b9361327d6040830161307c565b5060608201516001600160401b0381116103d657820183603f820112156103d6576020810151916132ad836123b9565b926132bb6040519485612398565b8084526020808086019260051b85010101928684116103d65760408101915b84831061332557505050505060808201516001600160401b0381116103d657600193602061330c9260ff950101613036565b5093160361331657565b63678747ed60e01b5f5260045ffd5b82516001600160401b0381116103d65782016020810191906060908603601f1901126103d65760405190606082018281106001600160401b038211176106d15760405260208301516001600160a01b03811681036103d657825260408301516001600160401b0381116103d6576020908401018a601f820112156103d6578051906133af826123b9565b916133bd6040519384612398565b80835260208084019160051b830101918d83116103d657602001905b82821061341e5750505060208301526060830151916001600160401b0383116103d65761340e8b602080969581960101613036565b60408201528152019201916132da565b81518152602091820191016133d9565b63d797fa2760e01b5f5260045ffd5b81516001600160401b0381116103d657602091613461878480809589010101613036565b815201910190613173565b90612134810281810461213414821517156106bd577ff8ce2022830beb6ec696a46e42bce832af3c51a200a9b65f3e0c4113ecde21e59161271060a09204936134b5858361275b565b90600180851b031694855f52601560205260405f20916134d682845461248e565b8355600183016134e785825461248e565b90554260028401556134fb8260105461248e565b60105561350a81600f5461248e565b9283600f5554916040519485526020850152604084015260608301526080820152a2565b811561354c575f80809381935af1613544612ff9565b501561039757565b505056fea26469706673582212208d78cb3acb98929ad09d4edce0d25006d1dd4881887c3e1548992a983d63a74f64736f6c634300081c0033" as const;
