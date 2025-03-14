// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import {Ownable} from "../../../lib/openzeppelin-contracts-v4.9.0/contracts/access/Ownable.sol";

interface IValidatorUtils {
    function updateLastSeenBlock(address operator, uint256 blockNumber) external;
}

contract NodeHealthReporter is Ownable {
    event HealthReported(address operator, uint256 blockNo);

    address public authorizedBot;
    IValidatorUtils public validatorUtils;

    constructor(address _validatorUtils, address _authorizedBot) {
        validatorUtils = IValidatorUtils(_validatorUtils);
        authorizedBot = _authorizedBot;
    }

    

    function reportHealth(address operator, uint256 blockNumber) external {
        validatorUtils.updateLastSeenBlock(operator, blockNumber);
        emit HealthReported(operator, blockNumber);
    }

 
    function setAuthorizedBot(address _bot) external onlyOwner {
        authorizedBot = _bot;
    }
}
