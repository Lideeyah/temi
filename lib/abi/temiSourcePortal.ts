// Generated from contracts/TemiSourcePortal.sol by scripts/gen-abi.mjs — do not edit by hand.
export const temiSourcePortalAbi = [
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
    "inputs": [],
    "name": "NotTreasury",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SweepFailed",
    "type": "error"
  },
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Swept",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "sweep",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "stateMutability": "payable",
    "type": "receive"
  }
] as const;

export const temiSourcePortalBytecode = "0x608034608457601f61042938819003918201601f19168301916001600160401b03831184841017608857808492602094604052833981010312608457516001600160a01b03811680820360845760805750335b5f80546001600160a01b0319166001600160a01b039290921691909117905560405161038c908161009d8239f35b6052565b5f80fd5b634e487b7160e01b5f52604160045260245ffdfe60806040526004361015610084575b3615610018575f80fd5b341561007557335f52600160205260405f20610035348254610335565b905561004334600354610335565b6003555f6040513481527f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f360203392a3005b631f2a200560e01b5f5260045ffd5b5f3560e01c806315a94709146102fb5780635b7c7423146102bf57806361d027b314610298578063aa60e733146101a4578063ad044f4914610187578063c3485f81146101035763cbe55b250361000e57346100ff5760203660031901126100ff576004355f526002602052602060405f2054604051908152f35b5f80fd5b60203660031901126100ff57600435341561007557335f52600160205260405f2061012f348254610335565b9055805f52600260205260405f20610148348254610335565b905561015634600354610335565b6003556040513481527f2708f71b476b0f4e2f443494db167a27d6a46973d4e387e0b08c7c751b0144f360203392a3005b346100ff575f3660031901126100ff576020600354604051908152f35b346100ff5760203660031901126100ff575f546001600160a01b031660043533829003610289575f808093819380158314610283575047905b807fc36b5179cb9c303b200074996eab2b3473eac370fdd7eba3bec636fe351096966020604051858152a25af13d1561027e573d67ffffffffffffffff811161026a5760405190601f8101601f19908116603f0116820167ffffffffffffffff81118382101761026a5760405281525f60203d92013e5b1561025b57005b6313dd85ff60e31b5f5260045ffd5b634e487b7160e01b5f52604160045260245ffd5b610254565b906101dd565b63b90cdbb160e01b5f5260045ffd5b346100ff575f3660031901126100ff575f546040516001600160a01b039091168152602090f35b346100ff5760203660031901126100ff576004356001600160a01b038116908190036100ff575f526001602052602060405f2054604051908152f35b60203660031901126100ff576004356001600160a01b038116908190036100ff57341561007557335f52600160205260405f2061012f3482545b9190820180921161034257565b634e487b7160e01b5f52601160045260245ffdfea2646970667358221220166b78bf86054fe5ad6c041b6cd7e2bc77c47a37908de6d4f2d104cd6dc75e6664736f6c634300081c0033" as const;
