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
      }
    ],
    "stateMutability": "nonpayable",
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

export const temiVaultBytecode = "0x608034608557601f612ac838819003918201601f19168301916001600160401b03831184841017608957808492602094604052833981010312608557516001600160a01b03811680820360855760815750335b600780546001600160a01b0319166001600160a01b0392909216919091179055604051612a2a908161009e8239f35b6052565b5f80fd5b634e487b7160e01b5f52604160045260245ffdfe60806040526004361015610011575f80fd5b5f3560e01c8063056044db14611e565780630e02025214611e395780630f80924714611e1d5780631904b97314611e005780631a4d3888146119fa5780631f4d6a03146119dd57806324acd5bb146119a45780632829281c1461196a57806328d1db731461194f57806329eb2cf4146119325780632cc3ce801461188f5780632f76464414611860578063318f1a6414611821578063374beed8146115af578063380b9bc9146115925780634595bed6146115635780634779db561461153f5780634fc663b21461152157806359a83598146114f85780635dc565c2146114dc57806361d027b3146114b45780636213e9811461135b5780636b7a7fd8146112fd5780636dd89124146112e05780636fb3cfb41461121757806372dd74c0146111fc57806375afc18f146111c257806378833836146111a657806379cd17641461118a5780637b775ebc14610e4957806381e368b714610e095780638480d57a14610dec578063876574eb14610da457806388dcb16914610d855780638b0ad97614610d535780638f840ddd14610d3857806391656fba14610d1b578063a435e93714610cad578063b44edecb14610c92578063b816fc1114610bb1578063c9a396e914610b13578063cdcddaf5146107ef578063d66bd52414610793578063e1a4521814610777578063e1a72b4a1461075b578063e5d392591461073e578063e692829214610718578063ee3da0551461066a578063f24335db14610402578063f251c381146103d6578063f490bea514610368578063f776a0ad1461034b5763ffd0984d14610260575f80fd5b3461034757602036600319011261034757600435600160195414610338576001601955335f52601560205260405f208115801561032e575b610317575f8083836102ad839684965461238f565b81556102bb8260105461238f565b601055546040519082825260208201527f2cd8de105dd0197df9875e5090b06ecfe6c56304b8e12418dc87f5ea08d6b57260403392a2335af16102fc612491565b5015610308575f601955005b6312171d8360e31b5f5260045ffd5b5490630483a59360e51b5f5260045260245260445ffd5b5080548211610298565b63558a1e0360e11b5f5260045ffd5b5f80fd5b34610347575f366003190112610347576020601454604051908152f35b34610347576040366003190112610347576004356001600160401b03811161034757610398903690600401612004565b6024356001600160401b038111610347576060916103bd6103c392369060040161207c565b906124c0565b9060405192835260208301526040820152f35b5f3660031901126103475734156103f3576103f13433612932565b005b6356316e8760e01b5f5260045ffd5b3461034757608036600319011261034757600435602435600281101561034757604435606435906001600160401b03821691828103610347575f858152601760205260409020546001600160a01b03166106575781156106485760018414908180610640575b61063157811561062a575b60405161047f81611f7b565b8681526020810161049087826123c6565b604082018581526001600160401b036060840194168452608083019260018452895f52601660205260405f2090518155600181019251916002831015610616576001600160401b039360039360ff80198354169116179055516002820155019251166001600160401b031983541617825551151560ff60401b82549160401b169060ff60401b1916179055845f52601760205260405f2060018060a01b0333166001600160601b0360a01b825416179055335f52601860205260405f208054680100000000000000008110156106025761056f9160018201815561247c565b81549060031b9087821b915f19901b1916179055601354600181018091116105ee576013556105d8575b6105a66040518094611ed8565b602083015260408201527f1142a6affc917ff7f4eea502d1d1f8f982eb3107dc5cbaebd6b4531d745c216260603392a3005b601454600181018091116105ee57601455610599565b634e487b7160e01b5f52601160045260245ffd5b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52602160045260245ffd5b505f610473565b63cd345e3b60e01b5f5260045ffd5b508315610468565b63394a288960e11b5f5260045ffd5b84633d39a51b60e11b5f5260045260245ffd5b34610347576020366003190112610347576001600160a01b0361068b611f4f565b165f52601560205260405f20600f546103e881028181046103e814821517156105ee57612710900460018301546003810290808204600314901517156105ee57600360209401548082115f14610710576106e49161238f565b808210156107085750905b8082101561070157505b604051908152f35b90506106f9565b9050906106ef565b50505f6106e4565b34610347575f3660031901126103475760206001600160401b0360065416604051908152f35b34610347575f366003190112610347576020600354604051908152f35b34610347575f3660031901126103475760206040516121348152f35b34610347575f3660031901126103475760206040516127108152f35b34610347576020366003190112610347576001600160a01b036107b4611f4f565b165f90815260156020908152604091829020805460018201546002830154600390930154855192835293820152928301526060820152608090f35b34610347576020366003190112610347576004356001600160401b0381116103475761082261082e913690600401611eab565b91905f928101906120cf565b6001600160401b0385165f818152600860205260409020546001600160a01b03169690959093929091908715610b00578392610883602093889360405196879586956302f4d16760e01b875260048701612248565b03815f610fd25af1908115610af5575f91610abb575b5015610aac576108a89061256a565b5f929150829081805b8251861015610a9d576108c4868461237b565b5180519095906001600160a01b03168a9003610a8f57602086019687516003815103610a7e576109147f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f9161233a565b5103610a675750505050505060406109309251910151906124c0565b94919290929360015b15610a54575f851315610a4157600a5480851115610a2b575061546086018087116105ee574211610a14576402540be4008502948086046402540be40014901517156105ee577fb470e361f4be258af4a3b5952c49b1393a49c5f87f88c1da39aef7386834339a60606040976080946001600160401b038a51916109bc83611f7b565b8a8352896020840152838c84015242858401521695869101528760095586600a5580600b5542600c55846001600160401b0319600d541617600d5588519088825287602083015289820152a482519182526020820152f35b8563746c24ab60e01b5f526004524260245260445ffd5b846364ec291360e11b5f5260045260245260445ffd5b846335779cb160e21b5f5260045260245ffd5b8263420811e160e01b5f5260045260245ffd5b90929496506001919395505b0194929093916108b1565b509092949650600191939550610a73565b919395600191939550610a73565b96929150969350939193610939565b636f5f608760e01b5f5260045ffd5b90506020813d602011610aed575b81610ad660209383611fcc565b8101031261034757610ae79061223b565b86610899565b3d9150610ac9565b6040513d5f823e3d90fd5b8663f5ddb80160e01b5f5260045260245ffd5b3461034757602036600319011261034757610b2c611f4f565b5f6060604051610b3b81611f96565b828152826020820152826040820152015260018060a01b03165f526015602052608060405f20604051610b6d81611f96565b815491828252600181015460208301908152606060036002840154936040860194855201549301928352604051938452516020840152516040830152516060820152f35b3461034757604036600319011261034757610bca611f25565b610bd2611f65565b6007549091906001600160a01b03163303610c83576001600160401b031690815f525f60205260018060a01b0360405f205416610c70576001600160a01b03168015610c615760207fe03727d120899f344de184df2af9378a5efa275abe949641225634ab0f25f79991835f525f825260405f20816001600160601b0360a01b825416179055604051908152a2005b63032a203560e51b5f5260045ffd5b50639271091d60e01b5f5260045260245ffd5b63b90cdbb160e01b5f5260045ffd5b34610347575f36600319011261034757602060405160038152f35b34610347575f366003190112610347576101206010546001600160401b03600f54601154601254600454600554916003549360065495604051988952602089015260408801526060870152608086015260a085015260c084015281811660e084015260401c16610100820152f35b34610347575f366003190112610347576020601354604051908152f35b34610347575f36600319011261034757602047604051908152f35b34610347576020366003190112610347576004355f526017602052602060018060a01b0360405f205416604051908152f35b34610347575f3660031901126103475760206040516402540be4008152f35b34610347575f3660031901126103475760a0600954600a54600b54600c54906001600160401b03600d5416926040519485526020850152604084015260608301526080820152f35b34610347575f366003190112610347576020601254604051908152f35b34610347576020366003190112610347576001600160401b03610e2a611f25565b165f526008602052602060018060a01b0360405f205416604051908152f35b346103475760c0366003190112610347576004356024359060443591606435608435936001600160401b0385168095036103475760a43594600160195414610338576001601955845f52601660205260405f20805415611177575f868152601760205260409020546001600160a01b0316330361116457600381019687549160ff8360401c16156111515786158015611144575b611135576064851061111d576103528610611104576001015460ff166002811015610616576001036110dd57506001600160401b0316908181036110c85750505b335f52601560205260405f20948554908185105f146110c15784905b610f44828761238f565b92600f54986103e88a028a81046103e8148b1517156105ee5761271090049160018201549a60038c029b808d04600314901517156105ee57600383019384549c8d8082115f146110b857610f979161238f565b905b8089116110b0575b508088116110a8575b508087116110a0575b50610fbe86866120c2565b9a8b1561109157610fdb92610fd487899461238f565b90556120c2565b9055610fe98260105461238f565b601055610ff883600f5461238f565b600f55601154600181018091116105ee57601155611018886012546120c2565b60125560ff60401b19815416905560405194855260208501526040840152846060840152608083015260a08201527f32c067efd8d3985facc3f3795ff191139ab27e7c1c64b23a12312f1ea0123d6360c03392a35f80808084335af161107c612491565b5015610308576020905f601955604051908152f35b631e1f16ef60e31b5f5260045ffd5b95508b610fb3565b96508c610faa565b97508d610fa1565b50505f90610f99565b8190610f3a565b634402954960e11b5f5260045260245260445ffd5b9150508481036110ed5750610f1e565b849063736af44560e11b5f5260045260245260445ffd5b85637fdb281960e01b5f5260045261035260245260445ffd5b84635fd3165360e11b5f52600452606460245260445ffd5b63843ce46b60e01b5f5260045ffd5b5060028101548711610edd565b876371066ef160e01b5f5260045260245ffd5b85631461f53360e11b5f5260045260245ffd5b8563082cdf1f60e11b5f5260045260245ffd5b34610347575f366003190112610347576020604051610fd28152f35b34610347575f3660031901126103475760206040516103528152f35b34610347575f3660031901126103475760206040517f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f8152f35b34610347575f36600319011261034757602060405160648152f35b3461034757604036600319011261034757611230611f25565b611238611f65565b6007549091906001600160a01b03163303610c83576001600160401b03165f818152600860205260409020549091906001600160a01b03166112cd576001600160a01b03168015610c615760207fe56f7cd60e9fc73619fc4c0efdc539901a05499d514f0abb23f23c301eeec15491835f526008825260405f20816001600160601b0360a01b825416179055604051908152a2005b506359fb5db160e01b5f5260045260245ffd5b34610347575f366003190112610347576020600e54604051908152f35b3461034757602036600319011261034757600754600435906001600160a01b03163303610c83577f62cb5b8f95d2f71b121e4423241cf007a3e5a5a99b63891d7395f8066df5935f6040600e548151908152836020820152a1600e55005b34610347576020366003190112610347576001600160a01b0361137c611f4f565b165f52601860205260405f20805461139381611fed565b916113a16040519384611fcc565b818352601f196113b083611fed565b015f5b81811061149d5750505f5b82811061141557836040518091602082016020835281518091526020604084019201905f5b8181106113f1575050500390f35b91935091602060a0826114076001948851611ee5565b0194019101918493926113e3565b806114226001928461247c565b90549060031b1c5f52601660205260405f2060ff60036040519261144584611f7b565b8054845261145b838783015416602086016123c6565b6002810154604085015201546001600160401b038116606084015260401c161515608082015261148b828761237b565b52611496818661237b565b50016113be565b6020906114a861239c565b828288010152016113b3565b34610347575f366003190112610347576007546040516001600160a01b039091168152602090f35b34610347575f3660031901126103475760206040516154608152f35b34610347575f3660031901126103475760206001600160401b0360065460401c16604051908152f35b346103475760203660031901126103475760206106f960043561240f565b34610347575f3660031901126103475760206115596123eb565b6040519015158152f35b34610347576020366003190112610347576004355f526001602052602060ff60405f2054166040519015158152f35b34610347575f366003190112610347576020600f54604051908152f35b34610347576020366003190112610347576004356001600160401b038111610347576115e261162c913690600401611eab565b919060206116075f925f956115f56123d2565b506115fe6123d2565b508101906120cf565b906040969493959296519788928392630f989c4b60e31b845289898860048701612248565b0381610fd25afa948515610af5575f956117dd575b506001600160401b03165f818152602081905260409020546001600160a01b03169590939091906116719061256a565b9690505f925b87518410156117c657816001600160a01b03611693868b61237b565b515116036117bb57600360206116a9868b61237b565b51015151036117bb577f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f36116ea60206116e2878c61237b565b51015161233a565b51036117ab57506001600160a01b0391506117149050602061170c848961237b565b51015161236b565b5116948515611777575b60409161172a9161237b565b51015191602083519381808201958692010103126103475760a0946001600160401b039351905b6040519515158652600180881b0316602086015260408501526060840152166080820152f35b945060409061172a906001600160a01b0361179f6020611797848b61237b565b51015161235b565b5116969150915061171e565b9091926001905b01929190611677565b9091926001906117b2565b91905060a096506001600160401b03949250611751565b9094506020813d602011611819575b816117f960209383611fcc565b81010312610347576118126001600160401b039161223b565b9490611641565b3d91506117ec565b34610347576020366003190112610347576001600160401b03611842611f25565b165f525f602052602060018060a01b0360405f205416604051908152f35b34610347576020366003190112610347576004355f526002602052602060ff60405f2054166040519015158152f35b34610347576020366003190112610347576004356118ab61239c565b50805f52601660205260405f2060ff6003604051926118c984611f7b565b805484526118e083600183015416602086016123c6565b6002810154604085015201546001600160401b038116606084015260401c161515608082015280511561191f5760a09061191d6040518092611ee5565bf35b5063082cdf1f60e11b5f5260045260245ffd5b34610347575f366003190112610347576020601154604051908152f35b34610347575f36600319011261034757602060405160018152f35b34610347575f3660031901126103475760206040517f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f38152f35b34610347575f36600319011261034757601354601454600454600554604080519485526020850193909352918301526060820152608090f35b34610347575f366003190112610347576020600554604051908152f35b34610347576060366003190112610347576004356001600160401b03811161034757611a2a903690600401611eab565b602435604435925f92825f52600260205260ff60405f205416611ded5790611a54918101906120cf565b9691949092936001600160401b03811695865f525f60205260018060a01b0360405f205416988915611dda578151602083012095865f52600160205260ff60405f205416611dc7576040516302f4d16760e01b81529160209183918291611ac29190878d8a60048701612248565b03815f610fd25af1908115610af5575f91611d8d575b5015610aac57611ae79061256a565b9390505f5f945f915f9a5b82518c1015611d8157611b058c8461237b565b5180519098906001600160a01b03168e9003611d7257602089019c8d516003815103611d6057611b557f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f39161233a565b5103611d475750505050505060018060a01b03611b72895161235b565b5198519816976001600160a01b0390611b8a9061236b565b5116938415611d3f575b604001516020815191818082019384920101031261034757519060015b15611d2c57818103611d175750611bc79061240f565b95600354808811611d015750825f52600260205260405f20600160ff19825416179055845f52600160205260405f20600160ff19825416179055611c0d8760035461238f565b6003556004549860018a01809a116105ee577f5655105af0dd9d0e81ccf3b81987e9eed31e59bacb5da431fe95f386832bc08a60a089976001600160401b03611cf59a60409e600455611c628b6005546120c2565b6005551695866fffffffffffffffff00000000000000006006549260401b16916fffffffffffffffffffffffffffffffff19161717600655600180831b0388169b8c948e519289845260208401528e830152600180841b03166060820152886080820152a47fb6b5d830d9ee7e772866b65acf8e51ea4a2ff1c6e602d092d0bf366bf3e9b27160208851858152a2612932565b82519182526020820152f35b8763cd081bd160e01b5f5260045260245260445ffd5b63ce6b173b60e01b5f5260045260245260445ffd5b8963785a3a3b60e11b5f5260045260245ffd5b889450611b94565b9092949c50600191939598505b019a9290969391611af2565b509092949c5060019193959850611d54565b91939b60019193959850611d54565b96939291509950611bb1565b90506020813d602011611dbf575b81611da860209383611fcc565b8101031261034757611db99061223b565b8a611ad8565b3d9150611d9b565b8663b0eea50760e01b5f5260045260245ffd5b876337eab18360e11b5f5260045260245ffd5b8263b0eea50760e01b5f5260045260245ffd5b34610347575f366003190112610347576020600454604051908152f35b34610347575f3660031901126103475760206040516103e88152f35b34610347575f366003190112610347576020601054604051908152f35b5f3660031901126103475734156103f357611e73346003546120c2565b806003556040519034825260208201527f15873de5b5375786541a057377d4d2719c0a5f3769d1af962d2263e406cda57460403392a2005b9181601f84011215610347578235916001600160401b038311610347576020838186019501011161034757565b9060028210156106165752565b6080809180518452611eff60208201516020860190611ed8565b604081015160408501526001600160401b03606082015116606085015201511515910152565b600435906001600160401b038216820361034757565b35906001600160401b038216820361034757565b600435906001600160a01b038216820361034757565b602435906001600160a01b038216820361034757565b60a081019081106001600160401b0382111761060257604052565b608081019081106001600160401b0382111761060257604052565b604081019081106001600160401b0382111761060257604052565b90601f801991011681019081106001600160401b0382111761060257604052565b6001600160401b0381116106025760051b60200190565b9080601f8301121561034757813561201b81611fed565b926120296040519485611fcc565b81845260208085019260051b82010192831161034757602001905b8282106120515750505090565b8135815260209182019101612044565b6001600160401b03811161060257601f01601f191660200190565b81601f820112156103475780359061209382612061565b926120a16040519485611fcc565b8284526020838301011161034757815f926020809301838601378301015290565b919082018092116105ee57565b919060a083820312610347576120e483611f3b565b926120f160208201611f3b565b9260408201356001600160401b038111610347578361211191840161207c565b9260608301356001600160401b038111610347578301604081830312610347576040519061213e82611fb1565b803582526020810135906001600160401b038211610347570182601f8201121561034757803561216d81611fed565b9161217b6040519384611fcc565b81835260208084019260061b8201019085821161034757602001915b8183106121fc575050506020820152926080810135906001600160401b038211610347570160408183031261034757604051916121d383611fb1565b8135835260208201356001600160401b038111610347576121f49201612004565b602082015290565b604083870312610347576040519061221382611fb1565b8335825260208401359081151582036103475782602092836040950152815201920191612197565b5190811515820361034757565b92906020926001600160401b038092979697168552168284015260a0604084015280519182918260a08601520160c084015e5f60c08284010152601f801991011681019260c0828503016060830152602061012081610100870193805160c0890152015195604060e08201528651809452019401905f5b81811061231657505050608081840391015260206060816040850193805186520151936040838201528451809452019201905f5b8181106123005750505090565b82518452602093840193909201916001016122f3565b825180518752602090810151151581880152604090960195909201916001016122bf565b8051156123475760200190565b634e487b7160e01b5f52603260045260245ffd5b8051600110156123475760400190565b8051600210156123475760600190565b80518210156123475760209160051b010190565b919082039182116105ee57565b604051906123a982611f7b565b5f6080838281528260208201528260408201528260608201520152565b60028210156106165752565b604051906123df82611fb1565b60606020835f81520152565b600b5480151590816123fb575090565b905061546081018091116105ee5742111590565b600b54801561246d576124206123eb565b156124575750600e5490811561244857600954908181029181830414901517156105ee570490565b63078c583760e51b5f5260045ffd5b63746c24ab60e01b5f526004524260245260445ffd5b639578db0b60e01b5f5260045ffd5b8054821015612347575f5260205f2001905f90565b3d156124bb573d906124a282612061565b916124b06040519384611fcc565b82523d5f602084013e565b606090565b916124d46124cd8461235b565b519361236b565b519160208151918180820193849201010312610347575190565b519060ff8216820361034757565b81601f820112156103475780519061251382612061565b926125216040519485611fcc565b8284526020838301011161034757815f9260208093018386015e8301015290565b51906001600160401b038216820361034757565b51906001600160a01b038216820361034757565b906040519160e083018381106001600160401b03821117610602576040525f835260208301925f845260408101935f8552606082015f815260808301915f835260a08401915f835260c0850193606085528598875188019760408160208b019a0312610347576125dc602082016124ee565b506040810151906001600160401b03821161034757019780603f8a01121561034757602089015161260c81611fed565b9961261a6040519b8c611fcc565b818b52602080808d019360051b83010101918383116103475760408201905b83821061290357505050505060038851106128f4576126578861233a565b5195865187019360e0888603126103475761267460208901612542565b9661268160408a01612542565b9461268e60608b01612556565b938a61269c6080820161223b565b936126a960a08301612556565b9260e060c08401519301516001600160401b038111610347576001600160401b039e8f9c6126de9260208092019201016124fc565b9052526001600160a01b0390811690915290151590915216905216905216905280515f1981019081116105ee576127149161237b565b51908151820191602083019060808185031261034757612736602082016124ee565b9361274360408301612542565b5060608201516001600160401b03811161034757820183603f820112156103475760208101519161277383611fed565b926127816040519485611fcc565b8084526020808086019260051b85010101928684116103475760408101915b8483106127eb57505050505060808201516001600160401b0381116103475760019360206127d29260ff9501016124fc565b509316036127dc57565b63678747ed60e01b5f5260045ffd5b82516001600160401b0381116103475782016020810191906060908603601f1901126103475760405190606082018281106001600160401b038211176106025760405260208301516001600160a01b038116810361034757825260408301516001600160401b038111610347576020908401018a601f820112156103475780519061287582611fed565b916128836040519384611fcc565b80835260208084019160051b830101918d831161034757602001905b8282106128e45750505060208301526060830151916001600160401b038311610347576128d48b6020809695819601016124fc565b60408201528152019201916127a0565b815181526020918201910161289f565b63d797fa2760e01b5f5260045ffd5b81516001600160401b038111610347576020916129278784808095890101016124fc565b815201910190612639565b90612134810281810461213414821517156105ee577ff8ce2022830beb6ec696a46e42bce832af3c51a200a9b65f3e0c4113ecde21e59161271060a092049361297b858361238f565b90600180851b031694855f52601560205260405f209161299c8284546120c2565b8355600183016129ad8582546120c2565b90554260028401556129c1826010546120c2565b6010556129d081600f546120c2565b9283600f5554916040519485526020850152604084015260608301526080820152a256fea2646970667358221220bde6c8c1c9ff8fd6d19a71f340d787401f1f4a5331925ec349453e413a7db57664736f6c634300081c0033" as const;
