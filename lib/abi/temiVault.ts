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
        "name": "gross",
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

export const temiVaultBytecode = "0x608034609f57601f6140b738819003918201601f19168301916001600160401b0383118484101760a357808492602094604052833981010312609f57516001600160a01b038116808203609f576001601a55609b5750335b600780546001600160a01b03929092166001600160a01b03199283168117909155601c8054831682179055601d8054909216179055604051613fff90816100b88239f35b6057565b5f80fd5b634e487b7160e01b5f52604160045260245ffdfe60806040526004361015610011575f80fd5b5f3560e01c8063056044db146129a15780630c5a61f8146129125780630de5bcb8146128785780630e0202521461285b5780630f80924714610edb57806313f14fee146128335780631904b973146128165780631a4d3888146124105780631c9c088a146123815780631f4d6a031461236457806324acd5bb1461232b5780632829281c146122f157806328d1db73146122d657806329eb2cf4146122b95780632c4f2416146122305780632cc3ce801461216c5780632e9c88e3146120015780632f76464414611fd2578063306c820c14611e6a578063318f1a6414611e2b578063348ecf0014611e0f578063374beed814611b9d578063380b9bc914611b8057806338666089146114ac5780634595bed614611b515780634779db5614611b2d5780634bf35e0f14611b115780634fc663b214611af357806359a8359814611aca5780635dc565c214611aae57806361d027b314611a865780636213e9811461190c5780636b7a7fd8146118ae5780636dd89124146118915780636f0a7ef0146118765780636fb3cfb4146117a8578063717996f21461178a5780637290ba40146114b157806372dd74c0146114ac57806375afc18f14611472578063788338361461145657806379cd17641461143a5780637b775ebc146113e15780637e393cbe1461132a578063803db96d1461130257806381e368b7146112c25780638480d57a146112a5578063876574eb1461125d57806388dcb1691461123e5780638a570a121461112f5780638b0ad976146110fd5780638f840ddd146110e257806391656fba146110c557806392c824d814610f7357806394a754e014610f1a57806397206bd514610efd578063a0021cf114610ee0578063a2db6e1814610edb578063a435e93714610e6d578063ad49b53b14610db4578063b44edecb14610d99578063b816fc1114610cb3578063c6f54d0114610c87578063c744ad1914610c4f578063c7bf198014610bc7578063c9a396e914610b29578063cdcddaf5146107cc578063d62aad29146107af578063d66bd52414610753578063e1a4521814610737578063e1a72b4a1461071b578063e42f5365146106ff578063e5d39259146106e2578063e6928292146106bc578063ee3da055146105fa578063f106f896146105de578063f19c32d9146105c2578063f251c38114610596578063f490bea514610528578063f526e39a1461050b578063f776a0ad146104ee578063f9168231146104d1578063fe25e00a146104a95763ffd0984d146103b5575f80fd5b346104a55760203660031901126104a5576004356001602454146104965760016024556103e133613f4f565b335f52601560205260405f208115801561048c575b610475575f80838361040b8396849654612f42565b815561041982601054612f42565b601055546040519082825260208201527f2cd8de105dd0197df9875e5090b06ecfe6c56304b8e12418dc87f5ea08d6b57260403392a2335af161045a613942565b5015610466575f602455005b6312171d8360e31b5f5260045ffd5b5490630483a59360e51b5f5260045260245260445ffd5b50805482116103f6565b63558a1e0360e11b5f5260045ffd5b5f80fd5b346104a5575f3660031901126104a557601c546040516001600160a01b039091168152602090f35b346104a5575f3660031901126104a5576020601b54604051908152f35b346104a5575f3660031901126104a5576020601454604051908152f35b346104a5575f3660031901126104a5576020601e54604051908152f35b346104a55760403660031901126104a5576004356001600160401b0381116104a557610558903690600401612bb7565b6024356001600160401b0381116104a55760609161057d610583923690600401612c2f565b90613914565b9060405192835260208301526040820152f35b5f3660031901126104a55734156105b3576105b13433613db5565b005b6356316e8760e01b5f5260045ffd5b346104a5575f3660031901126104a55760208054604051908152f35b346104a5575f3660031901126104a55760206040516113888152f35b346104a55760203660031901126104a5576001600160a01b0361061b6129f6565b165f52601560205260405f20600f546103e881028181046103e814821517156106a857612710900460018301546003810290808204600314901517156106a857600360209401548082115f146106a05761067491612f42565b808210156106985750905b8082101561069157505b604051908152f35b9050610689565b90509061067f565b50505f610674565b634e487b7160e01b5f52601160045260245ffd5b346104a5575f3660031901126104a55760206001600160401b0360065416604051908152f35b346104a5575f3660031901126104a5576020600354604051908152f35b346104a5575f3660031901126104a5576020604051610bb88152f35b346104a5575f3660031901126104a55760206040516121348152f35b346104a5575f3660031901126104a55760206040516127108152f35b346104a55760203660031901126104a5576001600160a01b036107746129f6565b165f90815260156020908152604091829020805460018201546002830154600390930154855192835293820152928301526060820152608090f35b346104a5575f3660031901126104a5576020604051620151808152f35b346104a55760203660031901126104a5576004356001600160401b0381116104a5576107ff61080b913690600401612a3e565b91905f92810190612c82565b6001600160401b0385165f818152600860205260409020546001600160a01b03169690959093929091908715610b16578392610860602093889360405196879586956302f4d16760e01b875260048701612dfb565b03815f610fd25af1908115610b0b575f91610ad1575b5015610ac257610885906139ed565b5f929150829081805b8251861015610ab3576108a18684612f2e565b5180519095906001600160a01b03168a9003610aa557602086019687516003815103610a94576108f17f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f91612eed565b5103610a7d57505050505050604061090d925191015190613914565b94919290929360015b15610a6a575f851315610a5757600a5480851115610a41575061546086018087116106a8574211610a2a576402540be4008502948086046402540be40014901517156106a8576040519160a08301908382106001600160401b03831117610a16576040976080946001600160401b03610a07937fb470e361f4be258af4a3b5952c49b1393a49c5f87f88c1da39aef7386834339a958c528a8352896020840152838c8401524260608401521695869101528760095586600a5580600b5542600c55846001600160401b0319600d541617600d558851918291888a846040919493926060820195825260208201520152565b0390a482519182526020820152f35b634e487b7160e01b5f52604160045260245ffd5b8563746c24ab60e01b5f526004524260245260445ffd5b846364ec291360e11b5f5260045260245260445ffd5b846335779cb160e21b5f5260045260245ffd5b8263420811e160e01b5f5260045260245ffd5b90929496506001919395505b01949290939161088e565b509092949650600191939550610a89565b919395600191939550610a89565b96929150969350939193610916565b636f5f608760e01b5f5260045ffd5b90506020813d602011610b03575b81610aec60209383612b7f565b810103126104a557610afd90612dee565b86610876565b3d9150610adf565b6040513d5f823e3d90fd5b8663f5ddb80160e01b5f5260045260245ffd5b346104a55760203660031901126104a557610b426129f6565b5f6060604051610b5181612b49565b828152826020820152826040820152015260018060a01b03165f526015602052608060405f20604051610b8381612b49565b815491828252600181015460208301908152606060036002840154936040860194855201549301928352604051938452516020840152516040830152516060820152f35b346104a55760203660031901126104a5576020610689610be56129f6565b82546001600160a01b039091165f81815260218552604090205490919080821115610c4657670de0b6b3a764000091610c2d610c3392855f526015885260405f205492612f42565b90612fb7565b04905b5f526022835260405f2054612c75565b50505f90610c36565b346104a55760203660031901126104a5576001600160a01b03610c706129f6565b165f526022602052602060405f2054604051908152f35b346104a55760403660031901126104a55760043560028110156104a557610689602091602435906138e6565b346104a55760403660031901126104a557610ccc612ae8565b610cd4612a0c565b6007549091906001600160a01b03163303610d8a576001600160401b031690815f525f60205260018060a01b0360405f205416610d77576001600160a01b03168015610d685760207fe03727d120899f344de184df2af9378a5efa275abe949641225634ab0f25f79991835f525f825260405f20816bffffffffffffffffffffffff60a01b825416179055604051908152a2005b63032a203560e51b5f5260045ffd5b50639271091d60e01b5f5260045260245ffd5b63b90cdbb160e01b5f5260045ffd5b346104a5575f3660031901126104a557602060405160038152f35b346104a55760203660031901126104a557600754600435906001600160a01b03163303610d8a5760016024541461049657600160245580158015610e62575b610e495780610e07610e4392600354612f42565b806003556040519082825260208201527f6209da68c49a1ab82f87924910d69ee9b9f9c42619a0f339b158f9fb26bb0fa560403392a233613f2d565b5f602455005b6003549063cd081bd160e01b5f5260045260245260445ffd5b506003548111610df3565b346104a5575f3660031901126104a5576101206010546001600160401b03600f54601154601254600454600554916003549360065495604051988952602089015260408801526060870152608086015260a085015260c084015281811660e084015260401c16610100820152f35b612a22565b346104a5575f3660031901126104a5576020601a54604051908152f35b346104a5575f3660031901126104a5576020601f54604051908152f35b346104a55760403660031901126104a55760243580151581036104a557601c546001600160a01b03163303610f645760016024541461049657610e439060016024556004356136de565b63665b32d360e11b5f5260045ffd5b60203660031901126104a5576004356001602454146104965760016024555f81815260196020526040902080546001600160a01b0316156110b25760058101805460ff8160e01c16600581101561109e5760010361108b57610fe16001600160401b03809260a01c16612f97565b16804210156110795750600382015480341061106357508054600168ff000000000000000160a01b0319163317600160e11b17905534600491909101819055601b5461102d9190612c75565b601b55604051903482527ff73ea5a6268a47d5e2083978af28c0bdf16703b75a1a1dbc31fd1f750d1d89a860203393a35f602455005b6311700e4f60e21b5f523460045260245260445ffd5b630e10189960e31b5f5260045260245ffd5b83637794cc0160e11b5f5260045260245ffd5b634e487b7160e01b5f52602160045260245ffd5b506379ee13b960e11b5f5260045260245ffd5b346104a5575f3660031901126104a5576020601354604051908152f35b346104a5575f3660031901126104a557602047604051908152f35b346104a55760203660031901126104a5576004355f526017602052602060018060a01b0360405f205416604051908152f35b5f3660031901126104a55734156105b357601054801561122f576105dc34023481046105dc036106a85761271090046111688134612f42565b670de0b6b3a7640000810292818404670de0b6b3a764000014821517156106a8576111b76111ff917fc39bd4b19f4d9308b07f50c64b0e693c21f81328f10f571b7f9433525808ea1695612fca565b6111c381602054612c75565b6020556111d283601f54612c75565b601f5583611204575b60405193849334859094939260609260808301968352602083015260408201520152565b0390a1005b61121084601e54612c75565b601e55601d5461122a9085906001600160a01b0316613f2d565b6111db565b63339f07cb60e11b5f5260045ffd5b346104a5575f3660031901126104a55760206040516402540be4008152f35b346104a5575f3660031901126104a55760a0600954600a54600b54600c54906001600160401b03600d5416926040519485526020850152604084015260608301526080820152f35b346104a5575f3660031901126104a5576020601254604051908152f35b346104a55760203660031901126104a5576001600160401b036112e3612ae8565b165f526008602052602060018060a01b0360405f205416604051908152f35b346104a5575f3660031901126104a557601d546040516001600160a01b039091168152602090f35b346104a5575f3660031901126104a55761134333613f4f565b335f52602260205260405f205480156113d257602090335f52602282525f6040812055335f526015825260405f2061137c828254612c75565b905561138a81601054612c75565b601055335f526015825260405f205460405190828252838201527f0473d24ccc58a5b24f10909b329e78b1746480ec15240485e6ab4aa7f6db534f60403392a2604051908152f35b633dfc0ad560e11b5f5260045ffd5b60c03660031901126104a5576084356001600160401b03811681036104a5576001602454146104965761142a604091600160245560a43590606435604435602435600435613183565b5f60245582519182526020820152f35b346104a5575f3660031901126104a5576020604051610fd28152f35b346104a5575f3660031901126104a55760206040516103528152f35b346104a5575f3660031901126104a55760206040517f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f8152f35b612b12565b346104a55760c03660031901126104a55760043560243560028110156104a557604435606435906001600160401b038216918281036104a5576084359060a435906001600160401b038216918281036104a5575f888152601760205260409020546001600160a01b03166117775784156117685760018714938480611760575b611751578061174b575061154585886138e6565b915b821561173c57841561173457925b61172e57506006905b6040519261156b84612b2d565b8884526020840161157c8982612f8b565b6040850193600185526001600160401b0360608701931683526001600160401b03608087019116815260a086016001600160401b034216815260c087019389855260e088019586528c5f52601660205260405f209751885560018801935196600288101561109e57845490519151935192516001600160d01b031990911660ff9098169790971790151560081b61ff00161760109290921b69ffffffffffffffff0000169190911760509190911b67ffffffffffffffff60501b161760909490941b67ffffffffffffffff60901b16939093179092559051600283015551600391909101555f85815260176020908152604080832080546001600160a01b03191633908117909155835260189091529020805468010000000000000000811015610a16576116af91600182018155613091565b81549060031b9087821b915f19901b1916179055601354600181018091116106a857601355611718575b6116e66040518094612a6b565b602083015260408201527f1142a6affc917ff7f4eea502d1d1f8f982eb3107dc5cbaebd6b4531d745c216260603392a3005b601454600181018091116106a8576014556116d9565b9061155e565b505f92611555565b6309a7901360e41b5f5260045ffd5b91611547565b63cd345e3b60e01b5f5260045ffd5b508615611531565b63394a288960e11b5f5260045ffd5b87633d39a51b60e11b5f5260045260245ffd5b346104a55760203660031901126104a55760206106896004356130a6565b346104a55760403660031901126104a5576117c1612ae8565b6117c9612a0c565b6007549091906001600160a01b03163303610d8a576001600160401b03165f818152600860205260409020549091906001600160a01b0316611863576001600160a01b03168015610d685760207fe56f7cd60e9fc73619fc4c0efdc539901a05499d514f0abb23f23c301eeec15491835f526008825260405f20816bffffffffffffffffffffffff60a01b825416179055604051908152a2005b506359fb5db160e01b5f5260045260245ffd5b346104a5575f3660031901126104a557602060405160968152f35b346104a5575f3660031901126104a5576020600e54604051908152f35b346104a55760203660031901126104a557600754600435906001600160a01b03163303610d8a577f62cb5b8f95d2f71b121e4423241cf007a3e5a5a99b63891d7395f8066df5935f6040600e548151908152836020820152a1600e55005b346104a55760203660031901126104a5576001600160a01b0361192d6129f6565b165f52601860205260405f20805461194481612ba0565b916119526040519384612b7f565b818352601f1961196183612ba0565b015f5b818110611a6f5750505f5b8281106119c757836040518091602082016020835281518091526020604084019201905f5b8181106119a2575050500390f35b919350916020610100826119b96001948851612a78565b019401910191849392611994565b806119d460019284613091565b90549060031b1c5f52601660205260405f206003604051916119f583612b2d565b805483526001600160401b0385820154611a1560ff821660208701612f8b565b60ff8160081c1615156040860152818160101c166060860152818160501c16608086015260901c1660a0840152600281015460c0840152015460e0820152611a5d8287612f2e565b52611a688186612f2e565b500161196f565b602090611a7a612f4f565b82828801015201611964565b346104a5575f3660031901126104a5576007546040516001600160a01b039091168152602090f35b346104a5575f3660031901126104a55760206040516154608152f35b346104a5575f3660031901126104a55760206001600160401b0360065460401c16604051908152f35b346104a55760203660031901126104a5576020610689600435613025565b346104a5575f3660031901126104a55760206040516107d08152f35b346104a5575f3660031901126104a5576020611b47613001565b6040519015158152f35b346104a55760203660031901126104a5576004355f526001602052602060ff60405f2054166040519015158152f35b346104a5575f3660031901126104a5576020600f54604051908152f35b346104a55760203660031901126104a5576004356001600160401b0381116104a557611bd0611c1a913690600401612a3e565b91906020611bf55f925f95611be3612fe8565b50611bec612fe8565b50810190612c82565b906040969493959296519788928392630f989c4b60e31b845289898860048701612dfb565b0381610fd25afa948515610b0b575f95611dcb575b506001600160401b03165f818152602081905260409020546001600160a01b0316959093909190611c5f906139ed565b9690505f925b8751841015611db457816001600160a01b03611c81868b612f2e565b51511603611da95760036020611c97868b612f2e565b5101515103611da9577f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f3611cd86020611cd0878c612f2e565b510151612eed565b5103611d9957506001600160a01b039150611d0290506020611cfa8489612f2e565b510151612f1e565b5116948515611d65575b604091611d1891612f2e565b51015191602083519381808201958692010103126104a55760a0946001600160401b039351905b6040519515158652600180881b0316602086015260408501526060840152166080820152f35b9450604090611d18906001600160a01b03611d8d6020611d85848b612f2e565b510151612f0e565b51169691509150611d0c565b9091926001905b01929190611c65565b909192600190611da0565b91905060a096506001600160401b03949250611d3f565b9094506020813d602011611e07575b81611de760209383612b7f565b810103126104a557611e006001600160401b0391612dee565b9490611c2f565b3d9150611dda565b346104a5575f3660031901126104a55760206040516105dc8152f35b346104a55760203660031901126104a5576001600160401b03611e4c612ae8565b165f525f602052602060018060a01b0360405f205416604051908152f35b346104a55760603660031901126104a5576024356044356001600160a01b038116908190036104a5575f52601560205260405f209081548082105f14611fcc5750805b600f54906103e882028281046103e814831517156106a8576127109004936001810154906003820291808304600314901517156106a8576003015490849082811115611fbf57611f0692611f0091612f42565b92612f42565b93808511611fb7575b50808411611faf575b50808311611fa7575b82611f2b91612f42565b6064810290808204606414901517156106a8576127109004821180159290611f86576080925f5b8380821115611f7d57611f6491612f42565b915b604051938452602084015260408301526060820152f35b50505f91611f66565b6103e88102928184046103e814821517156106a85761271060809404611f52565b915081611f21565b925083611f18565b935084611f0f565b50611f0691505f92612f42565b90611ead565b346104a55760203660031901126104a5576004355f526002602052602060ff60405f2054166040519015158152f35b346104a55760203660031901126104a5576004356001602454146104965760016024555f81815260196020526040902080546001600160a01b0316156110b25760058101805460ff8160e01c16600581101561109e5760010361108b576120746001600160401b03809260a01c16612f97565b1680421061215a5750805460ff60e01b1916600360e01b1790556002810180546003830180549294909290916120b5916120ad91612c75565b601b54612f42565b601b5560115493600185018095116106a85760206121476121197f3b708080dffedc35c6c87a6c85e86c0a56baeb9aa144e51e08849f1c28fba8c39383986011556121038154601254612c75565b60125587549054906001600160a01b0316613e80565b86548654919791612132916001600160a01b0316613f2d565b5494546001600160a01b039095169486612c75565b604051908152a35f602455604051908152f35b639db52e4960e01b5f5260045260245ffd5b346104a55760203660031901126104a557600435612188612f4f565b50805f52601660205260405f206003604051916121a483612b2d565b805483526001600160401b0360018201546121c560ff821660208701612f8b565b60ff8160081c1615156040860152818160101c166060860152818160501c16608086015260901c1660a0840152600281015460c0840152015460e082015280511561221d576101009061221b6040518092612a78565bf35b5063082cdf1f60e11b5f5260045260245ffd5b346104a55760203660031901126104a5576122496129f6565b6007546001600160a01b03163303610d8a57602354604080516001600160a01b038084168252841660208201529192917f9c79cea914985f5ee2fb9e17cb336793b95f453cf572e43622e9747e6dce5f579190a16001600160a01b03166001600160a01b03199190911617602355005b346104a5575f3660031901126104a5576020601154604051908152f35b346104a5575f3660031901126104a557602060405160018152f35b346104a5575f3660031901126104a55760206040517f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f38152f35b346104a5575f3660031901126104a557601354601454600454600554604080519485526020850193909352918301526060820152608090f35b346104a5575f3660031901126104a5576020600554604051908152f35b346104a55760203660031901126104a55761239a6129f6565b6007546001600160a01b03163303610d8a576001600160a01b038116908115610d6857601c54604080516001600160a01b03808416825293909316602084015290917fa99fc739cab6b19d8ee27aaf57eabd8d86b73474801240c86a747a5f5ee888419190a16001600160a01b03191617601c55005b346104a55760603660031901126104a5576004356001600160401b0381116104a557612440903690600401612a3e565b602435604435925f92825f52600260205260ff60405f205416612803579061246a91810190612c82565b9691949092936001600160401b03811695865f525f60205260018060a01b0360405f2054169889156127f0578151602083012095865f52600160205260ff60405f2054166127dd576040516302f4d16760e01b815291602091839182916124d89190878d8a60048701612dfb565b03815f610fd25af1908115610b0b575f916127a3575b5015610ac2576124fd906139ed565b9390505f5f945f915f9a5b82518c10156127975761251b8c84612f2e565b5180519098906001600160a01b03168e900361278857602089019c8d5160038151036127765761256b7f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f391612eed565b510361275d5750505050505060018060a01b036125888951612f0e565b5198519816976001600160a01b03906125a090612f1e565b5116938415612755575b60400151602081519181808201938492010103126104a557519060015b156127425781810361272d57506125dd90613025565b956003548088116127175750825f52600260205260405f20600160ff19825416179055845f52600160205260405f20600160ff1982541617905561262387600354612f42565b6003556004549860018a01809a116106a8577f5655105af0dd9d0e81ccf3b81987e9eed31e59bacb5da431fe95f386832bc08a60a089976001600160401b0361270b9a60409e6004556126788b600554612c75565b6005551695866fffffffffffffffff00000000000000006006549260401b16916fffffffffffffffffffffffffffffffff19161717600655600180831b0388169b8c948e519289845260208401528e830152600180841b03166060820152886080820152a47fb6b5d830d9ee7e772866b65acf8e51ea4a2ff1c6e602d092d0bf366bf3e9b27160208851858152a2613db5565b82519182526020820152f35b8763cd081bd160e01b5f5260045260245260445ffd5b63ce6b173b60e01b5f5260045260245260445ffd5b8963785a3a3b60e11b5f5260045260245ffd5b8894506125aa565b9092949c50600191939598505b019a9290969391612508565b509092949c506001919395985061276a565b91939b6001919395985061276a565b969392915099506125c7565b90506020813d6020116127d5575b816127be60209383612b7f565b810103126104a5576127cf90612dee565b8a6124ee565b3d91506127b1565b8663b0eea50760e01b5f5260045260245ffd5b876337eab18360e11b5f5260045260245ffd5b8263b0eea50760e01b5f5260045260245ffd5b346104a5575f3660031901126104a5576020600454604051908152f35b346104a5575f3660031901126104a5576023546040516001600160a01b039091168152602090f35b346104a5575f3660031901126104a5576020601054604051908152f35b346104a55760203660031901126104a5576004355f52601960205260405f2060018060a01b038154166001600160401b036001830154926002810154906003810154600560048301549201549260ff8460e01c1696604051968752602087015260408601526060850152608084015260018060a01b03811660a084015260a01c1660c0820152600582101561109e576101009160e0820152f35b346104a55760203660031901126104a55761292b6129f6565b6007546001600160a01b03163303610d8a576001600160a01b038116908115610d6857601d54604080516001600160a01b03808416825293909316602084015290917fb67d04c741783aa852e1ae096d3061cb1f69ceb29dbd69360ace381e1970a7ef9190a16001600160a01b03191617601d55005b5f3660031901126104a55734156105b3576129be34600354612c75565b806003556040519034825260208201527f15873de5b5375786541a057377d4d2719c0a5f3769d1af962d2263e406cda57460403392a2005b600435906001600160a01b03821682036104a557565b602435906001600160a01b03821682036104a557565b346104a5575f3660031901126104a55760206040516103e88152f35b9181601f840112156104a5578235916001600160401b0383116104a557602083818601950101116104a557565b90600282101561109e5752565b60e0809180518452612a9260208201516020860190612a6b565b6040810151151560408501526001600160401b0360608201511660608501526001600160401b0360808201511660808501526001600160401b0360a08201511660a085015260c081015160c08501520151910152565b600435906001600160401b03821682036104a557565b35906001600160401b03821682036104a557565b346104a5575f3660031901126104a557602060405160648152f35b61010081019081106001600160401b03821117610a1657604052565b608081019081106001600160401b03821117610a1657604052565b604081019081106001600160401b03821117610a1657604052565b90601f801991011681019081106001600160401b03821117610a1657604052565b6001600160401b038111610a165760051b60200190565b9080601f830112156104a5578135612bce81612ba0565b92612bdc6040519485612b7f565b81845260208085019260051b8201019283116104a557602001905b828210612c045750505090565b8135815260209182019101612bf7565b6001600160401b038111610a1657601f01601f191660200190565b81601f820112156104a557803590612c4682612c14565b92612c546040519485612b7f565b828452602083830101116104a557815f926020809301838601378301015290565b919082018092116106a857565b919060a0838203126104a557612c9783612afe565b92612ca460208201612afe565b9260408201356001600160401b0381116104a55783612cc4918401612c2f565b9260608301356001600160401b0381116104a55783016040818303126104a55760405190612cf182612b64565b803582526020810135906001600160401b0382116104a5570182601f820112156104a5578035612d2081612ba0565b91612d2e6040519384612b7f565b81835260208084019260061b820101908582116104a557602001915b818310612daf575050506020820152926080810135906001600160401b0382116104a557016040818303126104a55760405191612d8683612b64565b8135835260208201356001600160401b0381116104a557612da79201612bb7565b602082015290565b6040838703126104a55760405190612dc682612b64565b8335825260208401359081151582036104a55782602092836040950152815201920191612d4a565b519081151582036104a557565b92906020926001600160401b038092979697168552168284015260a0604084015280519182918260a08601520160c084015e5f60c08284010152601f801991011681019260c0828503016060830152602061012081610100870193805160c0890152015195604060e08201528651809452019401905f5b818110612ec957505050608081840391015260206060816040850193805186520151936040838201528451809452019201905f5b818110612eb35750505090565b8251845260209384019390920191600101612ea6565b82518051875260209081015115158188015260409096019590920191600101612e72565b805115612efa5760200190565b634e487b7160e01b5f52603260045260245ffd5b805160011015612efa5760400190565b805160021015612efa5760600190565b8051821015612efa5760209160051b010190565b919082039182116106a857565b60405190612f5c82612b2d565b5f60e0838281528260208201528260408201528260608201528260808201528260a08201528260c08201520152565b600282101561109e5752565b6001600160401b0362015180911601906001600160401b0382116106a857565b818102929181159184041417156106a857565b8115612fd4570490565b634e487b7160e01b5f52601260045260245ffd5b60405190612ff582612b64565b60606020835f81520152565b600b548015159081613011575090565b905061546081018091116106a85742111590565b600b54801561308257613036613001565b1561306c5750600e54801561305d5761305561305a9260095490612fb7565b612fca565b90565b63078c583760e51b5f5260045ffd5b63746c24ab60e01b5f526004524260245260445ffd5b639578db0b60e01b5f5260045ffd5b8054821015612efa575f5260205f2001905f90565b805f52601660205260405f209060e06003604051936130c485612b2d565b805485526001600160401b0360018201546130e560ff821660208901612f8b565b60ff8160081c1615156040880152818160101c166060880152818160501c16608088015260901c1660a0860152600281015460c086015201549201918083521561317d575f52601760205260018060a01b0360405f2054165f526015602052600160405f20015461271081029080820461271014901517156106a85761316c915190612fca565b61271081111561305a575061271090565b50505f90565b9192909593825f52601660205260405f208054156136cb575f848152601760205260409020546001600160a01b031633036136b857600181019687549160ff8360081c16156136a5578915908115613697575b5061368857606486106136705761035284106136575760ff8216600281101561109e5760010361363057506001600160401b03809160101c16911681810361361b5750505b61322433613f4f565b335f52601560205260405f20958654918282105f146136145781945b859761324c8785612f42565b99600f54956103e887028781046103e814881517156106a8576127109004966001830154976003890298808a04600314901517156106a857808e9160038601549a8b8082115f1461360b576132a091612f42565b925b9f11613603575b50808e116135fb575b50808d116135f3575b506132c68c8a612c75565b156135e4576132e48c89986132dd8c600395612f42565b8555612c75565b9101556132f387601054612f42565b6010556133028a600f54612f42565b600f55805461ff00191690556133188987612c75565b6040519384528660208501528960408501526060840152608083015260a08201527f32c067efd8d3985facc3f3795ff191139ab27e7c1c64b23a12312f1ea0123d6360c03392a3600f546064810290808204606414901517156106a8576127109004851115613594576103e885028581046103e814861517156106a85761271090049434861161358e57855b6133ae8134612f42565b936133b98289612f42565b918261354d575b505050601a545f1981146106a85760018101601a558095604051906133e482612b2d565b33825260208083018681526040808501878152606086018d81525f6080880181815260a0808a01838152426001600160401b031660c08c01908152600160e08d018181528e87526019909b52979094209a518b546001600160a01b0319166001600160a01b03918216178c559751968b0196909655935160028a0155915160038901559051600488015591516005968701805493516001600160e01b0319909416919094161791901b67ffffffffffffffff60a01b1617815590519283101561109e57805460ff60e01b191660e09390931b60ff60e01b16929092179091556134e5906134dc6134d48a86612c75565b601b54612c75565b601b5533613e80565b966201518042018042116106a8576001600160401b0391604051948a8652602086015260408501521660608301527f56d3980e774139cbfcd8dce989759b318800fdc79f67f3a0be40e399f784834660803393a4806135415750565b61354b9033613f2d565b565b909180939750821061356d57509061356491612f42565b935f80806133c0565b879161357891612c75565b90634426b53560e11b5f5260045260245260445ffd5b346133a4565b5091509160115490600182018092116106a8576135d5926135cf926011556135c76135bf8383612c75565b601254612c75565b601255612c75565b33613e80565b6135df3433613f2d565b905f90565b631e1f16ef60e31b5f5260045ffd5b9b505f6132bb565b9c505f6132b2565b9d50806132a9565b50505f926132a2565b8294613240565b634402954960e11b5f5260045260245260445ffd5b915050828103613640575061321b565b905063736af44560e11b5f5260045260245260445ffd5b83637fdb281960e01b5f5260045261035260245260445ffd5b85635fd3165360e11b5f52600452606460245260445ffd5b63843ce46b60e01b5f5260045ffd5b60029150015489115f6131d6565b856371066ef160e01b5f5260045260245ffd5b83631461f53360e11b5f5260045260245ffd5b8363082cdf1f60e11b5f5260045260245ffd5b5f81815260196020526040902080546001600160a01b0316929083156138d3576005810180549060ff8260e01c16600581101561109e576002036138c05760028301549360038401549360048101549360018060a01b03169161374d6120ad86613748898b612c75565b612c75565b601b556137d9575050805460ff60e01b1916600360e01b17905560115460018101919082106106a8576137486020936137bd7f3b708080dffedc35c6c87a6c85e86c0a56baeb9aa144e51e08849f1c28fba8c3966137d0956011556137b481601254612c75565b60125589613e80565b6137486137ca8584612c75565b8a613f2d565b604051908152a3565b600191969795928260e21b60ff60e01b198254161790556137fc83600f54612c75565b600f55855f526015602052600360405f2001613819848254612f42565b905501545f526016602052600160405f200161010061ff001982541617905561138883029383850461138814841517156106a85761354b967f38604170f33463cc95592b641733f7263cf8808e24f4bf0f775fa05f0c35171960406138a989956138a46127106138ba9b04998a9261389c6138948584612f42565b600f54612c75565b600f55612c75565b612f42565b8151908152876020820152a4612c75565b90613f2d565b84637794cc0160e11b5f5260045260245ffd5b826379ee13b960e11b5f5260045260245ffd5b600281101561109e57612710916139079160010361390b576107d090612fb7565b0490565b610bb890612fb7565b9161392861392184612f0e565b5193612f1e565b5191602081519181808201938492010103126104a5575190565b3d1561396c573d9061395382612c14565b916139616040519384612b7f565b82523d5f602084013e565b606090565b519060ff821682036104a557565b81601f820112156104a55780519061399682612c14565b926139a46040519485612b7f565b828452602083830101116104a557815f9260208093018386015e8301015290565b51906001600160401b03821682036104a557565b51906001600160a01b03821682036104a557565b906040519160e083018381106001600160401b03821117610a16576040525f835260208301925f845260408101935f8552606082015f815260808301915f835260a08401915f835260c0850193606085528598875188019760408160208b019a03126104a557613a5f60208201613971565b506040810151906001600160401b0382116104a557019780603f8a0112156104a5576020890151613a8f81612ba0565b99613a9d6040519b8c612b7f565b818b52602080808d019360051b83010101918383116104a55760408201905b838210613d865750505050506003885110613d7757613ada88612eed565b5195865187019360e0888603126104a557613af7602089016139c5565b96613b0460408a016139c5565b94613b1160608b016139d9565b938a613b1f60808201612dee565b93613b2c60a083016139d9565b9260e060c08401519301516001600160401b0381116104a5576001600160401b039e8f9c613b6192602080920192010161397f565b9052526001600160a01b0390811690915290151590915216905216905216905280515f1981019081116106a857613b9791612f2e565b5190815182019160208301906080818503126104a557613bb960208201613971565b93613bc6604083016139c5565b5060608201516001600160401b0381116104a557820183603f820112156104a557602081015191613bf683612ba0565b92613c046040519485612b7f565b8084526020808086019260051b85010101928684116104a55760408101915b848310613c6e57505050505060808201516001600160401b0381116104a5576001936020613c559260ff95010161397f565b50931603613c5f57565b63678747ed60e01b5f5260045ffd5b82516001600160401b0381116104a55782016020810191906060908603601f1901126104a55760405190606082018281106001600160401b03821117610a165760405260208301516001600160a01b03811681036104a557825260408301516001600160401b0381116104a5576020908401018a601f820112156104a557805190613cf882612ba0565b91613d066040519384612b7f565b80835260208084019160051b830101918d83116104a557602001905b828210613d675750505060208301526060830151916001600160401b0383116104a557613d578b60208096958196010161397f565b6040820152815201920191613c23565b8151815260209182019101613d22565b63d797fa2760e01b5f5260045ffd5b81516001600160401b0381116104a557602091613daa87848080958901010161397f565b815201910190613abc565b90613dbf82613f4f565b612134810281810461213414821517156106a8577ff8ce2022830beb6ec696a46e42bce832af3c51a200a9b65f3e0c4113ecde21e59161271060a0920493613e078583612f42565b90600180851b031694855f52601560205260405f2091613e28828454612c75565b835560018301613e39858254612c75565b9055426002840155613e4d82601054612c75565b601055613e5c81600f54612c75565b9283600f5554916040519485526020850152604084015260608301526080820152a2565b91908015613f275760968102908082046096036106a8577f5f8b464a2e5b2e91035933ade31583090b81103f3553c66bcdb23b40a2e23a869361271061354b930491613ecc8382612f42565b9586848195613efc575b6040805194855260208501919091528301526001600160a01b03831691606090a2613f2d565b613f0881601e54612c75565b601e55601d54613f229082906001600160a01b0316613f2d565b613ed6565b505f9150565b8115613f4b575f80809381935af1613f43613942565b501561046657565b5050565b6020549060018060a01b0316805f52602160205260405f2054808311613f7f575b505f52602160205260405f2055565b613fa3670de0b6b3a764000091835f526015602052610c2d60405f20549186612f42565b048015613f7057815f526022602052613fc160405f20918254612c75565b90555f613f7056fea26469706673582212204f559c9648a3d62f665d826069c1b0b74d4c67ca86124ca307e33523549bf0d564736f6c634300081c0033" as const;
