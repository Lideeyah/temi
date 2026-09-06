/**
 * A minimal in-process EVM, so the Solidity can be executed rather than modelled.
 *
 * Mirroring contract arithmetic in JavaScript proves the JavaScript, not the contract. This
 * runs the actual compiled TemiVault bytecode through ethereumjs, which means the tests
 * exercise the real storage layout, the real reverts and the real value transfers.
 */
import fs from 'node:fs';
import path from 'node:path';
import { EVM } from '@ethereumjs/evm';
import { DefaultStateManager } from '@ethereumjs/statemanager';
import { Common, Chain, Hardfork } from '@ethereumjs/common';
import { Address, Account, hexToBytes, bytesToHex } from '@ethereumjs/util';
import { encodeFunctionData, decodeFunctionResult, decodeErrorResult } from 'viem';

export function artifact(name) {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'artifacts', `${name}.json`), 'utf8'),
  );
}

export const addr = (hex) => new Address(hexToBytes(hex));

export async function createChain() {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai });
  const stateManager = new DefaultStateManager();
  const evm = await EVM.create({ common, stateManager });

  const fund = async (who, wei) => {
    const account = (await stateManager.getAccount(addr(who))) ?? new Account();
    account.balance += wei;
    await stateManager.putAccount(addr(who), account);
  };

  const balanceOf = async (who) =>
    ((await stateManager.getAccount(addr(who))) ?? new Account()).balance;

  return {
    evm,
    stateManager,
    fund,
    balanceOf,

    async deploy(name, args = [], deployer, value = 0n) {
      const { abi, bytecode } = artifact(name);
      const ctor = abi.find((f) => f.type === 'constructor');
      let data = hexToBytes(bytecode);
      if (ctor?.inputs?.length) {
        const { encodeAbiParameters } = await import('viem');
        const encoded = encodeAbiParameters(ctor.inputs, args);
        data = new Uint8Array([...data, ...hexToBytes(encoded)]);
      }
      const result = await evm.runCall({
        caller: addr(deployer),
        origin: addr(deployer),
        data,
        value,
        gasLimit: 30_000_000n,
      });
      if (result.execResult.exceptionError) {
        throw new Error(`deploy ${name} failed: ${result.execResult.exceptionError.error}`);
      }
      return { address: bytesToHex(result.createdAddress.bytes), abi };
    },

    /** Call a function. Returns { ok, value, revert } — never throws on a revert. */
    async call(contract, functionName, args = [], { from, value = 0n } = {}) {
      const data = encodeFunctionData({ abi: contract.abi, functionName, args });
      const result = await evm.runCall({
        caller: addr(from),
        origin: addr(from),
        to: addr(contract.address),
        data: hexToBytes(data),
        value,
        gasLimit: 30_000_000n,
      });

      const returned = bytesToHex(result.execResult.returnValue);
      if (result.execResult.exceptionError) {
        let revert = result.execResult.exceptionError.error;
        try {
          const decoded = decodeErrorResult({ abi: contract.abi, data: returned });
          revert = decoded.errorName;
        } catch {
          /* not a typed error */
        }
        return { ok: false, revert, raw: returned };
      }

      let decoded;
      try {
        decoded = decodeFunctionResult({ abi: contract.abi, functionName, data: returned });
      } catch {
        decoded = returned;
      }
      return { ok: true, value: decoded, logs: result.execResult.logs ?? [] };
    },
  };
}
