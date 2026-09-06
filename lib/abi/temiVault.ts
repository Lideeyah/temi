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
        "internalType": "address",
        "name": "expectedPortal",
        "type": "address"
      }
    ],
    "name": "DepositLogNotFound",
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
        "name": "externalTxHash",
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
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "targetAssetId",
        "type": "uint256"
      }
    ],
    "name": "CrossChainReserveVerified",
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
    "name": "CROSS_CHAIN_DEPOSIT_TOPIC",
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
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "consumedExternalTxHash",
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
    "inputs": [
      {
        "internalType": "bytes",
        "name": "proofData",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "externalTxHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "depositViaAttestcoin",
    "outputs": [
      {
        "internalType": "address",
        "name": "beneficiary",
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
        "name": "proofData",
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
        "name": "beneficiary",
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

export const temiVaultBytecode = "0x608034608557601f6120fd38819003918201601f19168301916001600160401b03831184841017608957808492602094604052833981010312608557516001600160a01b03811680820360855760815750335b600780546001600160a01b0319166001600160a01b039290921691909117905560405161205f908161009e8239f35b6052565b5f80fd5b634e487b7160e01b5f52604160045260245ffdfe60806040526004361015610011575f80fd5b5f3560e01c8063056044db146115815780630e020252146115645780630f809247146115485780631904b9731461152b5780631f4d6a031461150e57806329eb2cf4146114f15780632cc3ce801461144e578063318f1a641461140f578063374beed8146111df57806337be8fe0146111b0578063380b9bc9146111935780634595bed6146111645780634652c2c814610e7257806359a8359814610e4957806361d027b314610e215780636213e98114610cc857806372dd74c014610cad5780637883383614610c9157806379cd176414610c755780638480d57a14610c585780638b0ad97614610c265780638f840ddd14610c0b578063a435e93714610b9d578063b44edecb14610b82578063b816fc1114610ada578063bcfdbaff1461071f578063c9a396e91461069a578063d66bd5241461064b578063e1a452181461062f578063e1a72b4a14610613578063e5d39259146105f6578063e6928292146105d0578063e9498a3614610596578063ee3da055146104f2578063f24335db146102c7578063f251c3811461029b5763ffd0984d146101b0575f80fd5b3461029757602036600319011261029757600435600160105414610288576001601055335f52600c60205260405f208115801561027e575b610267575f8083836101fd8396849654611ae2565b815561020b82600954611ae2565b600955546040519082825260208201527f2cd8de105dd0197df9875e5090b06ecfe6c56304b8e12418dc87f5ea08d6b57260403392a2335af161024c611aef565b5015610258575f601055005b6312171d8360e31b5f5260045ffd5b5490630483a59360e51b5f5260045260245260445ffd5b50805482116101e8565b63558a1e0360e11b5f5260045ffd5b5f80fd5b5f3660031901126102975734156102b8576102b63433611f67565b005b6356316e8760e01b5f5260045ffd5b3461029757608036600319011261029757600435602435600281101561029757604435606435906001600160401b03821691828103610297575f858152600e60205260409020546001600160a01b03166104df5781156104d0576001841480806104c8575b6104b957156104b2575b6040516103428161169d565b858152602081016103538682611739565b604082018481526001600160401b036060840194168452608083019260018452885f52600d60205260405f209051815560018101925191600283101561049e576001600160401b039360039360ff80198354169116179055516002820155019251166001600160401b031983541617825551151560ff60401b82549160401b169060ff60401b1916179055835f52600e60205260405f2060018060a01b0333166bffffffffffffffffffffffff60a01b825416179055335f52600f60205260405f2080546801000000000000000081101561048a5761043791600182018155611b1e565b81549060031b9086821b915f19901b191617905561045860405180946115d6565b602083015260408201527f1142a6affc917ff7f4eea502d1d1f8f982eb3107dc5cbaebd6b4531d745c216260603392a3005b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52602160045260245ffd5b505f610336565b63cd345e3b60e01b5f5260045ffd5b50831561032c565b63394a288960e11b5f5260045ffd5b84633d39a51b60e11b5f5260045260245ffd5b346102975760203660031901126102975761050b61167a565b6008546103e881028181046103e814821517156105825761271090049160018060a01b03165f52600c602052600160405f20015491600383029280840460031490151715610582576020928082101561057a5750905b8082101561057357505b604051908152f35b905061056b565b905090610561565b634e487b7160e01b5f52601160045260245ffd5b34610297575f3660031901126102975760206040517fbc00dca9cf6d3088211c0f743c5881c4eb8b0ed60a97463caafca0f7c8c4a9cc8152f35b34610297575f3660031901126102975760206001600160401b0360065416604051908152f35b34610297575f366003190112610297576020600354604051908152f35b34610297575f3660031901126102975760206040516121348152f35b34610297575f3660031901126102975760206040516127108152f35b34610297576020366003190112610297576001600160a01b0361066c61167a565b165f52600c602052606060405f20805490600260018201549101549060405192835260208301526040820152f35b34610297576020366003190112610297576106b361167a565b5f604080516106c1816116b8565b828152826020820152015260018060a01b03165f52600c602052606060405f206040516106ed816116b8565b815491828252604060026001830154926020850193845201549201918252604051928352516020830152516040820152f35b34610297576060366003190112610297576004356001600160401b0381116102975761074f90369060040161164d565b60243591610764604435915f93810190611790565b9296939095916001600160401b03821690815f525f60205260018060a01b0360405f205416978815610ac7578151602083012095865f52600160205260ff60405f205416610ab457875f52600260205260ff60405f205416610aa157828b6107e460209360405195869485946302f4d16760e01b86528b60048701611995565b03815f610fd25af1908115610a96575f91610a5c575b5015610a4d5761080990611baf565b5f9150819081805b8251851015610a41576108248584611ab8565b5180519098906001600160a01b03168d9003610a3357602089019586516002815103610a22576108747fbc00dca9cf6d3088211c0f743c5881c4eb8b0ed60a97463caafca0f7c8c4a9cc91611a87565b5103610a0a57505093516108af9450604093506001600160a01b03925061089b9150611aa8565b511694015160208082518301019101611acc565b94909660015b156109f7578781036109e057506003548088116109ca5750805f52600160205260405f20600160ff19825416179055855f52600260205260405f20600160ff1982541617905561090787600354611ae2565b600355600454600181018091116105825760a06109be9789976001600160401b0360409d7f2bdcbcffebaa328004629925e9f6d17a0f340fbc8b0fc616e48407909c36b2259560045561095c8b600554611690565b6005551696876fffffffffffffffff00000000000000006006549260401b16916fffffffffffffffffffffffffffffffff19161717600655600180841b0388169b8c958e5193845260208401528d8301528860608301526080820152a4611f67565b82519182526020820152f35b8763cd081bd160e01b5f5260045260245260445ffd5b879063ce6b173b60e01b5f5260045260245260445ffd5b8863617f0d7560e01b5f5260045260245ffd5b90929498506001919395505b01939196929096610811565b509092949850600191939550610a16565b919397509193600190610a16565b979350989190506108b5565b636f5f608760e01b5f5260045ffd5b90506020813d602011610a8e575b81610a77602093836116ee565b8101031261029757610a8890611988565b8a6107fa565b3d9150610a6a565b6040513d5f823e3d90fd5b8763b0eea50760e01b5f5260045260245ffd5b8663b0eea50760e01b5f5260045260245ffd5b826337eab18360e11b5f5260045260245ffd5b3461029757604036600319011261029757610af3611623565b6024356001600160a01b0381169190829003610297576007546001600160a01b03163303610b735760206001600160401b037fe03727d120899f344de184df2af9378a5efa275abe949641225634ab0f25f799921692835f525f825260405f20816bffffffffffffffffffffffff60a01b825416179055604051908152a2005b63b90cdbb160e01b5f5260045ffd5b34610297575f36600319011261029757602060405160038152f35b34610297575f366003190112610297576101206009546001600160401b03600854600a54600b54600454600554916003549360065495604051988952602089015260408801526060870152608086015260a085015260c084015281811660e084015260401c16610100820152f35b34610297575f36600319011261029757602047604051908152f35b34610297576020366003190112610297576004355f52600e602052602060018060a01b0360405f205416604051908152f35b34610297575f366003190112610297576020600b54604051908152f35b34610297575f366003190112610297576020604051610fd28152f35b34610297575f3660031901126102975760206040516103528152f35b34610297575f36600319011261029757602060405160648152f35b34610297576020366003190112610297576001600160a01b03610ce961167a565b165f52600f60205260405f208054610d0081611779565b91610d0e60405193846116ee565b818352601f19610d1d83611779565b015f5b818110610e0a5750505f5b828110610d8257836040518091602082016020835281518091526020604084019201905f5b818110610d5e575050500390f35b91935091602060a082610d7460019488516115e3565b019401910191849392610d50565b80610d8f60019284611b1e565b90549060031b1c5f52600d60205260405f2060ff600360405192610db28461169d565b80548452610dc883878301541660208601611739565b6002810154604085015201546001600160401b038116606084015260401c1615156080820152610df88287611ab8565b52610e038186611ab8565b5001610d2b565b602090610e1561170f565b82828801015201610d20565b34610297575f366003190112610297576007546040516001600160a01b039091168152602090f35b34610297575f3660031901126102975760206001600160401b0360065460401c16604051908152f35b346102975760a0366003190112610297576004356024359060443591606435608435936001600160401b03851680950361029757600160105414610288576001601055835f52600d60205260405f20805415611151575f858152600e60205260409020546001600160a01b0316330361113e57600381019586549160ff8360401c161561112b578515801561111e575b61110f57606484106110f75761035285106110de576001015460ff16600281101561049e57600114806110cb575b6110ab575050335f52600c60205260405f208054958685105f146110a45784905b610f5b8287611ae2565b926008546103e881028181046103e814821517156105825761271090046001830154906003820291808304600314901517156105825780871161109c575b50808611611094575b5080851161108c575b50610fb68484611690565b98891561107d5783610fc791611ae2565b9055610fd582600954611ae2565b600955610fe483600854611ae2565b600855600a546001810180911161058257600a5561100488600b54611690565b600b5560ff60401b19815416905560405194855260208501526040840152846060840152608083015260a08201527f32c067efd8d3985facc3f3795ff191139ab27e7c1c64b23a12312f1ea0123d6360c03392a35f80808084335af1611068611aef565b5015610258576020905f601055604051908152f35b631e1f16ef60e31b5f5260045ffd5b935089610fab565b94508a610fa2565b95508b610f99565b8690610f51565b6001600160401b039250634402954960e11b5f526004521660245260445ffd5b506001600160401b038216811415610f30565b84637fdb281960e01b5f5260045261035260245260445ffd5b83635fd3165360e11b5f52600452606460245260445ffd5b63843ce46b60e01b5f5260045ffd5b5060028101548611610f02565b866371066ef160e01b5f5260045260245ffd5b84631461f53360e11b5f5260045260245ffd5b8463082cdf1f60e11b5f5260045260245ffd5b34610297576020366003190112610297576004355f526001602052602060ff60405f2054166040519015158152f35b34610297575f366003190112610297576020600854604051908152f35b34610297576020366003190112610297576004355f526002602052602060ff60405f2054166040519015158152f35b34610297576020366003190112610297576004356001600160401b0381116102975761121261125e91369060040161164d565b5f9291839160209161123891611226611745565b5061122f611745565b50810190611790565b604051630f989c4b60e31b815297939692959294938892839290888a8860048701611995565b0381610fd25afa948515610a96575f956113cb575b506001600160401b0390959291951691825f525f6020526112a060018060a01b0360405f20541692611baf565b9290505f965b83518810156113b357816001600160a01b036112c28a87611ab8565b515116036113a857600260206112d88a87611ab8565b51015151036113a8577fbc00dca9cf6d3088211c0f743c5881c4eb8b0ed60a97463caafca0f7c8c4a9cc61131960206113118b88611ab8565b510151611a87565b510361139857505050906001600160401b03929161136f604061135d60a0986001808b1b03611355602061134d8489611ab8565b510151611aa8565b511694611ab8565b51015160208082518301019101611acc565b50905b6040519515158652600180881b0316602086015260408501526060840152166080820152f35b9091966001905b019691906112a6565b90919660019061139f565b91905060a096506001600160401b0394939250611372565b9094506020813d602011611407575b816113e7602093836116ee565b81010312610297576114006001600160401b0391611988565b9490611273565b3d91506113da565b34610297576020366003190112610297576001600160401b03611430611623565b165f525f602052602060018060a01b0360405f205416604051908152f35b346102975760203660031901126102975760043561146a61170f565b50805f52600d60205260405f2060ff6003604051926114888461169d565b8054845261149f8360018301541660208601611739565b6002810154604085015201546001600160401b038116606084015260401c16151560808201528051156114de5760a0906114dc60405180926115e3565bf35b5063082cdf1f60e11b5f5260045260245ffd5b34610297575f366003190112610297576020600a54604051908152f35b34610297575f366003190112610297576020600554604051908152f35b34610297575f366003190112610297576020600454604051908152f35b34610297575f3660031901126102975760206040516103e88152f35b34610297575f366003190112610297576020600954604051908152f35b5f3660031901126102975734156102b85761159e34600354611690565b806003556040519034825260208201527f15873de5b5375786541a057377d4d2719c0a5f3769d1af962d2263e406cda57460403392a2005b90600282101561049e5752565b60808091805184526115fd602082015160208601906115d6565b604081015160408501526001600160401b03606082015116606085015201511515910152565b600435906001600160401b038216820361029757565b35906001600160401b038216820361029757565b9181601f84011215610297578235916001600160401b038311610297576020838186019501011161029757565b600435906001600160a01b038216820361029757565b9190820180921161058257565b60a081019081106001600160401b0382111761048a57604052565b606081019081106001600160401b0382111761048a57604052565b604081019081106001600160401b0382111761048a57604052565b90601f801991011681019081106001600160401b0382111761048a57604052565b6040519061171c8261169d565b5f6080838281528260208201528260408201528260608201520152565b600282101561049e5752565b60405190611752826116d3565b60606020835f81520152565b6001600160401b03811161048a57601f01601f191660200190565b6001600160401b03811161048a5760051b60200190565b919060a083820312610297576117a583611639565b926117b260208201611639565b9260408201356001600160401b03811161029757820183601f820112156102975780356117de8161175e565b916117ec60405193846116ee565b818352856020838301011161029757815f92602080930183860137830101529260608301356001600160401b0381116102975783016040818303126102975760405190611838826116d3565b803582526020810135906001600160401b038211610297570182601f8201121561029757803561186781611779565b9161187560405193846116ee565b81835260208084019260061b8201019085821161029757602001915b818310611949575050506020820152926080810135906001600160401b03821161029757019060408282031261029757604051916118ce836116d3565b803583526020810135906001600160401b03821161029757019080601f830112156102975781356118fe81611779565b9261190c60405194856116ee565b81845260208085019260051b82010192831161029757602001905b82821061193957505050602082015290565b8135815260209182019101611927565b6040838703126102975760405190611960826116d3565b8335825260208401359081151582036102975782602092836040950152815201920191611891565b5190811515820361029757565b92906020926001600160401b038092979697168552168284015260a0604084015280519182918260a08601520160c084015e5f60c08284010152601f801991011681019260c0828503016060830152602061012081610100870193805160c0890152015195604060e08201528651809452019401905f5b818110611a6357505050608081840391015260206060816040850193805186520151936040838201528451809452019201905f5b818110611a4d5750505090565b8251845260209384019390920191600101611a40565b82518051875260209081015115158188015260409096019590920191600101611a0c565b805115611a945760200190565b634e487b7160e01b5f52603260045260245ffd5b805160011015611a945760400190565b8051821015611a945760209160051b010190565b9190826040910312610297576020825192015190565b9190820391821161058257565b3d15611b19573d90611b008261175e565b91611b0e60405193846116ee565b82523d5f602084013e565b606090565b8054821015611a94575f5260205f2001905f90565b519060ff8216820361029757565b81601f8201121561029757805190611b588261175e565b92611b6660405194856116ee565b8284526020838301011161029757815f9260208093018386015e8301015290565b51906001600160401b038216820361029757565b51906001600160a01b038216820361029757565b906040519160e083018381106001600160401b0382111761048a576040525f835260208301925f845260408101935f8552606082015f815260808301915f835260a08401915f835260c0850193606085528598875188019760408160208b019a031261029757611c2160208201611b33565b506040810151906001600160401b03821161029757019780603f8a011215610297576020890151611c5181611779565b99611c5f6040519b8c6116ee565b818b52602080808d019360051b83010101918383116102975760408201905b838210611f385750505050506003885110611f2957611c9c88611a87565b5195865187019360e08886031261029757611cb960208901611b87565b96611cc660408a01611b87565b94611cd360608b01611b9b565b938a611ce160808201611988565b93611cee60a08301611b9b565b9260e060c08401519301516001600160401b038111610297576001600160401b039e8f9c611d23926020809201920101611b41565b9052526001600160a01b0390811690915290151590915216905216905216905280515f19810190811161058257611d5991611ab8565b51908151820191602083019060808185031261029757611d7b60208201611b33565b93611d8860408301611b87565b5060608201516001600160401b03811161029757820183603f8201121561029757602081015191611db883611779565b92611dc660405194856116ee565b8084526020808086019260051b85010101928684116102975760408101915b848310611e3057505050505060808201516001600160401b038111610297576001936020611e179260ff950101611b41565b50931603611e2157565b63678747ed60e01b5f5260045ffd5b82516001600160401b0381116102975782016020810191906060908603601f1901126102975760405190611e63826116b8565b60208301516001600160a01b038116810361029757825260408301516001600160401b038111610297576020908401018a601f8201121561029757805190611eaa82611779565b91611eb860405193846116ee565b80835260208084019160051b830101918d831161029757602001905b828210611f195750505060208301526060830151916001600160401b03831161029757611f098b602080969581960101611b41565b6040820152815201920191611de5565b8151815260209182019101611ed4565b63d797fa2760e01b5f5260045ffd5b81516001600160401b03811161029757602091611f5c878480809589010101611b41565b815201910190611c7e565b9061213481028181046121341482151715610582577ff8ce2022830beb6ec696a46e42bce832af3c51a200a9b65f3e0c4113ecde21e59161271060a0920493611fb08583611ae2565b90600180851b031694855f52600c60205260405f2091611fd1828454611690565b835560018301611fe2858254611690565b9055426002840155611ff682600954611690565b60095561200581600854611690565b928360085554916040519485526020850152604084015260608301526080820152a256fea264697066735822122027a9808a4872545c38997044b8bd8f5ba3d980bb679abc04dba5fc4cb8a8da9864736f6c634300081c0033" as const;
