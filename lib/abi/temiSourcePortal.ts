// Generated from contracts/TemiSourcePortal.sol by scripts/gen-abi.mjs — do not edit by hand.
export const temiSourcePortalAbi = [
  {
    "inputs": [],
    "name": "ZeroAmount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "depositor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "vaultTarget",
        "type": "bytes32"
      }
    ],
    "name": "ReserveFunded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "vaultTarget",
        "type": "bytes32"
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
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "fundReserveFor",
    "outputs": [],
    "stateMutability": "payable",
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
    "name": "fundedForVault",
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

export const temiSourcePortalBytecode = "0x60808060405234601557610257908161001a8239f35b5f80fdfe60806040526004361015610083575b3615610018575f80fd5b341561007457335f525f60205260405f20610034348254610200565b905561004234600254610200565b6002555f6040513481527f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f360203392a3005b631f2a200560e01b5f5260045ffd5b5f3560e01c806315a94709146101c75780635b7c74231461018c578063ad044f491461016f578063c3485f81146100ec5763cbe55b250361000e57346100e85760203660031901126100e8576004355f526001602052602060405f2054604051908152f35b5f80fd5b60203660031901126100e857600435341561007457335f525f60205260405f20610117348254610200565b9055805f52600160205260405f20610130348254610200565b905561013e34600254610200565b6002556040513481527f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f360203392a3005b346100e8575f3660031901126100e8576020600254604051908152f35b346100e85760203660031901126100e8576004356001600160a01b038116908190036100e8575f525f602052602060405f2054604051908152f35b60203660031901126100e8576004356001600160a01b038116908190036100e857341561007457335f525f60205260405f206101173482545b9190820180921161020d57565b634e487b7160e01b5f52601160045260245ffdfea2646970667358221220e7c6a9a1a6afcc4234deb7e8be299c482aefa10f0644e88187fe01f654a756ab64736f6c634300081c0033" as const;
