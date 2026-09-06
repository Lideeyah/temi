// Generated from contracts/TemiSourcePortal.sol by scripts/gen-abi.mjs — do not edit by hand.
export const temiSourcePortalAbi = [
  {
    "inputs": [],
    "name": "ZeroAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ZeroBeneficiary",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
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
    "name": "CrossChainReserveDeposit",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "targetAssetId",
        "type": "uint256"
      }
    ],
    "name": "fundReserve",
    "outputs": [],
    "stateMutability": "payable",
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
    "name": "lifetimeFunded",
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
    "name": "totalFunded",
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
    "stateMutability": "payable",
    "type": "receive"
  }
] as const;

export const temiSourcePortalBytecode = "0x60808060405234601557610204908161001a8239f35b5f80fdfe60806040526004361015610088575b3615610018575f80fd5b341561007957335f525f60205260405f206100343482546101ad565b9055610042346001546101ad565b6001556040513481525f60208201527fbc00dca9cf6d3088211c0f743c5881c4eb8b0ed60a97463caafca0f7c8c4a9cc60403392a2005b631f2a200560e01b5f5260045ffd5b5f3560e01c80632f517f2e146101055780635b7c7423146100ce5763ad044f490361000e57346100ca575f3660031901126100ca576020600154604051908152f35b5f80fd5b346100ca5760203660031901126100ca576001600160a01b036100ef610197565b165f525f602052602060405f2054604051908152f35b60403660031901126100ca57610119610197565b3415610079576001600160a01b0316801561018857805f525f60205260405f206101443482546101ad565b9055610152346001546101ad565b6001557fbc00dca9cf6d3088211c0f743c5881c4eb8b0ed60a97463caafca0f7c8c4a9cc604080513481526024356020820152a2005b63776cceeb60e01b5f5260045ffd5b600435906001600160a01b03821682036100ca57565b919082018092116101ba57565b634e487b7160e01b5f52601160045260245ffdfea26469706673582212203cf05a37d0a6e29f560005a4866dba9c092f99c18f4bf4471a0911b2c96a3fba64736f6c634300081c0033" as const;
