// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title EvmTxDecoder
/// @notice Decodes the USC v1 `txBytes` payload that the Creditcoin proof builder attests to.
/// @dev    The Attestcoin proof builder encodes a source-chain transaction *and its receipt* as
///         `abi.encode(uint8 txType, bytes[] chunks)`. The chunk layout varies by EIP-2718
///         transaction type, but two positions are invariant across types 0-4:
///
///           chunks[0]              -> common transaction fields
///           chunks[chunks.length-1] -> receipt fields (status, gasUsed, logs, logsBloom)
///
///         Everything between them is type-specific (gas pricing, access lists, signatures) and
///         is irrelevant to us: the precompile has already proven the whole payload is authentic,
///         so we only need to read the sender, the callee, the value and the emitted logs.
///         Decoding only the invariant chunks keeps this library type-agnostic — a legacy tx and
///         an EIP-7702 tx are read by exactly the same code path.
///
///         Layout mirrors the Gluwa USC SDK v0.18.0 `encoding/abi/v1.ts::abiEncode`.
library EvmTxDecoder {
    /// @notice A single receipt log, matching the SDK's `tuple(address, bytes32[], bytes)`.
    struct EvmLog {
        address emitter;
        bytes32[] topics;
        bytes data;
    }

    /// @notice The invariant transaction fields shared by every EIP-2718 type.
    struct CommonTx {
        uint64 nonce;
        uint64 gasLimit;
        address from;
        bool toIsNull;
        address to;
        uint256 value;
        bytes data;
    }

    error MalformedTxPayload();
    error SourceTransactionReverted();

    /// @notice Decode the attested payload into its sender/callee fields and its receipt logs.
    /// @param txBytes The `encodedTransaction` blob that was passed to the 0x0FD2 precompile.
    /// @return common  Invariant transaction fields (from, to, value, calldata).
    /// @return logs    Every log emitted by the source transaction.
    function decode(bytes memory txBytes)
        internal
        pure
        returns (CommonTx memory common, EvmLog[] memory logs)
    {
        (, bytes[] memory chunks) = abi.decode(txBytes, (uint8, bytes[]));
        // Types 0-2 produce 3 chunks, types 3-4 produce 4. Anything below 3 is malformed.
        if (chunks.length < 3) revert MalformedTxPayload();

        (
            common.nonce,
            common.gasLimit,
            common.from,
            common.toIsNull,
            common.to,
            common.value,
            common.data
        ) = abi.decode(chunks[0], (uint64, uint64, address, bool, address, uint256, bytes));

        uint8 status;
        (status, , logs, ) = abi.decode(
            chunks[chunks.length - 1],
            (uint8, uint64, EvmLog[], bytes)
        );

        // A reverted source transaction is provable but must never fund a reserve.
        if (status != 1) revert SourceTransactionReverted();
    }

    /// @notice Read the transaction type without decoding the rest of the payload.
    function txType(bytes memory txBytes) internal pure returns (uint8 t) {
        (t, ) = abi.decode(txBytes, (uint8, bytes[]));
    }
}
