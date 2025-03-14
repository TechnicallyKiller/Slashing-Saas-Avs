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

    function isDowntimeDetected(address operator) public  returns(bool){
        uint256 lastSeen = validatorUtils.getLastSeenBlock(operator);
        uint256 currentBlock = block.number;
        return (currentBlock-lastSeen>downtimeThreshold);

    }
    
}