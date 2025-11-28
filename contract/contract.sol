// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Simple Ledger
/// @notice A very basic ledger that tracks how much ETH each address has deposited.
contract SimpleLedger {
    // Mapping from address to its balance in the ledger
    mapping(address => uint256) private balances;

    // Events (optional, but useful for tracking on-chain)
    event Deposited(address indexed from, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);
    event Transferred(address indexed from, address indexed to, uint256 amount);

    /// @notice Deposit ETH into the ledger.
    /// @dev msg.value is the amount of ETH sent with the transaction.
    function deposit() external payable {
        require(msg.value > 0, "Must send some ETH");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice Withdraw ETH from your ledger balance.
    /// @param amount The amount (in wei) to withdraw.
    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(balances[msg.sender] >= amount, "Not enough balance");

        // Effects
        balances[msg.sender] -= amount;

        // Interaction
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");

        emit Withdrawn(msg.sender, amount);
    }

    /// @notice Transfer balance inside the ledger to another address.
    /// @dev This does NOT send real ETH, only moves balances in the mapping.
    /// @param to The recipient address.
    /// @param amount The amount (in wei) to move in the ledger.
    function transferInLedger(address to, uint256 amount) external {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be > 0");
        require(balances[msg.sender] >= amount, "Not enough balance");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transferred(msg.sender, to, amount);
    }

    /// @notice View the ledger balance of any address.
    /// @param account The address to check.
    /// @return The balance (in wei) stored in the ledger.
    function getBalance(address account) external view returns (uint256) {
        return balances[account];
    }
}
