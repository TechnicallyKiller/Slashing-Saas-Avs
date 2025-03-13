// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import {SlashingTriggerManager} from "../SlashingTriggerManager.sol";


contract ValidatorUtils {
    mapping (address => uint256) lastSeenBlock;
    mapping (address => bool) isSlashed;

    function updateLastSeenBlock(address operator, uint256 blockNumber) public {
        lastSeenBlock[operator]= blockNumber;
    }
    function getLastSeenBlock(address operator) public returns (uint256 block){
        return lastSeenBlock[operator];
    }
    function markOperatorSlashed(address operator) public {
        isSlashed[operator]=true;
    }

}