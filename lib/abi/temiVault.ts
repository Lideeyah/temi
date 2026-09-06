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

export const temiVaultBytecode = "0x608034608557601f61230638819003918201601f19168301916001600160401b03831184841017608957808492602094604052833981010312608557516001600160a01b03811680820360855760815750335b600780546001600160a01b0319166001600160a01b0392909216919091179055604051612268908161009e8239f35b6052565b5f80fd5b634e487b7160e01b5f52604160045260245ffdfe60806040526004361015610011575f80fd5b5f3560e01c8063056044db146117805780630e020252146117635780630f809247146117475780631904b9731461172a5780631a4d38881461131e5780631f4d6a031461130157806324acd5bb146112c85780632829281c1461128e57806328d1db731461127357806329eb2cf4146112565780632cc3ce80146111b35780632f76464414611184578063318f1a6414611145578063374beed814610ec8578063380b9bc914610eab5780634595bed614610e7c5780634652c2c814610b5557806359a8359814610b2c57806361d027b314610b045780636213e981146109ab57806372dd74c014610990578063788338361461097457806379cd1764146109585780638480d57a1461093b5780638b0ad976146109095780638f840ddd146108ee57806391656fba146108d1578063a435e93714610863578063b44edecb14610848578063b816fc11146107a0578063c9a396e914610702578063d66bd524146106a6578063e1a452181461068a578063e1a72b4a1461066e578063e5d3925914610651578063e69282921461062b578063ee3da0551461057d578063f24335db14610310578063f251c381146102e4578063f776a0ad146102c75763ffd0984d146101dc575f80fd5b346102c35760203660031901126102c3576004356001601254146102b4576001601255335f52600e60205260405f20811580156102aa575b610293575f8083836102298396849654611c8c565b815561023782600954611c8c565b600955546040519082825260208201527f2cd8de105dd0197df9875e5090b06ecfe6c56304b8e12418dc87f5ea08d6b57260403392a2335af1610278611ce8565b5015610284575f601255005b6312171d8360e31b5f5260045ffd5b5490630483a59360e51b5f5260045260245260445ffd5b5080548211610214565b63558a1e0360e11b5f5260045ffd5b5f80fd5b346102c3575f3660031901126102c3576020600d54604051908152f35b5f3660031901126102c3573415610301576102ff3433612170565b005b6356316e8760e01b5f5260045ffd5b346102c35760803660031901126102c35760043560243560028110156102c357604435606435906001600160401b038216918281036102c3575f858152601060205260409020546001600160a01b031661056a57811561055b5760018414908180610553575b61054457811561053d575b60405161038d8161189c565b8681526020810161039e8782611cc3565b604082018581526001600160401b036060840194168452608083019260018452895f52600f60205260405f2090518155600181019251916002831015610529576001600160401b039360039360ff80198354169116179055516002820155019251166001600160401b031983541617825551151560ff60401b82549160401b169060ff60401b1916179055845f52601060205260405f2060018060a01b0333166bffffffffffffffffffffffff60a01b825416179055335f52601160205260405f208054680100000000000000008110156105155761048291600182018155611d17565b81549060031b9087821b915f19901b1916179055600c546001810180911161050157600c556104eb575b6104b96040518094611802565b602083015260408201527f1142a6affc917ff7f4eea502d1d1f8f982eb3107dc5cbaebd6b4531d745c216260603392a3005b600d546001810180911161050157600d556104ac565b634e487b7160e01b5f52601160045260245ffd5b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52602160045260245ffd5b505f610381565b63cd345e3b60e01b5f5260045ffd5b508315610376565b63394a288960e11b5f5260045ffd5b84633d39a51b60e11b5f5260045260245ffd5b346102c35760203660031901126102c3576001600160a01b0361059e611879565b165f52600e60205260405f206008546103e881028181046103e81482151715610501576127109004600183015460038102908082046003149015171561050157600360209401548082115f14610623576105f791611c8c565b8082101561061b5750905b8082101561061457505b604051908152f35b905061060c565b905090610602565b50505f6105f7565b346102c3575f3660031901126102c35760206001600160401b0360065416604051908152f35b346102c3575f3660031901126102c3576020600354604051908152f35b346102c3575f3660031901126102c35760206040516121348152f35b346102c3575f3660031901126102c35760206040516127108152f35b346102c35760203660031901126102c3576001600160a01b036106c7611879565b165f908152600e6020908152604091829020805460018201546002830154600390930154855192835293820152928301526060820152608090f35b346102c35760203660031901126102c35761071b611879565b5f606060405161072a816118b7565b828152826020820152826040820152015260018060a01b03165f52600e602052608060405f2060405161075c816118b7565b815491828252600181015460208301908152606060036002840154936040860194855201549301928352604051938452516020840152516040830152516060820152f35b346102c35760403660031901126102c3576107b961184f565b6024356001600160a01b03811691908290036102c3576007546001600160a01b031633036108395760206001600160401b037fe03727d120899f344de184df2af9378a5efa275abe949641225634ab0f25f799921692835f525f825260405f20816bffffffffffffffffffffffff60a01b825416179055604051908152a2005b63b90cdbb160e01b5f5260045ffd5b346102c3575f3660031901126102c357602060405160038152f35b346102c3575f3660031901126102c3576101206009546001600160401b03600854600a54600b54600454600554916003549360065495604051988952602089015260408801526060870152608086015260a085015260c084015281811660e084015260401c16610100820152f35b346102c3575f3660031901126102c3576020600c54604051908152f35b346102c3575f3660031901126102c357602047604051908152f35b346102c35760203660031901126102c3576004355f526010602052602060018060a01b0360405f205416604051908152f35b346102c3575f3660031901126102c3576020600b54604051908152f35b346102c3575f3660031901126102c3576020604051610fd28152f35b346102c3575f3660031901126102c35760206040516103528152f35b346102c3575f3660031901126102c357602060405160648152f35b346102c35760203660031901126102c3576001600160a01b036109cc611879565b165f52601160205260405f2080546109e381611929565b916109f160405193846118ed565b818352601f19610a0083611929565b015f5b818110610aed5750505f5b828110610a6557836040518091602082016020835281518091526020604084019201905f5b818110610a41575050500390f35b91935091602060a082610a57600194885161180f565b019401910191849392610a33565b80610a7260019284611d17565b90549060031b1c5f52600f60205260405f2060ff600360405192610a958461189c565b80548452610aab83878301541660208601611cc3565b6002810154604085015201546001600160401b038116606084015260401c1615156080820152610adb8287611c78565b52610ae68186611c78565b5001610a0e565b602090610af8611c99565b82828801015201610a03565b346102c3575f3660031901126102c3576007546040516001600160a01b039091168152602090f35b346102c3575f3660031901126102c35760206001600160401b0360065460401c16604051908152f35b346102c35760a03660031901126102c3576004356024359060443591606435608435936001600160401b0385168095036102c3576001601254146102b4576001601255835f52600f60205260405f20805415610e69575f858152601060205260409020546001600160a01b03163303610e5657600381019586549160ff8360401c1615610e435785158015610e36575b610e275760648410610e0f576103528510610df6576001015460ff1660028110156105295760011480610de3575b610dc3575050335f52600e60205260405f20948554908185105f14610dbc5784905b610c3f8287611c8c565b92600854986103e88a028a81046103e8148b1517156105015761271090049160018201549a60038c029b808d046003149015171561050157600383019384549c8d8082115f14610db357610c9291611c8c565b905b808911610dab575b50808811610da3575b50808711610d9b575b50610cb9868661188f565b9a8b15610d8c57610cd692610ccf878994611c8c565b905561188f565b9055610ce482600954611c8c565b600955610cf383600854611c8c565b600855600a546001810180911161050157600a55610d1388600b5461188f565b600b5560ff60401b19815416905560405194855260208501526040840152846060840152608083015260a08201527f32c067efd8d3985facc3f3795ff191139ab27e7c1c64b23a12312f1ea0123d6360c03392a35f80808084335af1610d77611ce8565b5015610284576020905f601255604051908152f35b631e1f16ef60e31b5f5260045ffd5b95508b610cae565b96508c610ca5565b97508d610c9c565b50505f90610c94565b8190610c35565b6001600160401b039250634402954960e11b5f526004521660245260445ffd5b506001600160401b038216811415610c13565b84637fdb281960e01b5f5260045261035260245260445ffd5b83635fd3165360e11b5f52600452606460245260445ffd5b63843ce46b60e01b5f5260045ffd5b5060028101548611610be5565b866371066ef160e01b5f5260045260245ffd5b84631461f53360e11b5f5260045260245ffd5b8463082cdf1f60e11b5f5260045260245ffd5b346102c35760203660031901126102c3576004355f526001602052602060ff60405f2054166040519015158152f35b346102c3575f3660031901126102c3576020600854604051908152f35b346102c35760203660031901126102c3576004356001600160401b0381116102c357610efb610f459136906004016117d5565b91906020610f205f925f95610f0e611ccf565b50610f17611ccf565b50810190611940565b906040969493959296519788928392630f989c4b60e31b845289898860048701611b45565b0381610fd25afa94851561113a575f956110f6575b506001600160401b03165f818152602081905260409020546001600160a01b0316959093909190610f8a90611da8565b9690505f925b87518410156110df57816001600160a01b03610fac868b611c78565b515116036110d45760036020610fc2868b611c78565b51015151036110d4577f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f36110036020610ffb878c611c78565b510151611c37565b51036110c457506001600160a01b03915061102d905060206110258489611c78565b510151611c68565b5116948515611090575b60409161104391611c78565b51015191602083519381808201958692010103126102c35760a0946001600160401b039351905b6040519515158652600180881b0316602086015260408501526060840152166080820152f35b9450604090611043906001600160a01b036110b860206110b0848b611c78565b510151611c58565b51169691509150611037565b9091926001905b01929190610f90565b9091926001906110cb565b91905060a096506001600160401b0394925061106a565b9094506020813d602011611132575b81611112602093836118ed565b810103126102c35761112b6001600160401b0391611b38565b9490610f5a565b3d9150611105565b6040513d5f823e3d90fd5b346102c35760203660031901126102c3576001600160401b0361116661184f565b165f525f602052602060018060a01b0360405f205416604051908152f35b346102c35760203660031901126102c3576004355f526002602052602060ff60405f2054166040519015158152f35b346102c35760203660031901126102c3576004356111cf611c99565b50805f52600f60205260405f2060ff6003604051926111ed8461189c565b805484526112048360018301541660208601611cc3565b6002810154604085015201546001600160401b038116606084015260401c16151560808201528051156112435760a090611241604051809261180f565bf35b5063082cdf1f60e11b5f5260045260245ffd5b346102c3575f3660031901126102c3576020600a54604051908152f35b346102c3575f3660031901126102c357602060405160018152f35b346102c3575f3660031901126102c35760206040517f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f38152f35b346102c3575f3660031901126102c357600c54600d54600454600554604080519485526020850193909352918301526060820152608090f35b346102c3575f3660031901126102c3576020600554604051908152f35b346102c35760603660031901126102c3576004356001600160401b0381116102c35761134e9036906004016117d5565b9060243591604435905f92845f52600260205260ff60405f2054166117175761137991810190611940565b969092936001600160401b03811692835f525f60205260018060a01b0360405f205416988915611704578151602083012095865f52600160205260ff60405f2054166116f1576040516302f4d16760e01b815291602091839182916113e59190878d8a60048701611b45565b03815f610fd25af190811561113a575f916116b7575b50156116a85761140d90979397611da8565b5f989150889081805b82518c101561169d576114298c84611c78565b5180519098906001600160a01b03168e900361168e57602089019c8d51600381510361167c576114797f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f391611c37565b51036116635750505050505060018060a01b036114968951611c58565b5198519816976001600160a01b03906114ae90611c68565b511693841561165b575b60400151602081519181808201938492010103126102c357519660015b1561164857878103611631575060035480881161161b5750825f52600260205260405f20600160ff19825416179055845f52600160205260405f20600160ff1982541617905561152787600354611c8c565b6003556004549860018a01809a11610501577f5655105af0dd9d0e81ccf3b81987e9eed31e59bacb5da431fe95f386832bc08a60a089976001600160401b0361160f9a60409e60045561157c8b60055461188f565b6005551695866fffffffffffffffff00000000000000006006549260401b16916fffffffffffffffffffffffffffffffff19161717600655600180831b0388169b8c948e519289845260208401528e830152600180841b03166060820152886080820152a47fb6b5d830d9ee7e772866b65acf8e51ea4a2ff1c6e602d092d0bf366bf3e9b27160208851858152a2612170565b82519182526020820152f35b8763cd081bd160e01b5f5260045260245260445ffd5b879063ce6b173b60e01b5f5260045260245260445ffd5b8963785a3a3b60e11b5f5260045260245ffd5b8894506114b8565b9092949c50600191939598505b019a9290969391611416565b509092949c5060019193959850611670565b91939b60019193959850611670565b9992915099506114d5565b636f5f608760e01b5f5260045ffd5b90506020813d6020116116e9575b816116d2602093836118ed565b810103126102c3576116e390611b38565b8a6113fb565b3d91506116c5565b8663b0eea50760e01b5f5260045260245ffd5b846337eab18360e11b5f5260045260245ffd5b8463b0eea50760e01b5f5260045260245ffd5b346102c3575f3660031901126102c3576020600454604051908152f35b346102c3575f3660031901126102c35760206040516103e88152f35b346102c3575f3660031901126102c3576020600954604051908152f35b5f3660031901126102c35734156103015761179d3460035461188f565b806003556040519034825260208201527f15873de5b5375786541a057377d4d2719c0a5f3769d1af962d2263e406cda57460403392a2005b9181601f840112156102c3578235916001600160401b0383116102c357602083818601950101116102c357565b9060028210156105295752565b608080918051845261182960208201516020860190611802565b604081015160408501526001600160401b03606082015116606085015201511515910152565b600435906001600160401b03821682036102c357565b35906001600160401b03821682036102c357565b600435906001600160a01b03821682036102c357565b9190820180921161050157565b60a081019081106001600160401b0382111761051557604052565b608081019081106001600160401b0382111761051557604052565b604081019081106001600160401b0382111761051557604052565b90601f801991011681019081106001600160401b0382111761051557604052565b6001600160401b03811161051557601f01601f191660200190565b6001600160401b0381116105155760051b60200190565b919060a0838203126102c35761195583611865565b9261196260208201611865565b9260408201356001600160401b0381116102c357820183601f820112156102c357803561198e8161190e565b9161199c60405193846118ed565b81835285602083830101116102c357815f92602080930183860137830101529260608301356001600160401b0381116102c35783016040818303126102c357604051906119e8826118d2565b803582526020810135906001600160401b0382116102c3570182601f820112156102c3578035611a1781611929565b91611a2560405193846118ed565b81835260208084019260061b820101908582116102c357602001915b818310611af9575050506020820152926080810135906001600160401b0382116102c35701906040828203126102c35760405191611a7e836118d2565b803583526020810135906001600160401b0382116102c357019080601f830112156102c3578135611aae81611929565b92611abc60405194856118ed565b81845260208085019260051b8201019283116102c357602001905b828210611ae957505050602082015290565b8135815260209182019101611ad7565b6040838703126102c35760405190611b10826118d2565b8335825260208401359081151582036102c35782602092836040950152815201920191611a41565b519081151582036102c357565b92906020926001600160401b038092979697168552168284015260a0604084015280519182918260a08601520160c084015e5f60c08284010152601f801991011681019260c0828503016060830152602061012081610100870193805160c0890152015195604060e08201528651809452019401905f5b818110611c1357505050608081840391015260206060816040850193805186520151936040838201528451809452019201905f5b818110611bfd5750505090565b8251845260209384019390920191600101611bf0565b82518051875260209081015115158188015260409096019590920191600101611bbc565b805115611c445760200190565b634e487b7160e01b5f52603260045260245ffd5b805160011015611c445760400190565b805160021015611c445760600190565b8051821015611c445760209160051b010190565b9190820391821161050157565b60405190611ca68261189c565b5f6080838281528260208201528260408201528260608201520152565b60028210156105295752565b60405190611cdc826118d2565b60606020835f81520152565b3d15611d12573d90611cf98261190e565b91611d0760405193846118ed565b82523d5f602084013e565b606090565b8054821015611c44575f5260205f2001905f90565b519060ff821682036102c357565b81601f820112156102c357805190611d518261190e565b92611d5f60405194856118ed565b828452602083830101116102c357815f9260208093018386015e8301015290565b51906001600160401b03821682036102c357565b51906001600160a01b03821682036102c357565b906040519160e083018381106001600160401b03821117610515576040525f835260208301925f845260408101935f8552606082015f815260808301915f835260a08401915f835260c0850193606085528598875188019760408160208b019a03126102c357611e1a60208201611d2c565b506040810151906001600160401b0382116102c357019780603f8a0112156102c3576020890151611e4a81611929565b99611e586040519b8c6118ed565b818b52602080808d019360051b83010101918383116102c35760408201905b838210612141575050505050600388511061213257611e9588611c37565b5195865187019360e0888603126102c357611eb260208901611d80565b96611ebf60408a01611d80565b94611ecc60608b01611d94565b938a611eda60808201611b38565b93611ee760a08301611d94565b9260e060c08401519301516001600160401b0381116102c3576001600160401b039e8f9c611f1c926020809201920101611d3a565b9052526001600160a01b0390811690915290151590915216905216905216905280515f19810190811161050157611f5291611c78565b5190815182019160208301906080818503126102c357611f7460208201611d2c565b93611f8160408301611d80565b5060608201516001600160401b0381116102c357820183603f820112156102c357602081015191611fb183611929565b92611fbf60405194856118ed565b8084526020808086019260051b85010101928684116102c35760408101915b84831061202957505050505060808201516001600160401b0381116102c35760019360206120109260ff950101611d3a565b5093160361201a57565b63678747ed60e01b5f5260045ffd5b82516001600160401b0381116102c35782016020810191906060908603601f1901126102c35760405190606082018281106001600160401b038211176105155760405260208301516001600160a01b03811681036102c357825260408301516001600160401b0381116102c3576020908401018a601f820112156102c3578051906120b382611929565b916120c160405193846118ed565b80835260208084019160051b830101918d83116102c357602001905b8282106121225750505060208301526060830151916001600160401b0383116102c3576121128b602080969581960101611d3a565b6040820152815201920191611fde565b81518152602091820191016120dd565b63d797fa2760e01b5f5260045ffd5b81516001600160401b0381116102c357602091612165878480809589010101611d3a565b815201910190611e77565b9061213481028181046121341482151715610501577ff8ce2022830beb6ec696a46e42bce832af3c51a200a9b65f3e0c4113ecde21e59161271060a09204936121b98583611c8c565b90600180851b031694855f52600e60205260405f20916121da82845461188f565b8355600183016121eb85825461188f565b90554260028401556121ff8260095461188f565b60095561220e8160085461188f565b928360085554916040519485526020850152604084015260608301526080820152a256fea26469706673582212201585ec4556b990cbd84ccbab0c3fcce655d77f0e35ba42c000bb244258205e6564736f6c634300081c0033" as const;
