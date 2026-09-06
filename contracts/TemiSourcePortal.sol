// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title TemiSourcePortal
/// @notice The external-chain intake point for Tèmi reserve capital.
/// @dev    Deployed on Ethereum Sepolia (Attestcoin chainKey 1). Diaspora remitters, SME grant
///         programmes and institutional liquidity backers fund a Nigerian operator's reserve here.
///         The emitted `CrossChainReserveDeposit` log is the *only* thing that matters downstream:
///         the Creditcoin Attestcoin precompile proves the log's inclusion, and TemiVault credits
///         the operator's dual reserve from it. There is no bridge, no relayer trust, and no
///         mint authority — this contract cannot talk to Creditcoin at all.
contract TemiSourcePortal {
    /// @notice Emitted on every funded deposit. This is the event TemiVault proves and consumes.
    /// @param user          The Creditcoin operator address whose reserve is being funded.
    /// @param amount        Value deposited, in wei of the source chain's native asset.
    /// @param targetAssetId Optional earmark for a specific registered asset (0 = general reserve).
    event CrossChainReserveDeposit(address indexed user, uint256 amount, uint256 targetAssetId);

    /// @notice Total value ever routed through this portal, per beneficiary.
    mapping(address => uint256) public lifetimeFunded;
    uint256 public totalFunded;

    error ZeroAmount();
    error ZeroBeneficiary();

    /// @notice Fund a Creditcoin operator's Tèmi reserve from this chain.
    /// @param beneficiary   The operator's Creditcoin address (they claim the credit on cc3).
    /// @param targetAssetId Optional asset earmark, or 0 for the general reserve.
    function fundReserve(address beneficiary, uint256 targetAssetId) external payable {
        if (msg.value == 0) revert ZeroAmount();
        if (beneficiary == address(0)) revert ZeroBeneficiary();

        lifetimeFunded[beneficiary] += msg.value;
        totalFunded += msg.value;

        emit CrossChainReserveDeposit(beneficiary, msg.value, targetAssetId);
    }

    /// @notice Convenience path: fund your own address's reserve, general pool.
    receive() external payable {
        if (msg.value == 0) revert ZeroAmount();
        lifetimeFunded[msg.sender] += msg.value;
        totalFunded += msg.value;
        emit CrossChainReserveDeposit(msg.sender, msg.value, 0);
    }
}
