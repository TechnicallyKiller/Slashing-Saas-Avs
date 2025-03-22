// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IDelegationManager} from "@eigen-layer/interfaces/IDelegationManager.sol";

contract OperatorRegistry {
    address public admin;
    address[] public operators;

    mapping(address => bool) public isRegistered;
    mapping(address => string) public metadataURIs;

    IDelegationManager public delegationManager;

    // Fixed delay for all operators
    uint32 public constant FIXED_ALLOCATION_DELAY = 50;

    event OperatorRegistered(address indexed operator, string metadataURI);

    constructor(address _delegationManager) {
        admin = msg.sender;
        delegationManager = IDelegationManager(_delegationManager);
    }

    function registerOperator(address initDelegationApprover, string calldata metadataURI) external {
        require(!isRegistered[msg.sender], "Already registered");

        // Call EigenLayer registration with fixed allocation delay
        delegationManager.registerAsOperator(initDelegationApprover, FIXED_ALLOCATION_DELAY, metadataURI);

        // Local tracking
        operators.push(msg.sender);
        isRegistered[msg.sender] = true;
        metadataURIs[msg.sender] = metadataURI;

        emit OperatorRegistered(msg.sender, metadataURI);
    }

    function getAllOperators() external view returns (address[] memory) {
        return operators;
    }

    function isOperator(address operator) external view returns (bool) {
        return isRegistered[operator];
    }

    function getOperatorMetadata(address operator) external view returns (string memory) {
        return metadataURIs[operator];
    }
}
