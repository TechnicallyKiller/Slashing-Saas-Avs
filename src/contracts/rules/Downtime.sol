// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;
import {ValidatorUtils} from "../utils/ValidatorUtils.sol";
contract Downtime{
    ValidatorUtils public validatorUtils;
    uint256 public downtimeThreshold;

    constructor(address _utils, uint256 downtime){
        validatorUtils= ValidatorUtils(_utils);
        downtimeThreshold=downtime;
    }

    function slashIfViolated(address operator) external returns (bool) {
        uint256 lastSeen = validatorUtils.getLastSeenBlock(operator);
        if (block.number > lastSeen + downtimeThreshold && !validatorUtils.isSlashed1(operator)) {
            validatorUtils.markOperatorSlashed(operator);
            return true;
        }
        return false;
    }
    
}