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
    "inputs": [],
    "name": "NoTier1ToDistributeTo",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoYieldToCompound",
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
    "name": "TargetReserveRequired",
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
    "name": "ProtocolTreasurySet",
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
        "name": "tier1Part",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tier2Part",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "net",
        "type": "uint256"
      }
    ],
    "name": "SettlementFeeTaken",
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
        "name": "newTier1Balance",
        "type": "uint256"
      }
    ],
    "name": "YieldCompounded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "total",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "toOperators",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "toProtocol",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "indexDelta",
        "type": "uint256"
      }
    ],
    "name": "YieldDistributed",
    "type": "event"
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
    "name": "YieldStrategySet",
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
    "name": "PROTOCOL_SETTLEMENT_FEE_BPS",
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
    "name": "TARGET_RESERVE_MOVABLE_BPS",
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
    "name": "TARGET_RESERVE_PROPERTY_BPS",
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
    "name": "YIELD_PROTOCOL_SHARE_BPS",
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
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "accruedYield",
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
    "name": "compoundYield",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
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
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "assetId",
        "type": "bytes32"
      }
    ],
    "name": "coverageHealthBps",
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
    "inputs": [],
    "name": "distributeYield",
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
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          },
          {
            "internalType": "uint64",
            "name": "h3CellIndex",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "targetHorizonMonths",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "registeredAt",
            "type": "uint64"
          },
          {
            "internalType": "uint256",
            "name": "declaredValue",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "targetReserve",
            "type": "uint256"
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
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          },
          {
            "internalType": "uint64",
            "name": "h3CellIndex",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "targetHorizonMonths",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "registeredAt",
            "type": "uint64"
          },
          {
            "internalType": "uint256",
            "name": "declaredValue",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "targetReserve",
            "type": "uint256"
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
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "pendingYield",
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
    "inputs": [],
    "name": "protocolTreasury",
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
      },
      {
        "internalType": "uint256",
        "name": "settlementFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "netPayout",
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
      },
      {
        "internalType": "uint256",
        "name": "targetReserve",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "targetHorizonMonths",
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
        "internalType": "address",
        "name": "newTreasury",
        "type": "address"
      }
    ],
    "name": "setProtocolTreasury",
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
        "internalType": "address",
        "name": "strategy",
        "type": "address"
      }
    ],
    "name": "setYieldStrategy",
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
    "inputs": [
      {
        "internalType": "enum TemiVault.AssetCategory",
        "name": "category",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "declaredValue",
        "type": "uint256"
      }
    ],
    "name": "suggestedTargetReserve",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
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
    "name": "totalProtocolFees",
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
    "name": "totalYieldDistributed",
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
  },
  {
    "inputs": [],
    "name": "yieldPerTier1Wad",
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
    "name": "yieldStrategy",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const temiVaultBytecode = "0x608034609f57601f61429538819003918201601f19168301916001600160401b0383118484101760a357808492602094604052833981010312609f57516001600160a01b038116808203609f576001601a55609b5750335b600780546001600160a01b03929092166001600160a01b03199283168117909155601c8054831682179055601d80549092161790556040516141dd90816100b88239f35b6057565b5f80fd5b634e487b7160e01b5f52604160045260245ffdfe60806040526004361015610011575f80fd5b5f3560e01c8063056044db14612a665780630c5a61f8146129d75780630de5bcb81461293d5780630e020252146129205780630f80924714610ec957806313f14fee146128f85780631904b973146128db5780631a4d3888146124d55780631c9c088a146124465780631f4d6a031461242957806324acd5bb146123f05780632829281c146123b657806328d1db731461239b57806329eb2cf41461237e5780632c4f2416146122f55780632cc3ce80146122315780632e9c88e3146120c65780632f76464414612097578063306c820c14611e58578063318f1a6414611e19578063348ecf0014611dfd578063374beed814611b8b578063380b9bc914611b6e578063386660891461149a5780634595bed614611b3f5780634779db5614611b1b5780634bf35e0f14611aff5780634fc663b214611ae157806359a8359814611ab85780635dc565c214611a9c57806361d027b314611a745780636213e981146118fa5780636b7a7fd81461189c5780636dd891241461187f5780636f0a7ef0146118645780636fb3cfb414611796578063717996f2146117785780637290ba401461149f57806372dd74c01461149a57806375afc18f14611460578063788338361461144457806379cd1764146114285780637b775ebc146113cf5780637e393cbe14611318578063803db96d146112f057806381e368b7146112b05780638480d57a14611293578063876574eb1461124b57806388dcb1691461122c5780638a570a121461111d5780638b0ad976146110eb5780638f840ddd146110d057806391656fba146110b357806392c824d814610f6157806394a754e014610f0857806397206bd514610eeb578063a0021cf114610ece578063a2db6e1814610ec9578063a435e93714610e5b578063ad49b53b14610da2578063b44edecb14610d87578063b816fc1114610ca1578063c6f54d0114610c75578063c744ad1914610c3d578063c7bf198014610bb5578063c9a396e914610b17578063cdcddaf5146107cc578063d62aad29146107af578063d66bd52414610753578063e1a4521814610737578063e1a72b4a1461071b578063e42f5365146106ff578063e5d39259146106e2578063e6928292146106bc578063ee3da055146105fa578063f106f896146105de578063f19c32d9146105c2578063f251c38114610596578063f490bea514610528578063f526e39a1461050b578063f776a0ad146104ee578063f9168231146104d1578063fe25e00a146104a95763ffd0984d146103b5575f80fd5b346104a55760203660031901126104a5576004356001602454146104965760016024556103e13361412d565b335f52601560205260405f208115801561048c575b610475575f80838361040b8396849654613007565b815561041982601054613007565b601055546040519082825260208201527f2cd8de105dd0197df9875e5090b06ecfe6c56304b8e12418dc87f5ea08d6b57260403392a2335af161045a6139f9565b5015610466575f602455005b6312171d8360e31b5f5260045ffd5b5490630483a59360e51b5f5260045260245260445ffd5b50805482116103f6565b63558a1e0360e11b5f5260045ffd5b5f80fd5b346104a5575f3660031901126104a557601c546040516001600160a01b039091168152602090f35b346104a5575f3660031901126104a5576020601b54604051908152f35b346104a5575f3660031901126104a5576020601454604051908152f35b346104a5575f3660031901126104a5576020601e54604051908152f35b346104a55760403660031901126104a5576004356001600160401b0381116104a557610558903690600401612c7c565b6024356001600160401b0381116104a55760609161057d610583923690600401612cf4565b906139cb565b9060405192835260208301526040820152f35b5f3660031901126104a55734156105b3576105b13433613e6c565b005b6356316e8760e01b5f5260045ffd5b346104a5575f3660031901126104a55760208054604051908152f35b346104a5575f3660031901126104a55760206040516113888152f35b346104a55760203660031901126104a5576001600160a01b0361061b612abb565b165f52601560205260405f20600f546103e881028181046103e814821517156106a857612710900460018301546003810290808204600314901517156106a857600360209401548082115f146106a05761067491613007565b808210156106985750905b8082101561069157505b604051908152f35b9050610689565b90509061067f565b50505f610674565b634e487b7160e01b5f52601160045260245ffd5b346104a5575f3660031901126104a55760206001600160401b0360065416604051908152f35b346104a5575f3660031901126104a5576020600354604051908152f35b346104a5575f3660031901126104a5576020604051610bb88152f35b346104a5575f3660031901126104a55760206040516121348152f35b346104a5575f3660031901126104a55760206040516127108152f35b346104a55760203660031901126104a5576001600160a01b03610774612abb565b165f90815260156020908152604091829020805460018201546002830154600390930154855192835293820152928301526060820152608090f35b346104a5575f3660031901126104a5576020604051620151808152f35b346104a55760203660031901126104a5576004356001600160401b0381116104a5576107ff61080b913690600401612b03565b91905f92810190612d47565b6001600160401b0385165f818152600860205260409020546001600160a01b03169690959093929091908715610b04578392610860602093889360405196879586956302f4d16760e01b875260048701612ec0565b03815f610fd25af1908115610af9575f91610abf575b5015610ab05761088590613aa4565b5f929150829081805b8251861015610aa1576108a18684612ff3565b5180519095906001600160a01b03168a9003610a9357602086019687516003815103610a82576108f17f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f91612fb2565b5103610a6b57505050505050604061090d9251910151906139cb565b94919290929360015b15610a58575f851315610a4557600a5480851115610a2f575061546086018087116106a8574211610a18576402540be4008502948086046402540be40014901517156106a8576040519160a08301908382106001600160401b03831117610a04576040976080946001600160401b036060937fb470e361f4be258af4a3b5952c49b1393a49c5f87f88c1da39aef7386834339a958c528a8352896020840152838c84015242858401521695869101528760095586600a5580600b5542600c55846001600160401b0319600d541617600d5588519088825287602083015289820152a482519182526020820152f35b634e487b7160e01b5f52604160045260245ffd5b8563746c24ab60e01b5f526004524260245260445ffd5b846364ec291360e11b5f5260045260245260445ffd5b846335779cb160e21b5f5260045260245ffd5b8263420811e160e01b5f5260045260245ffd5b90929496506001919395505b01949290939161088e565b509092949650600191939550610a77565b919395600191939550610a77565b96929150969350939193610916565b636f5f608760e01b5f5260045ffd5b90506020813d602011610af1575b81610ada60209383612c44565b810103126104a557610aeb90612eb3565b86610876565b3d9150610acd565b6040513d5f823e3d90fd5b8663f5ddb80160e01b5f5260045260245ffd5b346104a55760203660031901126104a557610b30612abb565b5f6060604051610b3f81612c0e565b828152826020820152826040820152015260018060a01b03165f526015602052608060405f20604051610b7181612c0e565b815491828252600181015460208301908152606060036002840154936040860194855201549301928352604051938452516020840152516040830152516060820152f35b346104a55760203660031901126104a5576020610689610bd3612abb565b82546001600160a01b039091165f81815260218552604090205490919080821115610c3457670de0b6b3a764000091610c1b610c2192855f526015885260405f205492613007565b9061307c565b04905b5f526022835260405f2054612d3a565b50505f90610c24565b346104a55760203660031901126104a5576001600160a01b03610c5e612abb565b165f526022602052602060405f2054604051908152f35b346104a55760403660031901126104a55760043560028110156104a5576106896020916024359061399d565b346104a55760403660031901126104a557610cba612bad565b610cc2612ad1565b6007549091906001600160a01b03163303610d78576001600160401b031690815f525f60205260018060a01b0360405f205416610d65576001600160a01b03168015610d565760207fe03727d120899f344de184df2af9378a5efa275abe949641225634ab0f25f79991835f525f825260405f20816bffffffffffffffffffffffff60a01b825416179055604051908152a2005b63032a203560e51b5f5260045ffd5b50639271091d60e01b5f5260045260245ffd5b63b90cdbb160e01b5f5260045ffd5b346104a5575f3660031901126104a557602060405160038152f35b346104a55760203660031901126104a557600754600435906001600160a01b03163303610d785760016024541461049657600160245580158015610e50575b610e375780610df5610e3192600354613007565b806003556040519082825260208201527f6209da68c49a1ab82f87924910d69ee9b9f9c42619a0f339b158f9fb26bb0fa560403392a23361410b565b5f602455005b6003549063cd081bd160e01b5f5260045260245260445ffd5b506003548111610de1565b346104a5575f3660031901126104a5576101206010546001600160401b03600f54601154601254600454600554916003549360065495604051988952602089015260408801526060870152608086015260a085015260c084015281811660e084015260401c16610100820152f35b612ae7565b346104a5575f3660031901126104a5576020601a54604051908152f35b346104a5575f3660031901126104a5576020601f54604051908152f35b346104a55760403660031901126104a55760243580151581036104a557601c546001600160a01b03163303610f525760016024541461049657610e3190600160245560043561379a565b63665b32d360e11b5f5260045ffd5b60203660031901126104a5576004356001602454146104965760016024555f81815260196020526040902080546001600160a01b0316156110a05760058101805460ff8160e01c16600581101561108c5760010361107957610fcf6001600160401b03809260a01c1661305c565b16804210156110675750600382015480341061105157508054600168ff000000000000000160a01b0319163317600160e11b17905534600491909101819055601b5461101b9190612d3a565b601b55604051903482527ff73ea5a6268a47d5e2083978af28c0bdf16703b75a1a1dbc31fd1f750d1d89a860203393a35f602455005b6311700e4f60e21b5f523460045260245260445ffd5b630e10189960e31b5f5260045260245ffd5b83637794cc0160e11b5f5260045260245ffd5b634e487b7160e01b5f52602160045260245ffd5b506379ee13b960e11b5f5260045260245ffd5b346104a5575f3660031901126104a5576020601354604051908152f35b346104a5575f3660031901126104a557602047604051908152f35b346104a55760203660031901126104a5576004355f526017602052602060018060a01b0360405f205416604051908152f35b5f3660031901126104a55734156105b357601054801561121d576105dc34023481046105dc036106a85761271090046111568134613007565b670de0b6b3a7640000810292818404670de0b6b3a764000014821517156106a8576111a56111ed917fc39bd4b19f4d9308b07f50c64b0e693c21f81328f10f571b7f9433525808ea169561308f565b6111b181602054612d3a565b6020556111c083601f54612d3a565b601f55836111f2575b60405193849334859094939260609260808301968352602083015260408201520152565b0390a1005b6111fe84601e54612d3a565b601e55601d546112189085906001600160a01b031661410b565b6111c9565b63339f07cb60e11b5f5260045ffd5b346104a5575f3660031901126104a55760206040516402540be4008152f35b346104a5575f3660031901126104a55760a0600954600a54600b54600c54906001600160401b03600d5416926040519485526020850152604084015260608301526080820152f35b346104a5575f3660031901126104a5576020601254604051908152f35b346104a55760203660031901126104a5576001600160401b036112d1612bad565b165f526008602052602060018060a01b0360405f205416604051908152f35b346104a5575f3660031901126104a557601d546040516001600160a01b039091168152602090f35b346104a5575f3660031901126104a5576113313361412d565b335f52602260205260405f205480156113c057602090335f52602282525f6040812055335f526015825260405f2061136a828254612d3a565b905561137881601054612d3a565b601055335f526015825260405f205460405190828252838201527f0473d24ccc58a5b24f10909b329e78b1746480ec15240485e6ab4aa7f6db534f60403392a2604051908152f35b633dfc0ad560e11b5f5260045ffd5b60c03660031901126104a5576084356001600160401b03811681036104a55760016024541461049657611418604091600160245560a43590606435604435602435600435613248565b5f60245582519182526020820152f35b346104a5575f3660031901126104a5576020604051610fd28152f35b346104a5575f3660031901126104a55760206040516103528152f35b346104a5575f3660031901126104a55760206040517f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f8152f35b612bd7565b346104a55760c03660031901126104a55760043560243560028110156104a557604435606435906001600160401b038216918281036104a5576084359060a435906001600160401b038216918281036104a5575f888152601760205260409020546001600160a01b0316611765578415611756576001871493848061174e575b61173f57806117395750611533858861399d565b915b821561172a57841561172257925b61171c57506006905b6040519261155984612bf2565b8884526020840161156a8982613050565b6040850193600185526001600160401b0360608701931683526001600160401b03608087019116815260a086016001600160401b034216815260c087019389855260e088019586528c5f52601660205260405f209751885560018801935196600288101561108c57845490519151935192516001600160d01b031990911660ff9098169790971790151560081b61ff00161760109290921b69ffffffffffffffff0000169190911760509190911b67ffffffffffffffff60501b161760909490941b67ffffffffffffffff60901b16939093179092559051600283015551600391909101555f85815260176020908152604080832080546001600160a01b03191633908117909155835260189091529020805468010000000000000000811015610a045761169d91600182018155613156565b81549060031b9087821b915f19901b1916179055601354600181018091116106a857601355611706575b6116d46040518094612b30565b602083015260408201527f1142a6affc917ff7f4eea502d1d1f8f982eb3107dc5cbaebd6b4531d745c216260603392a3005b601454600181018091116106a8576014556116c7565b9061154c565b505f92611543565b6309a7901360e41b5f5260045ffd5b91611535565b63cd345e3b60e01b5f5260045ffd5b50861561151f565b63394a288960e11b5f5260045ffd5b87633d39a51b60e11b5f5260045260245ffd5b346104a55760203660031901126104a557602061068960043561316b565b346104a55760403660031901126104a5576117af612bad565b6117b7612ad1565b6007549091906001600160a01b03163303610d78576001600160401b03165f818152600860205260409020549091906001600160a01b0316611851576001600160a01b03168015610d565760207fe56f7cd60e9fc73619fc4c0efdc539901a05499d514f0abb23f23c301eeec15491835f526008825260405f20816bffffffffffffffffffffffff60a01b825416179055604051908152a2005b506359fb5db160e01b5f5260045260245ffd5b346104a5575f3660031901126104a557602060405160968152f35b346104a5575f3660031901126104a5576020600e54604051908152f35b346104a55760203660031901126104a557600754600435906001600160a01b03163303610d78577f62cb5b8f95d2f71b121e4423241cf007a3e5a5a99b63891d7395f8066df5935f6040600e548151908152836020820152a1600e55005b346104a55760203660031901126104a5576001600160a01b0361191b612abb565b165f52601860205260405f20805461193281612c65565b916119406040519384612c44565b818352601f1961194f83612c65565b015f5b818110611a5d5750505f5b8281106119b557836040518091602082016020835281518091526020604084019201905f5b818110611990575050500390f35b919350916020610100826119a76001948851612b3d565b019401910191849392611982565b806119c260019284613156565b90549060031b1c5f52601660205260405f206003604051916119e383612bf2565b805483526001600160401b0385820154611a0360ff821660208701613050565b60ff8160081c1615156040860152818160101c166060860152818160501c16608086015260901c1660a0840152600281015460c0840152015460e0820152611a4b8287612ff3565b52611a568186612ff3565b500161195d565b602090611a68613014565b82828801015201611952565b346104a5575f3660031901126104a5576007546040516001600160a01b039091168152602090f35b346104a5575f3660031901126104a55760206040516154608152f35b346104a5575f3660031901126104a55760206001600160401b0360065460401c16604051908152f35b346104a55760203660031901126104a55760206106896004356130ea565b346104a5575f3660031901126104a55760206040516107d08152f35b346104a5575f3660031901126104a5576020611b356130c6565b6040519015158152f35b346104a55760203660031901126104a5576004355f526001602052602060ff60405f2054166040519015158152f35b346104a5575f3660031901126104a5576020600f54604051908152f35b346104a55760203660031901126104a5576004356001600160401b0381116104a557611bbe611c08913690600401612b03565b91906020611be35f925f95611bd16130ad565b50611bda6130ad565b50810190612d47565b906040969493959296519788928392630f989c4b60e31b845289898860048701612ec0565b0381610fd25afa948515610af9575f95611db9575b506001600160401b03165f818152602081905260409020546001600160a01b0316959093909190611c4d90613aa4565b9690505f925b8751841015611da257816001600160a01b03611c6f868b612ff3565b51511603611d975760036020611c85868b612ff3565b5101515103611d97577f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f3611cc66020611cbe878c612ff3565b510151612fb2565b5103611d8757506001600160a01b039150611cf090506020611ce88489612ff3565b510151612fe3565b5116948515611d53575b604091611d0691612ff3565b51015191602083519381808201958692010103126104a55760a0946001600160401b039351905b6040519515158652600180881b0316602086015260408501526060840152166080820152f35b9450604090611d06906001600160a01b03611d7b6020611d73848b612ff3565b510151612fd3565b51169691509150611cfa565b9091926001905b01929190611c53565b909192600190611d8e565b91905060a096506001600160401b03949250611d2d565b9094506020813d602011611df5575b81611dd560209383612c44565b810103126104a557611dee6001600160401b0391612eb3565b9490611c1d565b3d9150611dc8565b346104a5575f3660031901126104a55760206040516105dc8152f35b346104a55760203660031901126104a5576001600160401b03611e3a612bad565b165f525f602052602060018060a01b0360405f205416604051908152f35b346104a55760603660031901126104a5576024356044356001600160a01b038116908190036104a557816004355f52601660205260405f2090604051611e9d81612bf2565b825481526001600160401b036001840154611ebe60ff821660208501613050565b60ff8160081c1615156040840152818160101c166060840152818160501c16608084015260901c1660a082015260e060036002850154948560c0850152015491015281801515918261208d575b5050612085575b505f52601560205260405f209081548082105f1461207f5750805b600f54906103e882028281046103e814831517156106a8576127109004936001810154906003820291808304600314901517156106a857600301549084908281111561207257611f8692611f8091613007565b92613007565b9380851161206a575b50808411612062575b5080831161205a575b82611fab91613007565b6064810290808204606414901517156106a857612710900482118015929061203c575f5b828082111561203357611fe191613007565b925b6096820293828504609614831517156106a85761271060c09504916120118361200c8688612d3a565b613007565b93604051958652602086015260408501526060840152608083015260a0820152f35b50505f92611fe3565b6103e881028181046103e814821517156106a8576127109004611fcf565b915081611fa1565b925083611f98565b935084611f8f565b50611f8691505f92613007565b90611f2d565b915082611f12565b1190508185611f0b565b346104a55760203660031901126104a5576004355f526002602052602060ff60405f2054166040519015158152f35b346104a55760203660031901126104a5576004356001602454146104965760016024555f81815260196020526040902080546001600160a01b0316156110a05760058101805460ff8160e01c16600581101561108c57600103611079576121396001600160401b03809260a01c1661305c565b1680421061221f5750805460ff60e01b1916600360e01b17905560028101805460038301805492949092909161217a9161217291612d3a565b601b54613007565b601b5560115493600185018095116106a857602061220c6121de7f3b708080dffedc35c6c87a6c85e86c0a56baeb9aa144e51e08849f1c28fba8c39383986011556121c88154601254612d3a565b60125587549054906001600160a01b0316613f37565b865486549197916121f7916001600160a01b031661410b565b5494546001600160a01b039095169486612d3a565b604051908152a35f602455604051908152f35b639db52e4960e01b5f5260045260245ffd5b346104a55760203660031901126104a55760043561224d613014565b50805f52601660205260405f2060036040519161226983612bf2565b805483526001600160401b03600182015461228a60ff821660208701613050565b60ff8160081c1615156040860152818160101c166060860152818160501c16608086015260901c1660a0840152600281015460c0840152015460e08201528051156122e257610100906122e06040518092612b3d565bf35b5063082cdf1f60e11b5f5260045260245ffd5b346104a55760203660031901126104a55761230e612abb565b6007546001600160a01b03163303610d7857602354604080516001600160a01b038084168252841660208201529192917f9c79cea914985f5ee2fb9e17cb336793b95f453cf572e43622e9747e6dce5f579190a16001600160a01b03166001600160a01b03199190911617602355005b346104a5575f3660031901126104a5576020601154604051908152f35b346104a5575f3660031901126104a557602060405160018152f35b346104a5575f3660031901126104a55760206040517f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f38152f35b346104a5575f3660031901126104a557601354601454600454600554604080519485526020850193909352918301526060820152608090f35b346104a5575f3660031901126104a5576020600554604051908152f35b346104a55760203660031901126104a55761245f612abb565b6007546001600160a01b03163303610d78576001600160a01b038116908115610d5657601c54604080516001600160a01b03808416825293909316602084015290917fa99fc739cab6b19d8ee27aaf57eabd8d86b73474801240c86a747a5f5ee888419190a16001600160a01b03191617601c55005b346104a55760603660031901126104a5576004356001600160401b0381116104a557612505903690600401612b03565b602435604435925f92825f52600260205260ff60405f2054166128c8579061252f91810190612d47565b9691949092936001600160401b03811695865f525f60205260018060a01b0360405f2054169889156128b5578151602083012095865f52600160205260ff60405f2054166128a2576040516302f4d16760e01b8152916020918391829161259d9190878d8a60048701612ec0565b03815f610fd25af1908115610af9575f91612868575b5015610ab0576125c290613aa4565b9390505f5f945f915f9a5b82518c101561285c576125e08c84612ff3565b5180519098906001600160a01b03168e900361284d57602089019c8d51600381510361283b576126307f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f391612fb2565b51036128225750505050505060018060a01b0361264d8951612fd3565b5198519816976001600160a01b039061266590612fe3565b511693841561281a575b60400151602081519181808201938492010103126104a557519060015b15612807578181036127f257506126a2906130ea565b956003548088116127dc5750825f52600260205260405f20600160ff19825416179055845f52600160205260405f20600160ff198254161790556126e887600354613007565b6003556004549860018a01809a116106a8577f5655105af0dd9d0e81ccf3b81987e9eed31e59bacb5da431fe95f386832bc08a60a089976001600160401b036127d09a60409e60045561273d8b600554612d3a565b6005551695866fffffffffffffffff00000000000000006006549260401b16916fffffffffffffffffffffffffffffffff19161717600655600180831b0388169b8c948e519289845260208401528e830152600180841b03166060820152886080820152a47fb6b5d830d9ee7e772866b65acf8e51ea4a2ff1c6e602d092d0bf366bf3e9b27160208851858152a2613e6c565b82519182526020820152f35b8763cd081bd160e01b5f5260045260245260445ffd5b63ce6b173b60e01b5f5260045260245260445ffd5b8963785a3a3b60e11b5f5260045260245ffd5b88945061266f565b9092949c50600191939598505b019a92909693916125cd565b509092949c506001919395985061282f565b91939b6001919395985061282f565b9693929150995061268c565b90506020813d60201161289a575b8161288360209383612c44565b810103126104a55761289490612eb3565b8a6125b3565b3d9150612876565b8663b0eea50760e01b5f5260045260245ffd5b876337eab18360e11b5f5260045260245ffd5b8263b0eea50760e01b5f5260045260245ffd5b346104a5575f3660031901126104a5576020600454604051908152f35b346104a5575f3660031901126104a5576023546040516001600160a01b039091168152602090f35b346104a5575f3660031901126104a5576020601054604051908152f35b346104a55760203660031901126104a5576004355f52601960205260405f2060018060a01b038154166001600160401b036001830154926002810154906003810154600560048301549201549260ff8460e01c1696604051968752602087015260408601526060850152608084015260018060a01b03811660a084015260a01c1660c0820152600582101561108c576101009160e0820152f35b346104a55760203660031901126104a5576129f0612abb565b6007546001600160a01b03163303610d78576001600160a01b038116908115610d5657601d54604080516001600160a01b03808416825293909316602084015290917fb67d04c741783aa852e1ae096d3061cb1f69ceb29dbd69360ace381e1970a7ef9190a16001600160a01b03191617601d55005b5f3660031901126104a55734156105b357612a8334600354612d3a565b806003556040519034825260208201527f15873de5b5375786541a057377d4d2719c0a5f3769d1af962d2263e406cda57460403392a2005b600435906001600160a01b03821682036104a557565b602435906001600160a01b03821682036104a557565b346104a5575f3660031901126104a55760206040516103e88152f35b9181601f840112156104a5578235916001600160401b0383116104a557602083818601950101116104a557565b90600282101561108c5752565b60e0809180518452612b5760208201516020860190612b30565b6040810151151560408501526001600160401b0360608201511660608501526001600160401b0360808201511660808501526001600160401b0360a08201511660a085015260c081015160c08501520151910152565b600435906001600160401b03821682036104a557565b35906001600160401b03821682036104a557565b346104a5575f3660031901126104a557602060405160648152f35b61010081019081106001600160401b03821117610a0457604052565b608081019081106001600160401b03821117610a0457604052565b604081019081106001600160401b03821117610a0457604052565b90601f801991011681019081106001600160401b03821117610a0457604052565b6001600160401b038111610a045760051b60200190565b9080601f830112156104a5578135612c9381612c65565b92612ca16040519485612c44565b81845260208085019260051b8201019283116104a557602001905b828210612cc95750505090565b8135815260209182019101612cbc565b6001600160401b038111610a0457601f01601f191660200190565b81601f820112156104a557803590612d0b82612cd9565b92612d196040519485612c44565b828452602083830101116104a557815f926020809301838601378301015290565b919082018092116106a857565b919060a0838203126104a557612d5c83612bc3565b92612d6960208201612bc3565b9260408201356001600160401b0381116104a55783612d89918401612cf4565b9260608301356001600160401b0381116104a55783016040818303126104a55760405190612db682612c29565b803582526020810135906001600160401b0382116104a5570182601f820112156104a5578035612de581612c65565b91612df36040519384612c44565b81835260208084019260061b820101908582116104a557602001915b818310612e74575050506020820152926080810135906001600160401b0382116104a557016040818303126104a55760405191612e4b83612c29565b8135835260208201356001600160401b0381116104a557612e6c9201612c7c565b602082015290565b6040838703126104a55760405190612e8b82612c29565b8335825260208401359081151582036104a55782602092836040950152815201920191612e0f565b519081151582036104a557565b92906020926001600160401b038092979697168552168284015260a0604084015280519182918260a08601520160c084015e5f60c08284010152601f801991011681019260c0828503016060830152602061012081610100870193805160c0890152015195604060e08201528651809452019401905f5b818110612f8e57505050608081840391015260206060816040850193805186520151936040838201528451809452019201905f5b818110612f785750505090565b8251845260209384019390920191600101612f6b565b82518051875260209081015115158188015260409096019590920191600101612f37565b805115612fbf5760200190565b634e487b7160e01b5f52603260045260245ffd5b805160011015612fbf5760400190565b805160021015612fbf5760600190565b8051821015612fbf5760209160051b010190565b919082039182116106a857565b6040519061302182612bf2565b5f60e0838281528260208201528260408201528260608201528260808201528260a08201528260c08201520152565b600282101561108c5752565b6001600160401b0362015180911601906001600160401b0382116106a857565b818102929181159184041417156106a857565b8115613099570490565b634e487b7160e01b5f52601260045260245ffd5b604051906130ba82612c29565b60606020835f81520152565b600b5480151590816130d6575090565b905061546081018091116106a85742111590565b600b548015613147576130fb6130c6565b156131315750600e5480156131225761311a61311f926009549061307c565b61308f565b90565b63078c583760e51b5f5260045ffd5b63746c24ab60e01b5f526004524260245260445ffd5b639578db0b60e01b5f5260045ffd5b8054821015612fbf575f5260205f2001905f90565b805f52601660205260405f209060e060036040519361318985612bf2565b805485526001600160401b0360018201546131aa60ff821660208901613050565b60ff8160081c1615156040880152818160101c166060880152818160501c16608088015260901c1660a0860152600281015460c0860152015492019180835215613242575f52601760205260018060a01b0360405f2054165f526015602052600160405f20015461271081029080820461271014901517156106a85761323191519061308f565b61271081111561311f575061271090565b50505f90565b9192909593825f52601660205260405f20805415613787575f848152601760205260409020546001600160a01b0316330361377457600181019687549160ff8360081c1615613761578915908115613753575b50613744576064861061372c5761035284106137135760ff8216600281101561108c576001036136ec57506001600160401b03809160101c1691168181036136d75750505b6132e93361412d565b335f52601560205260405f20958654918282105f146136d05781945b85976133118785613007565b99600f54956103e887028781046103e814881517156106a8576127109004966001830154976003890298808a04600314901517156106a857808e9160038601549a8b8082115f146136c75761336591613007565b925b9f116136bf575b50808e116136b7575b50808d116136af575b5061338b8c8a612d3a565b156136a0576133a98c89986133a28c600395613007565b8555612d3a565b9101556133b887601054613007565b6010556133c78a600f54613007565b600f55805461ff00191690556133dd8987612d3a565b6040519384528660208501528960408501526060840152608083015260a08201527f32c067efd8d3985facc3f3795ff191139ab27e7c1c64b23a12312f1ea0123d6360c03392a3600f546064810290808204606414901517156106a8576127109004851115613659576103e885028581046103e814861517156106a85761271090049434861161365357855b6134738134613007565b9361347e8289613007565b9182613612575b505050601a545f1981146106a85760018101601a558095604051906134a982612bf2565b33825260208083018681526040808501878152606086018d81525f6080880181815260a0808a01838152426001600160401b031660c08c01908152600160e08d018181528e87526019909b52979094209a518b546001600160a01b0319166001600160a01b03918216178c559751968b0196909655935160028a0155915160038901559051600488015591516005968701805493516001600160e01b0319909416919094161791901b67ffffffffffffffff60a01b1617815590519283101561108c57805460ff60e01b191660e09390931b60ff60e01b16929092179091556135aa906135a16135998a86612d3a565b601b54612d3a565b601b5533613fea565b966201518042018042116106a8576001600160401b0391604051948a8652602086015260408501521660608301527f56d3980e774139cbfcd8dce989759b318800fdc79f67f3a0be40e399f784834660803393a4806136065750565b613610903361410b565b565b909180939750821061363257509061362991613007565b935f8080613485565b879161363d91612d3a565b90634426b53560e11b5f5260045260245260445ffd5b34613469565b5091509160115491600183018093116106a857613691926011556136886136808383612d3a565b601254612d3a565b60125533614049565b61369b343361410b565b905f90565b631e1f16ef60e31b5f5260045ffd5b9b505f613380565b9c505f613377565b9d508061336e565b50505f92613367565b8294613305565b634402954960e11b5f5260045260245260445ffd5b9150508281036136fc57506132e0565b905063736af44560e11b5f5260045260245260445ffd5b83637fdb281960e01b5f5260045261035260245260445ffd5b85635fd3165360e11b5f52600452606460245260445ffd5b63843ce46b60e01b5f5260045ffd5b60029150015489115f61329b565b856371066ef160e01b5f5260045260245ffd5b83631461f53360e11b5f5260045260245ffd5b8363082cdf1f60e11b5f5260045260245ffd5b5f81815260196020526040902080546001600160a01b03169290831561398a576005810180549060ff8260e01c16600581101561108c576002036139775760028301549360038401549360048101549360018060a01b03169161380961217286613804898b612d3a565b612d3a565b601b55613895575050805460ff60e01b1916600360e01b17905560115460018101919082106106a8576138046020936138797f3b708080dffedc35c6c87a6c85e86c0a56baeb9aa144e51e08849f1c28fba8c39661388c9560115561387081601254612d3a565b60125589613f37565b6138046138868584612d3a565b8a61410b565b604051908152a3565b600191969795928260e21b60ff60e01b198254161790556138b883600f54612d3a565b600f55855f526015602052600360405f20016138d5848254613007565b905501545f526016602052600160405f200161010061ff001982541617905561138883029383850461138814841517156106a857613610967f38604170f33463cc95592b641733f7263cf8808e24f4bf0f775fa05f0c3517196040613960899561200c6127106139719b04998a926139586139508584613007565b600f54612d3a565b600f55612d3a565b8151908152876020820152a4612d3a565b9061410b565b84637794cc0160e11b5f5260045260245ffd5b826379ee13b960e11b5f5260045260245ffd5b600281101561108c57612710916139be916001036139c2576107d09061307c565b0490565b610bb89061307c565b916139df6139d884612fd3565b5193612fe3565b5191602081519181808201938492010103126104a5575190565b3d15613a23573d90613a0a82612cd9565b91613a186040519384612c44565b82523d5f602084013e565b606090565b519060ff821682036104a557565b81601f820112156104a557805190613a4d82612cd9565b92613a5b6040519485612c44565b828452602083830101116104a557815f9260208093018386015e8301015290565b51906001600160401b03821682036104a557565b51906001600160a01b03821682036104a557565b906040519160e083018381106001600160401b03821117610a04576040525f835260208301925f845260408101935f8552606082015f815260808301915f835260a08401915f835260c0850193606085528598875188019760408160208b019a03126104a557613b1660208201613a28565b506040810151906001600160401b0382116104a557019780603f8a0112156104a5576020890151613b4681612c65565b99613b546040519b8c612c44565b818b52602080808d019360051b83010101918383116104a55760408201905b838210613e3d5750505050506003885110613e2e57613b9188612fb2565b5195865187019360e0888603126104a557613bae60208901613a7c565b96613bbb60408a01613a7c565b94613bc860608b01613a90565b938a613bd660808201612eb3565b93613be360a08301613a90565b9260e060c08401519301516001600160401b0381116104a5576001600160401b039e8f9c613c18926020809201920101613a36565b9052526001600160a01b0390811690915290151590915216905216905216905280515f1981019081116106a857613c4e91612ff3565b5190815182019160208301906080818503126104a557613c7060208201613a28565b93613c7d60408301613a7c565b5060608201516001600160401b0381116104a557820183603f820112156104a557602081015191613cad83612c65565b92613cbb6040519485612c44565b8084526020808086019260051b85010101928684116104a55760408101915b848310613d2557505050505060808201516001600160401b0381116104a5576001936020613d0c9260ff950101613a36565b50931603613d1657565b63678747ed60e01b5f5260045ffd5b82516001600160401b0381116104a55782016020810191906060908603601f1901126104a55760405190606082018281106001600160401b03821117610a045760405260208301516001600160a01b03811681036104a557825260408301516001600160401b0381116104a5576020908401018a601f820112156104a557805190613daf82612c65565b91613dbd6040519384612c44565b80835260208084019160051b830101918d83116104a557602001905b828210613e1e5750505060208301526060830151916001600160401b0383116104a557613e0e8b602080969581960101613a36565b6040820152815201920191613cda565b8151815260209182019101613dd9565b63d797fa2760e01b5f5260045ffd5b81516001600160401b0381116104a557602091613e61878480809589010101613a36565b815201910190613b73565b90613e768261412d565b612134810281810461213414821517156106a8577ff8ce2022830beb6ec696a46e42bce832af3c51a200a9b65f3e0c4113ecde21e59161271060a0920493613ebe8583613007565b90600180851b031694855f52601560205260405f2091613edf828454612d3a565b835560018301613ef0858254612d3a565b9055426002840155613f0482601054612d3a565b601055613f1381600f54612d3a565b9283600f5554916040519485526020850152604084015260608301526080820152a2565b91908015613fe45760968102908082046096036106a8577f52686384873db8c4c6deb005b544b84585901ff0f3a0e9140eb4d995a2d8db4793612710613610930491613f838382613007565b95838794613fb9575b604080515f81526020810194909452830152606082018490526001600160a01b03831691608090a261410b565b613fc581601e54612d3a565b601e55601d54613fdf9082906001600160a01b031661410b565b613f8c565b505f9150565b91908015613fe4576136109080936040517f52686384873db8c4c6deb005b544b84585901ff0f3a0e9140eb4d995a2d8db4760808201918481525f60208201525f60408201528460608201528060018060a01b038516930390a261410b565b92916140558183612d3a565b938415614103576096820292828404609614831517156106a8577f52686384873db8c4c6deb005b544b84585901ff0f3a0e9140eb4d995a2d8db476140a261271061361096048098613007565b968794816140d8575b604080519485526020850191909152830152606082018490526001600160a01b03831691608090a261410b565b6140e482601e54612d3a565b601e55601d546140fe9083906001600160a01b031661410b565b6140ab565b505f93505050565b8115614129575f80809381935af16141216139f9565b501561046657565b5050565b6020549060018060a01b0316805f52602160205260405f205480831161415d575b505f52602160205260405f2055565b614181670de0b6b3a764000091835f526015602052610c1b60405f20549186613007565b04801561414e57815f52602260205261419f60405f20918254612d3a565b90555f61414e56fea2646970667358221220d09c90e8e4e345e3a445d0ab6428e341ade58e0f075ae17377df55cbfb840e5664736f6c634300081c0033" as const;
