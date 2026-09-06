// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title TemiSourcePortal
/// @notice External-chain intake point for Tèmi reserve capital.
///
/// @dev    Deployed on Ethereum Sepolia — Attestcoin chain key 1, one of the two source chains
///         the cc3-testnet attestor set covers (the other being Ethereum Mainnet, key 3).
///
///         Diaspora remitters, SME grant programmes and institutional liquidity backers fund a
///         Nigerian operator's reserve here. The emitted `ReserveFunded` log is the only thing
///         that matters downstream: Creditcoin attestors watch this chain, reach quorum, and
///         post an attestation; `TemiVault` then proves this log's inclusion through the
///         Attestcoin verify precompile and credits the operator's dual reserve.
///
///         This contract cannot talk to Creditcoin, and nothing on Creditcoin can write back
///         here. The Attestcoin hackathon scope is readability only — the cross-chain direction
///         is strictly Sepolia-event -> Creditcoin-read.
contract TemiSourcePortal {
    /// @notice Emitted on every funded deposit. This is the event TemiVault proves and consumes.
    /// @param depositor   Whoever supplied the capital on this chain.
    /// @param amount      Value deposited, in wei of the source chain's native asset.
    /// @param vaultTarget The Creditcoin operator whose reserve is credited, as a left-padded
    ///                    address. Zero means "credit the depositor's own address".
    event ReserveFunded(address indexed depositor, uint256 amount, bytes32 indexed vaultTarget);

    mapping(address => uint256) public lifetimeFunded;
    mapping(bytes32 => uint256) public fundedForVault;
    uint256 public totalFunded;

    error ZeroAmount();

    /// @notice Fund a Creditcoin operator's Tèmi reserve from Ethereum Sepolia.
    /// @param vaultTarget The operator's Creditcoin address as bytes32, or 0 to fund your own.
    function fundReserve(bytes32 vaultTarget) external payable {
        if (msg.value == 0) revert ZeroAmount();

        lifetimeFunded[msg.sender] += msg.value;
        fundedForVault[vaultTarget] += msg.value;
        totalFunded += msg.value;

        emit ReserveFunded(msg.sender, msg.value, vaultTarget);
    }

    /// @notice Helper so a backer can pass a plain address instead of packing it themselves.
    function fundReserveFor(address operator) external payable {
        if (msg.value == 0) revert ZeroAmount();

        bytes32 vaultTarget = bytes32(uint256(uint160(operator)));
        lifetimeFunded[msg.sender] += msg.value;
        fundedForVault[vaultTarget] += msg.value;
        totalFunded += msg.value;

        emit ReserveFunded(msg.sender, msg.value, vaultTarget);
    }

    /// @notice Bare transfers fund the sender's own reserve.
    receive() external payable {
        if (msg.value == 0) revert ZeroAmount();
        lifetimeFunded[msg.sender] += msg.value;
        totalFunded += msg.value;
        emit ReserveFunded(msg.sender, msg.value, bytes32(0));
    }
}
