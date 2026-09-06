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

export const temiVaultBytecode = "0x608034608557601f61227a38819003918201601f19168301916001600160401b03831184841017608957808492602094604052833981010312608557516001600160a01b03811680820360855760815750335b600780546001600160a01b0319166001600160a01b03929092169190911790556040516121dc908161009e8239f35b6052565b5f80fd5b634e487b7160e01b5f52604160045260245ffdfe60806040526004361015610011575f80fd5b5f3560e01c8063056044db146117045780630e020252146116e75780630f809247146116cb5780631904b973146116ae5780631a4d3888146112a25780631f4d6a031461128557806324acd5bb1461124f5780632829281c1461121557806328d1db73146111fa57806329eb2cf4146111dd5780632cc3ce801461113a5780632f7646441461110b578063318f1a64146110cc578063374beed814610e4f578063380b9bc914610e325780634595bed614610e035780634652c2c814610b1157806359a8359814610ae857806361d027b314610ac05780636213e9811461096757806372dd74c01461094c578063788338361461093057806379cd1764146109145780638480d57a146108f75780638b0ad976146108c55780638f840ddd146108aa57806391656fba1461088d578063a435e9371461081f578063b44edecb14610804578063b816fc111461075c578063c9a396e9146106d7578063d66bd52414610688578063e1a452181461066c578063e1a72b4a14610650578063e5d3925914610633578063e69282921461060d578063ee3da0551461057d578063f24335db14610310578063f251c381146102e4578063f776a0ad146102c75763ffd0984d146101dc575f80fd5b346102c35760203660031901126102c3576004356001601254146102b4576001601255335f52600e60205260405f20811580156102aa575b610293575f8083836102298396849654611c10565b815561023782600954611c10565b600955546040519082825260208201527f2cd8de105dd0197df9875e5090b06ecfe6c56304b8e12418dc87f5ea08d6b57260403392a2335af1610278611c6c565b5015610284575f601255005b6312171d8360e31b5f5260045ffd5b5490630483a59360e51b5f5260045260245260445ffd5b5080548211610214565b63558a1e0360e11b5f5260045ffd5b5f80fd5b346102c3575f3660031901126102c3576020600d54604051908152f35b5f3660031901126102c3573415610301576102ff34336120e4565b005b6356316e8760e01b5f5260045ffd5b346102c35760803660031901126102c35760043560243560028110156102c357604435606435906001600160401b038216918281036102c3575f858152601060205260409020546001600160a01b031661056a57811561055b5760018414908180610553575b61054457811561053d575b60405161038d81611820565b8681526020810161039e8782611c47565b604082018581526001600160401b036060840194168452608083019260018452895f52600f60205260405f2090518155600181019251916002831015610529576001600160401b039360039360ff80198354169116179055516002820155019251166001600160401b031983541617825551151560ff60401b82549160401b169060ff60401b1916179055845f52601060205260405f2060018060a01b0333166bffffffffffffffffffffffff60a01b825416179055335f52601160205260405f208054680100000000000000008110156105155761048291600182018155611c9b565b81549060031b9087821b915f19901b1916179055600c546001810180911161050157600c556104eb575b6104b96040518094611786565b602083015260408201527f1142a6affc917ff7f4eea502d1d1f8f982eb3107dc5cbaebd6b4531d745c216260603392a3005b600d546001810180911161050157600d556104ac565b634e487b7160e01b5f52601160045260245ffd5b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52602160045260245ffd5b505f610381565b63cd345e3b60e01b5f5260045ffd5b508315610376565b63394a288960e11b5f5260045ffd5b84633d39a51b60e11b5f5260045260245ffd5b346102c35760203660031901126102c3576105966117fd565b6008546103e881028181046103e814821517156105015761271090049160018060a01b03165f52600e602052600160405f2001549160038302928084046003149015171561050157602092808210156106055750905b808210156105fe57505b604051908152f35b90506105f6565b9050906105ec565b346102c3575f3660031901126102c35760206001600160401b0360065416604051908152f35b346102c3575f3660031901126102c3576020600354604051908152f35b346102c3575f3660031901126102c35760206040516121348152f35b346102c3575f3660031901126102c35760206040516127108152f35b346102c35760203660031901126102c3576001600160a01b036106a96117fd565b165f52600e602052606060405f20805490600260018201549101549060405192835260208301526040820152f35b346102c35760203660031901126102c3576106f06117fd565b5f604080516106fe8161183b565b828152826020820152015260018060a01b03165f52600e602052606060405f2060405161072a8161183b565b815491828252604060026001830154926020850193845201549201918252604051928352516020830152516040820152f35b346102c35760403660031901126102c3576107756117d3565b6024356001600160a01b03811691908290036102c3576007546001600160a01b031633036107f55760206001600160401b037fe03727d120899f344de184df2af9378a5efa275abe949641225634ab0f25f799921692835f525f825260405f20816bffffffffffffffffffffffff60a01b825416179055604051908152a2005b63b90cdbb160e01b5f5260045ffd5b346102c3575f3660031901126102c357602060405160038152f35b346102c3575f3660031901126102c3576101206009546001600160401b03600854600a54600b54600454600554916003549360065495604051988952602089015260408801526060870152608086015260a085015260c084015281811660e084015260401c16610100820152f35b346102c3575f3660031901126102c3576020600c54604051908152f35b346102c3575f3660031901126102c357602047604051908152f35b346102c35760203660031901126102c3576004355f526010602052602060018060a01b0360405f205416604051908152f35b346102c3575f3660031901126102c3576020600b54604051908152f35b346102c3575f3660031901126102c3576020604051610fd28152f35b346102c3575f3660031901126102c35760206040516103528152f35b346102c3575f3660031901126102c357602060405160648152f35b346102c35760203660031901126102c3576001600160a01b036109886117fd565b165f52601160205260405f20805461099f816118ad565b916109ad6040519384611871565b818352601f196109bc836118ad565b015f5b818110610aa95750505f5b828110610a2157836040518091602082016020835281518091526020604084019201905f5b8181106109fd575050500390f35b91935091602060a082610a136001948851611793565b0194019101918493926109ef565b80610a2e60019284611c9b565b90549060031b1c5f52600f60205260405f2060ff600360405192610a5184611820565b80548452610a6783878301541660208601611c47565b6002810154604085015201546001600160401b038116606084015260401c1615156080820152610a978287611bfc565b52610aa28186611bfc565b50016109ca565b602090610ab4611c1d565b828288010152016109bf565b346102c3575f3660031901126102c3576007546040516001600160a01b039091168152602090f35b346102c3575f3660031901126102c35760206001600160401b0360065460401c16604051908152f35b346102c35760a03660031901126102c3576004356024359060443591606435608435936001600160401b0385168095036102c3576001601254146102b4576001601255835f52600f60205260405f20805415610df0575f858152601060205260409020546001600160a01b03163303610ddd57600381019586549160ff8360401c1615610dca5785158015610dbd575b610dae5760648410610d96576103528510610d7d576001015460ff1660028110156105295760011480610d6a575b610d4a575050335f52600e60205260405f208054958685105f14610d435784905b610bfa8287611c10565b926008546103e881028181046103e8148215171561050157612710900460018301549060038202918083046003149015171561050157808711610d3b575b50808611610d33575b50808511610d2b575b50610c558484611813565b988915610d1c5783610c6691611c10565b9055610c7482600954611c10565b600955610c8383600854611c10565b600855600a546001810180911161050157600a55610ca388600b54611813565b600b5560ff60401b19815416905560405194855260208501526040840152846060840152608083015260a08201527f32c067efd8d3985facc3f3795ff191139ab27e7c1c64b23a12312f1ea0123d6360c03392a35f80808084335af1610d07611c6c565b5015610284576020905f601255604051908152f35b631e1f16ef60e31b5f5260045ffd5b935089610c4a565b94508a610c41565b95508b610c38565b8690610bf0565b6001600160401b039250634402954960e11b5f526004521660245260445ffd5b506001600160401b038216811415610bcf565b84637fdb281960e01b5f5260045261035260245260445ffd5b83635fd3165360e11b5f52600452606460245260445ffd5b63843ce46b60e01b5f5260045ffd5b5060028101548611610ba1565b866371066ef160e01b5f5260045260245ffd5b84631461f53360e11b5f5260045260245ffd5b8463082cdf1f60e11b5f5260045260245ffd5b346102c35760203660031901126102c3576004355f526001602052602060ff60405f2054166040519015158152f35b346102c3575f3660031901126102c3576020600854604051908152f35b346102c35760203660031901126102c3576004356001600160401b0381116102c357610e82610ecc913690600401611759565b91906020610ea75f925f95610e95611c53565b50610e9e611c53565b508101906118c4565b906040969493959296519788928392630f989c4b60e31b845289898860048701611ac9565b0381610fd25afa9485156110c1575f9561107d575b506001600160401b03165f818152602081905260409020546001600160a01b0316959093909190610f1190611d2c565b9690505f925b875184101561106657816001600160a01b03610f33868b611bfc565b5151160361105b5760036020610f49868b611bfc565b510151510361105b577f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f3610f8a6020610f82878c611bfc565b510151611bbb565b510361104b57506001600160a01b039150610fb490506020610fac8489611bfc565b510151611bec565b5116948515611017575b604091610fca91611bfc565b51015191602083519381808201958692010103126102c35760a0946001600160401b039351905b6040519515158652600180881b0316602086015260408501526060840152166080820152f35b9450604090610fca906001600160a01b0361103f6020611037848b611bfc565b510151611bdc565b51169691509150610fbe565b9091926001905b01929190610f17565b909192600190611052565b91905060a096506001600160401b03949250610ff1565b9094506020813d6020116110b9575b8161109960209383611871565b810103126102c3576110b26001600160401b0391611abc565b9490610ee1565b3d915061108c565b6040513d5f823e3d90fd5b346102c35760203660031901126102c3576001600160401b036110ed6117d3565b165f525f602052602060018060a01b0360405f205416604051908152f35b346102c35760203660031901126102c3576004355f526002602052602060ff60405f2054166040519015158152f35b346102c35760203660031901126102c357600435611156611c1d565b50805f52600f60205260405f2060ff60036040519261117484611820565b8054845261118b8360018301541660208601611c47565b6002810154604085015201546001600160401b038116606084015260401c16151560808201528051156111ca5760a0906111c86040518092611793565bf35b5063082cdf1f60e11b5f5260045260245ffd5b346102c3575f3660031901126102c3576020600a54604051908152f35b346102c3575f3660031901126102c357602060405160018152f35b346102c3575f3660031901126102c35760206040517f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f38152f35b346102c3575f3660031901126102c3576080600c54600d5460045460055491604051938452602084015260408301526060820152f35b346102c3575f3660031901126102c3576020600554604051908152f35b346102c35760603660031901126102c3576004356001600160401b0381116102c3576112d2903690600401611759565b9060243591604435905f92845f52600260205260ff60405f20541661169b576112fd918101906118c4565b969092936001600160401b03811692835f525f60205260018060a01b0360405f205416988915611688578151602083012095865f52600160205260ff60405f205416611675576040516302f4d16760e01b815291602091839182916113699190878d8a60048701611ac9565b03815f610fd25af19081156110c1575f9161163b575b501561162c5761139190979397611d2c565b5f989150889081805b82518c1015611621576113ad8c84611bfc565b5180519098906001600160a01b03168e900361161257602089019c8d516003815103611600576113fd7f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f391611bbb565b51036115e75750505050505060018060a01b0361141a8951611bdc565b5198519816976001600160a01b039061143290611bec565b51169384156115df575b60400151602081519181808201938492010103126102c357519660015b156115cc578781036115b5575060035480881161159f5750825f52600260205260405f20600160ff19825416179055845f52600160205260405f20600160ff198254161790556114ab87600354611c10565b6003556004549860018a01809a11610501577f5655105af0dd9d0e81ccf3b81987e9eed31e59bacb5da431fe95f386832bc08a60a089976001600160401b036115939a60409e6004556115008b600554611813565b6005551695866fffffffffffffffff00000000000000006006549260401b16916fffffffffffffffffffffffffffffffff19161717600655600180831b0388169b8c948e519289845260208401528e830152600180841b03166060820152886080820152a47fb6b5d830d9ee7e772866b65acf8e51ea4a2ff1c6e602d092d0bf366bf3e9b27160208851858152a26120e4565b82519182526020820152f35b8763cd081bd160e01b5f5260045260245260445ffd5b879063ce6b173b60e01b5f5260045260245260445ffd5b8963785a3a3b60e11b5f5260045260245ffd5b88945061143c565b9092949c50600191939598505b019a929096939161139a565b509092949c50600191939598506115f4565b91939b600191939598506115f4565b999291509950611459565b636f5f608760e01b5f5260045ffd5b90506020813d60201161166d575b8161165660209383611871565b810103126102c35761166790611abc565b8a61137f565b3d9150611649565b8663b0eea50760e01b5f5260045260245ffd5b846337eab18360e11b5f5260045260245ffd5b8463b0eea50760e01b5f5260045260245ffd5b346102c3575f3660031901126102c3576020600454604051908152f35b346102c3575f3660031901126102c35760206040516103e88152f35b346102c3575f3660031901126102c3576020600954604051908152f35b5f3660031901126102c35734156103015761172134600354611813565b806003556040519034825260208201527f15873de5b5375786541a057377d4d2719c0a5f3769d1af962d2263e406cda57460403392a2005b9181601f840112156102c3578235916001600160401b0383116102c357602083818601950101116102c357565b9060028210156105295752565b60808091805184526117ad60208201516020860190611786565b604081015160408501526001600160401b03606082015116606085015201511515910152565b600435906001600160401b03821682036102c357565b35906001600160401b03821682036102c357565b600435906001600160a01b03821682036102c357565b9190820180921161050157565b60a081019081106001600160401b0382111761051557604052565b606081019081106001600160401b0382111761051557604052565b604081019081106001600160401b0382111761051557604052565b90601f801991011681019081106001600160401b0382111761051557604052565b6001600160401b03811161051557601f01601f191660200190565b6001600160401b0381116105155760051b60200190565b919060a0838203126102c3576118d9836117e9565b926118e6602082016117e9565b9260408201356001600160401b0381116102c357820183601f820112156102c357803561191281611892565b916119206040519384611871565b81835285602083830101116102c357815f92602080930183860137830101529260608301356001600160401b0381116102c35783016040818303126102c3576040519061196c82611856565b803582526020810135906001600160401b0382116102c3570182601f820112156102c357803561199b816118ad565b916119a96040519384611871565b81835260208084019260061b820101908582116102c357602001915b818310611a7d575050506020820152926080810135906001600160401b0382116102c35701906040828203126102c35760405191611a0283611856565b803583526020810135906001600160401b0382116102c357019080601f830112156102c3578135611a32816118ad565b92611a406040519485611871565b81845260208085019260051b8201019283116102c357602001905b828210611a6d57505050602082015290565b8135815260209182019101611a5b565b6040838703126102c35760405190611a9482611856565b8335825260208401359081151582036102c357826020928360409501528152019201916119c5565b519081151582036102c357565b92906020926001600160401b038092979697168552168284015260a0604084015280519182918260a08601520160c084015e5f60c08284010152601f801991011681019260c0828503016060830152602061012081610100870193805160c0890152015195604060e08201528651809452019401905f5b818110611b9757505050608081840391015260206060816040850193805186520151936040838201528451809452019201905f5b818110611b815750505090565b8251845260209384019390920191600101611b74565b82518051875260209081015115158188015260409096019590920191600101611b40565b805115611bc85760200190565b634e487b7160e01b5f52603260045260245ffd5b805160011015611bc85760400190565b805160021015611bc85760600190565b8051821015611bc85760209160051b010190565b9190820391821161050157565b60405190611c2a82611820565b5f6080838281528260208201528260408201528260608201520152565b60028210156105295752565b60405190611c6082611856565b60606020835f81520152565b3d15611c96573d90611c7d82611892565b91611c8b6040519384611871565b82523d5f602084013e565b606090565b8054821015611bc8575f5260205f2001905f90565b519060ff821682036102c357565b81601f820112156102c357805190611cd582611892565b92611ce36040519485611871565b828452602083830101116102c357815f9260208093018386015e8301015290565b51906001600160401b03821682036102c357565b51906001600160a01b03821682036102c357565b906040519160e083018381106001600160401b03821117610515576040525f835260208301925f845260408101935f8552606082015f815260808301915f835260a08401915f835260c0850193606085528598875188019760408160208b019a03126102c357611d9e60208201611cb0565b506040810151906001600160401b0382116102c357019780603f8a0112156102c3576020890151611dce816118ad565b99611ddc6040519b8c611871565b818b52602080808d019360051b83010101918383116102c35760408201905b8382106120b557505050505060038851106120a657611e1988611bbb565b5195865187019360e0888603126102c357611e3660208901611d04565b96611e4360408a01611d04565b94611e5060608b01611d18565b938a611e5e60808201611abc565b93611e6b60a08301611d18565b9260e060c08401519301516001600160401b0381116102c3576001600160401b039e8f9c611ea0926020809201920101611cbe565b9052526001600160a01b0390811690915290151590915216905216905216905280515f19810190811161050157611ed691611bfc565b5190815182019160208301906080818503126102c357611ef860208201611cb0565b93611f0560408301611d04565b5060608201516001600160401b0381116102c357820183603f820112156102c357602081015191611f35836118ad565b92611f436040519485611871565b8084526020808086019260051b85010101928684116102c35760408101915b848310611fad57505050505060808201516001600160401b0381116102c3576001936020611f949260ff950101611cbe565b50931603611f9e57565b63678747ed60e01b5f5260045ffd5b82516001600160401b0381116102c35782016020810191906060908603601f1901126102c35760405190611fe08261183b565b60208301516001600160a01b03811681036102c357825260408301516001600160401b0381116102c3576020908401018a601f820112156102c357805190612027826118ad565b916120356040519384611871565b80835260208084019160051b830101918d83116102c357602001905b8282106120965750505060208301526060830151916001600160401b0383116102c3576120868b602080969581960101611cbe565b6040820152815201920191611f62565b8151815260209182019101612051565b63d797fa2760e01b5f5260045ffd5b81516001600160401b0381116102c3576020916120d9878480809589010101611cbe565b815201910190611dfb565b9061213481028181046121341482151715610501577ff8ce2022830beb6ec696a46e42bce832af3c51a200a9b65f3e0c4113ecde21e59161271060a092049361212d8583611c10565b90600180851b031694855f52600e60205260405f209161214e828454611813565b83556001830161215f858254611813565b905542600284015561217382600954611813565b60095561218281600854611813565b928360085554916040519485526020850152604084015260608301526080820152a256fea2646970667358221220c89f0996a5cc4b4c62e2da9d0756066f02767c6e7104b2a99e501bba59680fe964736f6c634300081c0033" as const;
