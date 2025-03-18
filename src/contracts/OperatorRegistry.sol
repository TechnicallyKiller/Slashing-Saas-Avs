// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OperatorRegistry {
    address public admin;
    address[] public operators;
    mapping(address => bool) public isRegistered;

    event OperatorRegistered(address indexed operator);

    constructor() {
        admin = msg.sender;
    }

    function registerOperator(address operaotr) external {
        require(!isRegistered[operaotr], "Already registered");
        operators.push(operaotr);
        isRegistered[operaotr] = true;
        emit OperatorRegistered(operaotr);
    }

    function getAllOperators() external view returns (address[] memory) {
        return operators;
    }

    function totalOperators() external view returns (uint256) {
        return operators.length;
    }
    function isOperator(address operator) external view returns(bool){
        return isRegistered[operator];
    }
}
