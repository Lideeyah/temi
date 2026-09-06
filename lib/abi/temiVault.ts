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
    "name": "InvalidPortal",
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

export const temiVaultBytecode = "0x608034608557601f61236038819003918201601f19168301916001600160401b03831184841017608957808492602094604052833981010312608557516001600160a01b03811680820360855760815750335b600780546001600160a01b0319166001600160a01b03929092169190911790556040516122c2908161009e8239f35b6052565b5f80fd5b634e487b7160e01b5f52604160045260245ffdfe60806040526004361015610011575f80fd5b5f3560e01c8063056044db146117da5780630e020252146117bd5780630f809247146117a15780631904b973146117845780631a4d3888146113785780631f4d6a031461135b57806324acd5bb146113225780632829281c146112e857806328d1db73146112cd57806329eb2cf4146112b05780632cc3ce801461120d5780632f764644146111de578063318f1a641461119f578063374beed814610f22578063380b9bc914610f055780634595bed614610ed657806359a8359814610ead57806361d027b314610e855780636213e98114610d2c57806372dd74c014610d115780637883383614610cf557806379cd176414610cd95780637b775ebc146109985780638480d57a1461097b5780638b0ad976146109495780638f840ddd1461092e57806391656fba14610911578063a435e937146108a3578063b44edecb14610888578063b816fc11146107a0578063c9a396e914610702578063d66bd524146106a6578063e1a452181461068a578063e1a72b4a1461066e578063e5d3925914610651578063e69282921461062b578063ee3da0551461057d578063f24335db14610310578063f251c381146102e4578063f776a0ad146102c75763ffd0984d146101dc575f80fd5b346102c35760203660031901126102c3576004356001601254146102b4576001601255335f52600e60205260405f20811580156102aa575b610293575f8083836102298396849654611ce6565b815561023782600954611ce6565b600955546040519082825260208201527f2cd8de105dd0197df9875e5090b06ecfe6c56304b8e12418dc87f5ea08d6b57260403392a2335af1610278611d57565b5015610284575f601255005b6312171d8360e31b5f5260045ffd5b5490630483a59360e51b5f5260045260245260445ffd5b5080548211610214565b63558a1e0360e11b5f5260045ffd5b5f80fd5b346102c3575f3660031901126102c3576020600d54604051908152f35b5f3660031901126102c3573415610301576102ff34336121ca565b005b6356316e8760e01b5f5260045ffd5b346102c35760803660031901126102c35760043560243560028110156102c357604435606435906001600160401b038216918281036102c3575f858152601060205260409020546001600160a01b031661056a57811561055b5760018414908180610553575b61054457811561053d575b60405161038d816118f6565b8681526020810161039e8782611d1d565b604082018581526001600160401b036060840194168452608083019260018452895f52600f60205260405f2090518155600181019251916002831015610529576001600160401b039360039360ff80198354169116179055516002820155019251166001600160401b031983541617825551151560ff60401b82549160401b169060ff60401b1916179055845f52601060205260405f2060018060a01b0333166bffffffffffffffffffffffff60a01b825416179055335f52601160205260405f208054680100000000000000008110156105155761048291600182018155611d42565b81549060031b9087821b915f19901b1916179055600c546001810180911161050157600c556104eb575b6104b9604051809461185c565b602083015260408201527f1142a6affc917ff7f4eea502d1d1f8f982eb3107dc5cbaebd6b4531d745c216260603392a3005b600d546001810180911161050157600d556104ac565b634e487b7160e01b5f52601160045260245ffd5b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52602160045260245ffd5b505f610381565b63cd345e3b60e01b5f5260045ffd5b508315610376565b63394a288960e11b5f5260045ffd5b84633d39a51b60e11b5f5260045260245ffd5b346102c35760203660031901126102c3576001600160a01b0361059e6118d3565b165f52600e60205260405f206008546103e881028181046103e81482151715610501576127109004600183015460038102908082046003149015171561050157600360209401548082115f14610623576105f791611ce6565b8082101561061b5750905b8082101561061457505b604051908152f35b905061060c565b905090610602565b50505f6105f7565b346102c3575f3660031901126102c35760206001600160401b0360065416604051908152f35b346102c3575f3660031901126102c3576020600354604051908152f35b346102c3575f3660031901126102c35760206040516121348152f35b346102c3575f3660031901126102c35760206040516127108152f35b346102c35760203660031901126102c3576001600160a01b036106c76118d3565b165f908152600e6020908152604091829020805460018201546002830154600390930154855192835293820152928301526060820152608090f35b346102c35760203660031901126102c35761071b6118d3565b5f606060405161072a81611911565b828152826020820152826040820152015260018060a01b03165f52600e602052608060405f2060405161075c81611911565b815491828252600181015460208301908152606060036002840154936040860194855201549301928352604051938452516020840152516040830152516060820152f35b346102c35760403660031901126102c3576107b96118a9565b6024356001600160a01b03811691908290036102c3576007546001600160a01b03163303610879576001600160401b031690815f525f60205260018060a01b0360405f2054166108665780156108575760207fe03727d120899f344de184df2af9378a5efa275abe949641225634ab0f25f79991835f525f825260405f20816bffffffffffffffffffffffff60a01b825416179055604051908152a2005b63032a203560e51b5f5260045ffd5b50639271091d60e01b5f5260045260245ffd5b63b90cdbb160e01b5f5260045ffd5b346102c3575f3660031901126102c357602060405160038152f35b346102c3575f3660031901126102c3576101206009546001600160401b03600854600a54600b54600454600554916003549360065495604051988952602089015260408801526060870152608086015260a085015260c084015281811660e084015260401c16610100820152f35b346102c3575f3660031901126102c3576020600c54604051908152f35b346102c3575f3660031901126102c357602047604051908152f35b346102c35760203660031901126102c3576004355f526010602052602060018060a01b0360405f205416604051908152f35b346102c3575f3660031901126102c3576020600b54604051908152f35b346102c35760c03660031901126102c3576004356024359060443591606435608435936001600160401b0385168095036102c35760a435946001601254146102b4576001601255845f52600f60205260405f20805415610cc6575f868152601060205260409020546001600160a01b03163303610cb357600381019687549160ff8360401c1615610ca05786158015610c93575b610c845760648510610c6c576103528610610c53576001015460ff16600281101561052957600103610c2c57506001600160401b031690818103610c175750505b335f52600e60205260405f20948554908185105f14610c105784905b610a938287611ce6565b92600854986103e88a028a81046103e8148b1517156105015761271090049160018201549a60038c029b808d046003149015171561050157600383019384549c8d8082115f14610c0757610ae691611ce6565b905b808911610bff575b50808811610bf7575b50808711610bef575b50610b0d86866118e9565b9a8b15610be057610b2a92610b23878994611ce6565b90556118e9565b9055610b3882600954611ce6565b600955610b4783600854611ce6565b600855600a546001810180911161050157600a55610b6788600b546118e9565b600b5560ff60401b19815416905560405194855260208501526040840152846060840152608083015260a08201527f32c067efd8d3985facc3f3795ff191139ab27e7c1c64b23a12312f1ea0123d6360c03392a35f80808084335af1610bcb611d57565b5015610284576020905f601255604051908152f35b631e1f16ef60e31b5f5260045ffd5b95508b610b02565b96508c610af9565b97508d610af0565b50505f90610ae8565b8190610a89565b634402954960e11b5f5260045260245260445ffd5b915050848103610c3c5750610a6d565b849063736af44560e11b5f5260045260245260445ffd5b85637fdb281960e01b5f5260045261035260245260445ffd5b84635fd3165360e11b5f52600452606460245260445ffd5b63843ce46b60e01b5f5260045ffd5b5060028101548711610a2c565b876371066ef160e01b5f5260045260245ffd5b85631461f53360e11b5f5260045260245ffd5b8563082cdf1f60e11b5f5260045260245ffd5b346102c3575f3660031901126102c3576020604051610fd28152f35b346102c3575f3660031901126102c35760206040516103528152f35b346102c3575f3660031901126102c357602060405160648152f35b346102c35760203660031901126102c3576001600160a01b03610d4d6118d3565b165f52601160205260405f208054610d6481611983565b91610d726040519384611947565b818352601f19610d8183611983565b015f5b818110610e6e5750505f5b828110610de657836040518091602082016020835281518091526020604084019201905f5b818110610dc2575050500390f35b91935091602060a082610dd86001948851611869565b019401910191849392610db4565b80610df360019284611d42565b90549060031b1c5f52600f60205260405f2060ff600360405192610e16846118f6565b80548452610e2c83878301541660208601611d1d565b6002810154604085015201546001600160401b038116606084015260401c1615156080820152610e5c8287611cd2565b52610e678186611cd2565b5001610d8f565b602090610e79611cf3565b82828801015201610d84565b346102c3575f3660031901126102c3576007546040516001600160a01b039091168152602090f35b346102c3575f3660031901126102c35760206001600160401b0360065460401c16604051908152f35b346102c35760203660031901126102c3576004355f526001602052602060ff60405f2054166040519015158152f35b346102c3575f3660031901126102c3576020600854604051908152f35b346102c35760203660031901126102c3576004356001600160401b0381116102c357610f55610f9f91369060040161182f565b91906020610f7a5f925f95610f68611d29565b50610f71611d29565b5081019061199a565b906040969493959296519788928392630f989c4b60e31b845289898860048701611b9f565b0381610fd25afa948515611194575f95611150575b506001600160401b03165f818152602081905260409020546001600160a01b0316959093909190610fe490611e02565b9690505f925b875184101561113957816001600160a01b03611006868b611cd2565b5151160361112e576003602061101c868b611cd2565b510151510361112e577f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f361105d6020611055878c611cd2565b510151611c91565b510361111e57506001600160a01b0391506110879050602061107f8489611cd2565b510151611cc2565b51169485156110ea575b60409161109d91611cd2565b51015191602083519381808201958692010103126102c35760a0946001600160401b039351905b6040519515158652600180881b0316602086015260408501526060840152166080820152f35b945060409061109d906001600160a01b03611112602061110a848b611cd2565b510151611cb2565b51169691509150611091565b9091926001905b01929190610fea565b909192600190611125565b91905060a096506001600160401b039492506110c4565b9094506020813d60201161118c575b8161116c60209383611947565b810103126102c3576111856001600160401b0391611b92565b9490610fb4565b3d915061115f565b6040513d5f823e3d90fd5b346102c35760203660031901126102c3576001600160401b036111c06118a9565b165f525f602052602060018060a01b0360405f205416604051908152f35b346102c35760203660031901126102c3576004355f526002602052602060ff60405f2054166040519015158152f35b346102c35760203660031901126102c357600435611229611cf3565b50805f52600f60205260405f2060ff600360405192611247846118f6565b8054845261125e8360018301541660208601611d1d565b6002810154604085015201546001600160401b038116606084015260401c161515608082015280511561129d5760a09061129b6040518092611869565bf35b5063082cdf1f60e11b5f5260045260245ffd5b346102c3575f3660031901126102c3576020600a54604051908152f35b346102c3575f3660031901126102c357602060405160018152f35b346102c3575f3660031901126102c35760206040517f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f38152f35b346102c3575f3660031901126102c357600c54600d54600454600554604080519485526020850193909352918301526060820152608090f35b346102c3575f3660031901126102c3576020600554604051908152f35b346102c35760603660031901126102c3576004356001600160401b0381116102c3576113a890369060040161182f565b9060243591604435905f92845f52600260205260ff60405f205416611771576113d39181019061199a565b969092936001600160401b03811692835f525f60205260018060a01b0360405f20541698891561175e578151602083012095865f52600160205260ff60405f20541661174b576040516302f4d16760e01b8152916020918391829161143f9190878d8a60048701611b9f565b03815f610fd25af1908115611194575f91611711575b50156117025761146790979397611e02565b5f989150889081805b82518c10156116f7576114838c84611cd2565b5180519098906001600160a01b03168e90036116e857602089019c8d5160038151036116d6576114d37f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f391611c91565b51036116bd5750505050505060018060a01b036114f08951611cb2565b5198519816976001600160a01b039061150890611cc2565b51169384156116b5575b60400151602081519181808201938492010103126102c357519660015b156116a25787810361168b57506003548088116116755750825f52600260205260405f20600160ff19825416179055845f52600160205260405f20600160ff1982541617905561158187600354611ce6565b6003556004549860018a01809a11610501577f5655105af0dd9d0e81ccf3b81987e9eed31e59bacb5da431fe95f386832bc08a60a089976001600160401b036116699a60409e6004556115d68b6005546118e9565b6005551695866fffffffffffffffff00000000000000006006549260401b16916fffffffffffffffffffffffffffffffff19161717600655600180831b0388169b8c948e519289845260208401528e830152600180841b03166060820152886080820152a47fb6b5d830d9ee7e772866b65acf8e51ea4a2ff1c6e602d092d0bf366bf3e9b27160208851858152a26121ca565b82519182526020820152f35b8763cd081bd160e01b5f5260045260245260445ffd5b879063ce6b173b60e01b5f5260045260245260445ffd5b8963785a3a3b60e11b5f5260045260245ffd5b889450611512565b9092949c50600191939598505b019a9290969391611470565b509092949c50600191939598506116ca565b91939b600191939598506116ca565b99929150995061152f565b636f5f608760e01b5f5260045ffd5b90506020813d602011611743575b8161172c60209383611947565b810103126102c35761173d90611b92565b8a611455565b3d915061171f565b8663b0eea50760e01b5f5260045260245ffd5b846337eab18360e11b5f5260045260245ffd5b8463b0eea50760e01b5f5260045260245ffd5b346102c3575f3660031901126102c3576020600454604051908152f35b346102c3575f3660031901126102c35760206040516103e88152f35b346102c3575f3660031901126102c3576020600954604051908152f35b5f3660031901126102c3573415610301576117f7346003546118e9565b806003556040519034825260208201527f15873de5b5375786541a057377d4d2719c0a5f3769d1af962d2263e406cda57460403392a2005b9181601f840112156102c3578235916001600160401b0383116102c357602083818601950101116102c357565b9060028210156105295752565b60808091805184526118836020820151602086019061185c565b604081015160408501526001600160401b03606082015116606085015201511515910152565b600435906001600160401b03821682036102c357565b35906001600160401b03821682036102c357565b600435906001600160a01b03821682036102c357565b9190820180921161050157565b60a081019081106001600160401b0382111761051557604052565b608081019081106001600160401b0382111761051557604052565b604081019081106001600160401b0382111761051557604052565b90601f801991011681019081106001600160401b0382111761051557604052565b6001600160401b03811161051557601f01601f191660200190565b6001600160401b0381116105155760051b60200190565b919060a0838203126102c3576119af836118bf565b926119bc602082016118bf565b9260408201356001600160401b0381116102c357820183601f820112156102c35780356119e881611968565b916119f66040519384611947565b81835285602083830101116102c357815f92602080930183860137830101529260608301356001600160401b0381116102c35783016040818303126102c35760405190611a428261192c565b803582526020810135906001600160401b0382116102c3570182601f820112156102c3578035611a7181611983565b91611a7f6040519384611947565b81835260208084019260061b820101908582116102c357602001915b818310611b53575050506020820152926080810135906001600160401b0382116102c35701906040828203126102c35760405191611ad88361192c565b803583526020810135906001600160401b0382116102c357019080601f830112156102c3578135611b0881611983565b92611b166040519485611947565b81845260208085019260051b8201019283116102c357602001905b828210611b4357505050602082015290565b8135815260209182019101611b31565b6040838703126102c35760405190611b6a8261192c565b8335825260208401359081151582036102c35782602092836040950152815201920191611a9b565b519081151582036102c357565b92906020926001600160401b038092979697168552168284015260a0604084015280519182918260a08601520160c084015e5f60c08284010152601f801991011681019260c0828503016060830152602061012081610100870193805160c0890152015195604060e08201528651809452019401905f5b818110611c6d57505050608081840391015260206060816040850193805186520151936040838201528451809452019201905f5b818110611c575750505090565b8251845260209384019390920191600101611c4a565b82518051875260209081015115158188015260409096019590920191600101611c16565b805115611c9e5760200190565b634e487b7160e01b5f52603260045260245ffd5b805160011015611c9e5760400190565b805160021015611c9e5760600190565b8051821015611c9e5760209160051b010190565b9190820391821161050157565b60405190611d00826118f6565b5f6080838281528260208201528260408201528260608201520152565b60028210156105295752565b60405190611d368261192c565b60606020835f81520152565b8054821015611c9e575f5260205f2001905f90565b3d15611d81573d90611d6882611968565b91611d766040519384611947565b82523d5f602084013e565b606090565b519060ff821682036102c357565b81601f820112156102c357805190611dab82611968565b92611db96040519485611947565b828452602083830101116102c357815f9260208093018386015e8301015290565b51906001600160401b03821682036102c357565b51906001600160a01b03821682036102c357565b906040519160e083018381106001600160401b03821117610515576040525f835260208301925f845260408101935f8552606082015f815260808301915f835260a08401915f835260c0850193606085528598875188019760408160208b019a03126102c357611e7460208201611d86565b506040810151906001600160401b0382116102c357019780603f8a0112156102c3576020890151611ea481611983565b99611eb26040519b8c611947565b818b52602080808d019360051b83010101918383116102c35760408201905b83821061219b575050505050600388511061218c57611eef88611c91565b5195865187019360e0888603126102c357611f0c60208901611dda565b96611f1960408a01611dda565b94611f2660608b01611dee565b938a611f3460808201611b92565b93611f4160a08301611dee565b9260e060c08401519301516001600160401b0381116102c3576001600160401b039e8f9c611f76926020809201920101611d94565b9052526001600160a01b0390811690915290151590915216905216905216905280515f19810190811161050157611fac91611cd2565b5190815182019160208301906080818503126102c357611fce60208201611d86565b93611fdb60408301611dda565b5060608201516001600160401b0381116102c357820183603f820112156102c35760208101519161200b83611983565b926120196040519485611947565b8084526020808086019260051b85010101928684116102c35760408101915b84831061208357505050505060808201516001600160401b0381116102c357600193602061206a9260ff950101611d94565b5093160361207457565b63678747ed60e01b5f5260045ffd5b82516001600160401b0381116102c35782016020810191906060908603601f1901126102c35760405190606082018281106001600160401b038211176105155760405260208301516001600160a01b03811681036102c357825260408301516001600160401b0381116102c3576020908401018a601f820112156102c35780519061210d82611983565b9161211b6040519384611947565b80835260208084019160051b830101918d83116102c357602001905b82821061217c5750505060208301526060830151916001600160401b0383116102c35761216c8b602080969581960101611d94565b6040820152815201920191612038565b8151815260209182019101612137565b63d797fa2760e01b5f5260045ffd5b81516001600160401b0381116102c3576020916121bf878480809589010101611d94565b815201910190611ed1565b9061213481028181046121341482151715610501577ff8ce2022830beb6ec696a46e42bce832af3c51a200a9b65f3e0c4113ecde21e59161271060a09204936122138583611ce6565b90600180851b031694855f52600e60205260405f20916122348284546118e9565b8355600183016122458582546118e9565b9055426002840155612259826009546118e9565b600955612268816008546118e9565b928360085554916040519485526020850152604084015260608301526080820152a256fea26469706673582212200feceffcc262e453774afd329829fff1dc97e1f89797dc1f23cf4c34a2b7e1a064736f6c634300081c0033" as const;
