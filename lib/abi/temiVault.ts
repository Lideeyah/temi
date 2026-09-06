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
    "name": "MalformedTxPayload",
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
        "name": "portal",
        "type": "address"
      }
    ],
    "name": "TrustedSourcePortalSet",
    "type": "event"
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
      }
    ],
    "stateMutability": "view",
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

export const temiVaultBytecode = "0x608034608557601f6121bb38819003918201601f19168301916001600160401b03831184841017608957808492602094604052833981010312608557516001600160a01b03811680820360855760815750335b600780546001600160a01b0319166001600160a01b039290921691909117905560405161211d908161009e8239f35b6052565b5f80fd5b634e487b7160e01b5f52604160045260245ffdfe60806040526004361015610011575f80fd5b5f3560e01c8063056044db146116455780630e020252146116285780630f8092471461160c5780631904b973146115ef5780631a4d3888146111e35780631f4d6a03146111c65780632829281c1461118c57806328d1db731461117157806329eb2cf4146111545780632cc3ce80146110b15780632f76464414611082578063318f1a6414611043578063374beed814610dc6578063380b9bc914610da95780634595bed614610d7a5780634652c2c814610a8857806359a8359814610a5f57806361d027b314610a375780636213e981146108de57806372dd74c0146108c357806378833836146108a757806379cd17641461088b5780638480d57a1461086e5780638b0ad9761461083c5780638f840ddd14610821578063a435e937146107b3578063b44edecb14610798578063b816fc11146106f0578063c9a396e91461066b578063d66bd5241461061c578063e1a4521814610600578063e1a72b4a146105e4578063e5d39259146105c7578063e6928292146105a1578063ee3da055146104fd578063f24335db146102d2578063f251c381146102a65763ffd0984d146101bb575f80fd5b346102a25760203660031901126102a257600435600160105414610293576001601055335f52600c60205260405f2081158015610289575b610272575f8083836102088396849654611b51565b815561021682600954611b51565b600955546040519082825260208201527f2cd8de105dd0197df9875e5090b06ecfe6c56304b8e12418dc87f5ea08d6b57260403392a2335af1610257611bad565b5015610263575f601055005b6312171d8360e31b5f5260045ffd5b5490630483a59360e51b5f5260045260245260445ffd5b50805482116101f3565b63558a1e0360e11b5f5260045ffd5b5f80fd5b5f3660031901126102a25734156102c3576102c13433612025565b005b6356316e8760e01b5f5260045ffd5b346102a25760803660031901126102a25760043560243560028110156102a257604435606435906001600160401b038216918281036102a2575f858152600e60205260409020546001600160a01b03166104ea5781156104db576001841480806104d3575b6104c457156104bd575b60405161034d81611761565b8581526020810161035e8682611b88565b604082018481526001600160401b036060840194168452608083019260018452885f52600d60205260405f20905181556001810192519160028310156104a9576001600160401b039360039360ff80198354169116179055516002820155019251166001600160401b031983541617825551151560ff60401b82549160401b169060ff60401b1916179055835f52600e60205260405f2060018060a01b0333166bffffffffffffffffffffffff60a01b825416179055335f52600f60205260405f208054680100000000000000008110156104955761044291600182018155611bdc565b81549060031b9086821b915f19901b191617905561046360405180946116c7565b602083015260408201527f1142a6affc917ff7f4eea502d1d1f8f982eb3107dc5cbaebd6b4531d745c216260603392a3005b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52602160045260245ffd5b505f610341565b63cd345e3b60e01b5f5260045ffd5b508315610337565b63394a288960e11b5f5260045ffd5b84633d39a51b60e11b5f5260045260245ffd5b346102a25760203660031901126102a25761051661173e565b6008546103e881028181046103e8148215171561058d5761271090049160018060a01b03165f52600c602052600160405f2001549160038302928084046003149015171561058d57602092808210156105855750905b8082101561057e57505b604051908152f35b9050610576565b90509061056c565b634e487b7160e01b5f52601160045260245ffd5b346102a2575f3660031901126102a25760206001600160401b0360065416604051908152f35b346102a2575f3660031901126102a2576020600354604051908152f35b346102a2575f3660031901126102a25760206040516121348152f35b346102a2575f3660031901126102a25760206040516127108152f35b346102a25760203660031901126102a2576001600160a01b0361063d61173e565b165f52600c602052606060405f20805490600260018201549101549060405192835260208301526040820152f35b346102a25760203660031901126102a25761068461173e565b5f604080516106928161177c565b828152826020820152015260018060a01b03165f52600c602052606060405f206040516106be8161177c565b815491828252604060026001830154926020850193845201549201918252604051928352516020830152516040820152f35b346102a25760403660031901126102a257610709611714565b6024356001600160a01b03811691908290036102a2576007546001600160a01b031633036107895760206001600160401b037fe03727d120899f344de184df2af9378a5efa275abe949641225634ab0f25f799921692835f525f825260405f20816bffffffffffffffffffffffff60a01b825416179055604051908152a2005b63b90cdbb160e01b5f5260045ffd5b346102a2575f3660031901126102a257602060405160038152f35b346102a2575f3660031901126102a2576101206009546001600160401b03600854600a54600b54600454600554916003549360065495604051988952602089015260408801526060870152608086015260a085015260c084015281811660e084015260401c16610100820152f35b346102a2575f3660031901126102a257602047604051908152f35b346102a25760203660031901126102a2576004355f52600e602052602060018060a01b0360405f205416604051908152f35b346102a2575f3660031901126102a2576020600b54604051908152f35b346102a2575f3660031901126102a2576020604051610fd28152f35b346102a2575f3660031901126102a25760206040516103528152f35b346102a2575f3660031901126102a257602060405160648152f35b346102a25760203660031901126102a2576001600160a01b036108ff61173e565b165f52600f60205260405f208054610916816117ee565b9161092460405193846117b2565b818352601f19610933836117ee565b015f5b818110610a205750505f5b82811061099857836040518091602082016020835281518091526020604084019201905f5b818110610974575050500390f35b91935091602060a08261098a60019488516116d4565b019401910191849392610966565b806109a560019284611bdc565b90549060031b1c5f52600d60205260405f2060ff6003604051926109c884611761565b805484526109de83878301541660208601611b88565b6002810154604085015201546001600160401b038116606084015260401c1615156080820152610a0e8287611b3d565b52610a198186611b3d565b5001610941565b602090610a2b611b5e565b82828801015201610936565b346102a2575f3660031901126102a2576007546040516001600160a01b039091168152602090f35b346102a2575f3660031901126102a25760206001600160401b0360065460401c16604051908152f35b346102a25760a03660031901126102a2576004356024359060443591606435608435936001600160401b0385168095036102a257600160105414610293576001601055835f52600d60205260405f20805415610d67575f858152600e60205260409020546001600160a01b03163303610d5457600381019586549160ff8360401c1615610d415785158015610d34575b610d255760648410610d0d576103528510610cf4576001015460ff1660028110156104a95760011480610ce1575b610cc1575050335f52600c60205260405f208054958685105f14610cba5784905b610b718287611b51565b926008546103e881028181046103e8148215171561058d57612710900460018301549060038202918083046003149015171561058d57808711610cb2575b50808611610caa575b50808511610ca2575b50610bcc8484611754565b988915610c935783610bdd91611b51565b9055610beb82600954611b51565b600955610bfa83600854611b51565b600855600a546001810180911161058d57600a55610c1a88600b54611754565b600b5560ff60401b19815416905560405194855260208501526040840152846060840152608083015260a08201527f32c067efd8d3985facc3f3795ff191139ab27e7c1c64b23a12312f1ea0123d6360c03392a35f80808084335af1610c7e611bad565b5015610263576020905f601055604051908152f35b631e1f16ef60e31b5f5260045ffd5b935089610bc1565b94508a610bb8565b95508b610baf565b8690610b67565b6001600160401b039250634402954960e11b5f526004521660245260445ffd5b506001600160401b038216811415610b46565b84637fdb281960e01b5f5260045261035260245260445ffd5b83635fd3165360e11b5f52600452606460245260445ffd5b63843ce46b60e01b5f5260045ffd5b5060028101548611610b18565b866371066ef160e01b5f5260045260245ffd5b84631461f53360e11b5f5260045260245ffd5b8463082cdf1f60e11b5f5260045260245ffd5b346102a25760203660031901126102a2576004355f526001602052602060ff60405f2054166040519015158152f35b346102a2575f3660031901126102a2576020600854604051908152f35b346102a25760203660031901126102a2576004356001600160401b0381116102a257610df9610e4391369060040161169a565b91906020610e1e5f925f95610e0c611b94565b50610e15611b94565b50810190611805565b906040969493959296519788928392630f989c4b60e31b845289898860048701611a0a565b0381610fd25afa948515611038575f95610ff4575b506001600160401b03165f818152602081905260409020546001600160a01b0316959093909190610e8890611c6d565b9690505f925b8751841015610fdd57816001600160a01b03610eaa868b611b3d565b51511603610fd25760036020610ec0868b611b3d565b5101515103610fd2577f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f3610f016020610ef9878c611b3d565b510151611afc565b5103610fc257506001600160a01b039150610f2b90506020610f238489611b3d565b510151611b2d565b5116948515610f8e575b604091610f4191611b3d565b51015191602083519381808201958692010103126102a25760a0946001600160401b039351905b6040519515158652600180881b0316602086015260408501526060840152166080820152f35b9450604090610f41906001600160a01b03610fb66020610fae848b611b3d565b510151611b1d565b51169691509150610f35565b9091926001905b01929190610e8e565b909192600190610fc9565b91905060a096506001600160401b03949250610f68565b9094506020813d602011611030575b81611010602093836117b2565b810103126102a2576110296001600160401b03916119fd565b9490610e58565b3d9150611003565b6040513d5f823e3d90fd5b346102a25760203660031901126102a2576001600160401b03611064611714565b165f525f602052602060018060a01b0360405f205416604051908152f35b346102a25760203660031901126102a2576004355f526002602052602060ff60405f2054166040519015158152f35b346102a25760203660031901126102a2576004356110cd611b5e565b50805f52600d60205260405f2060ff6003604051926110eb84611761565b805484526111028360018301541660208601611b88565b6002810154604085015201546001600160401b038116606084015260401c16151560808201528051156111415760a09061113f60405180926116d4565bf35b5063082cdf1f60e11b5f5260045260245ffd5b346102a2575f3660031901126102a2576020600a54604051908152f35b346102a2575f3660031901126102a257602060405160018152f35b346102a2575f3660031901126102a25760206040517f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f38152f35b346102a2575f3660031901126102a2576020600554604051908152f35b346102a25760603660031901126102a2576004356001600160401b0381116102a25761121390369060040161169a565b9060243591604435905f92845f52600260205260ff60405f2054166115dc5761123e91810190611805565b969092936001600160401b03811692835f525f60205260018060a01b0360405f2054169889156115c9578151602083012095865f52600160205260ff60405f2054166115b6576040516302f4d16760e01b815291602091839182916112aa9190878d8a60048701611a0a565b03815f610fd25af1908115611038575f9161157c575b501561156d576112d290979397611c6d565b5f989150889081805b82518c1015611562576112ee8c84611b3d565b5180519098906001600160a01b03168e900361155357602089019c8d5160038151036115415761133e7f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f391611afc565b51036115285750505050505060018060a01b0361135b8951611b1d565b5198519816976001600160a01b039061137390611b2d565b5116938415611520575b60400151602081519181808201938492010103126102a257519660015b1561150d578781036114f657506003548088116114e05750825f52600260205260405f20600160ff19825416179055845f52600160205260405f20600160ff198254161790556113ec87600354611b51565b6003556004549860018a01809a1161058d577f5655105af0dd9d0e81ccf3b81987e9eed31e59bacb5da431fe95f386832bc08a60a089976001600160401b036114d49a60409e6004556114418b600554611754565b6005551695866fffffffffffffffff00000000000000006006549260401b16916fffffffffffffffffffffffffffffffff19161717600655600180831b0388169b8c948e519289845260208401528e830152600180841b03166060820152886080820152a47fb6b5d830d9ee7e772866b65acf8e51ea4a2ff1c6e602d092d0bf366bf3e9b27160208851858152a2612025565b82519182526020820152f35b8763cd081bd160e01b5f5260045260245260445ffd5b879063ce6b173b60e01b5f5260045260245260445ffd5b8963785a3a3b60e11b5f5260045260245ffd5b88945061137d565b9092949c50600191939598505b019a92909693916112db565b509092949c5060019193959850611535565b91939b60019193959850611535565b99929150995061139a565b636f5f608760e01b5f5260045ffd5b90506020813d6020116115ae575b81611597602093836117b2565b810103126102a2576115a8906119fd565b8a6112c0565b3d915061158a565b8663b0eea50760e01b5f5260045260245ffd5b846337eab18360e11b5f5260045260245ffd5b8463b0eea50760e01b5f5260045260245ffd5b346102a2575f3660031901126102a2576020600454604051908152f35b346102a2575f3660031901126102a25760206040516103e88152f35b346102a2575f3660031901126102a2576020600954604051908152f35b5f3660031901126102a25734156102c35761166234600354611754565b806003556040519034825260208201527f15873de5b5375786541a057377d4d2719c0a5f3769d1af962d2263e406cda57460403392a2005b9181601f840112156102a2578235916001600160401b0383116102a257602083818601950101116102a257565b9060028210156104a95752565b60808091805184526116ee602082015160208601906116c7565b604081015160408501526001600160401b03606082015116606085015201511515910152565b600435906001600160401b03821682036102a257565b35906001600160401b03821682036102a257565b600435906001600160a01b03821682036102a257565b9190820180921161058d57565b60a081019081106001600160401b0382111761049557604052565b606081019081106001600160401b0382111761049557604052565b604081019081106001600160401b0382111761049557604052565b90601f801991011681019081106001600160401b0382111761049557604052565b6001600160401b03811161049557601f01601f191660200190565b6001600160401b0381116104955760051b60200190565b919060a0838203126102a25761181a8361172a565b926118276020820161172a565b9260408201356001600160401b0381116102a257820183601f820112156102a2578035611853816117d3565b9161186160405193846117b2565b81835285602083830101116102a257815f92602080930183860137830101529260608301356001600160401b0381116102a25783016040818303126102a257604051906118ad82611797565b803582526020810135906001600160401b0382116102a2570182601f820112156102a25780356118dc816117ee565b916118ea60405193846117b2565b81835260208084019260061b820101908582116102a257602001915b8183106119be575050506020820152926080810135906001600160401b0382116102a25701906040828203126102a2576040519161194383611797565b803583526020810135906001600160401b0382116102a257019080601f830112156102a2578135611973816117ee565b9261198160405194856117b2565b81845260208085019260051b8201019283116102a257602001905b8282106119ae57505050602082015290565b813581526020918201910161199c565b6040838703126102a257604051906119d582611797565b8335825260208401359081151582036102a25782602092836040950152815201920191611906565b519081151582036102a257565b92906020926001600160401b038092979697168552168284015260a0604084015280519182918260a08601520160c084015e5f60c08284010152601f801991011681019260c0828503016060830152602061012081610100870193805160c0890152015195604060e08201528651809452019401905f5b818110611ad857505050608081840391015260206060816040850193805186520151936040838201528451809452019201905f5b818110611ac25750505090565b8251845260209384019390920191600101611ab5565b82518051875260209081015115158188015260409096019590920191600101611a81565b805115611b095760200190565b634e487b7160e01b5f52603260045260245ffd5b805160011015611b095760400190565b805160021015611b095760600190565b8051821015611b095760209160051b010190565b9190820391821161058d57565b60405190611b6b82611761565b5f6080838281528260208201528260408201528260608201520152565b60028210156104a95752565b60405190611ba182611797565b60606020835f81520152565b3d15611bd7573d90611bbe826117d3565b91611bcc60405193846117b2565b82523d5f602084013e565b606090565b8054821015611b09575f5260205f2001905f90565b519060ff821682036102a257565b81601f820112156102a257805190611c16826117d3565b92611c2460405194856117b2565b828452602083830101116102a257815f9260208093018386015e8301015290565b51906001600160401b03821682036102a257565b51906001600160a01b03821682036102a257565b906040519160e083018381106001600160401b03821117610495576040525f835260208301925f845260408101935f8552606082015f815260808301915f835260a08401915f835260c0850193606085528598875188019760408160208b019a03126102a257611cdf60208201611bf1565b506040810151906001600160401b0382116102a257019780603f8a0112156102a2576020890151611d0f816117ee565b99611d1d6040519b8c6117b2565b818b52602080808d019360051b83010101918383116102a25760408201905b838210611ff65750505050506003885110611fe757611d5a88611afc565b5195865187019360e0888603126102a257611d7760208901611c45565b96611d8460408a01611c45565b94611d9160608b01611c59565b938a611d9f608082016119fd565b93611dac60a08301611c59565b9260e060c08401519301516001600160401b0381116102a2576001600160401b039e8f9c611de1926020809201920101611bff565b9052526001600160a01b0390811690915290151590915216905216905216905280515f19810190811161058d57611e1791611b3d565b5190815182019160208301906080818503126102a257611e3960208201611bf1565b93611e4660408301611c45565b5060608201516001600160401b0381116102a257820183603f820112156102a257602081015191611e76836117ee565b92611e8460405194856117b2565b8084526020808086019260051b85010101928684116102a25760408101915b848310611eee57505050505060808201516001600160401b0381116102a2576001936020611ed59260ff950101611bff565b50931603611edf57565b63678747ed60e01b5f5260045ffd5b82516001600160401b0381116102a25782016020810191906060908603601f1901126102a25760405190611f218261177c565b60208301516001600160a01b03811681036102a257825260408301516001600160401b0381116102a2576020908401018a601f820112156102a257805190611f68826117ee565b91611f7660405193846117b2565b80835260208084019160051b830101918d83116102a257602001905b828210611fd75750505060208301526060830151916001600160401b0383116102a257611fc78b602080969581960101611bff565b6040820152815201920191611ea3565b8151815260209182019101611f92565b63d797fa2760e01b5f5260045ffd5b81516001600160401b0381116102a25760209161201a878480809589010101611bff565b815201910190611d3c565b906121348102818104612134148215171561058d577ff8ce2022830beb6ec696a46e42bce832af3c51a200a9b65f3e0c4113ecde21e59161271060a092049361206e8583611b51565b90600180851b031694855f52600c60205260405f209161208f828454611754565b8355600183016120a0858254611754565b90554260028401556120b482600954611754565b6009556120c381600854611754565b928360085554916040519485526020850152604084015260608301526080820152a256fea2646970667358221220ea862b2dbfb75d001c75e8822b05e52729539ff559369aae88e06de393fe587464736f6c634300081c0033" as const;
