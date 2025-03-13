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

    modifier onlyBot() {
        require(msg.sender == authorizedBot, "Not authorized bot");
        _;
    }

    function reportHealth(address operator, uint256 blockNumber) external onlyBot {
        validatorUtils.updateLastSeenBlock(operator, blockNumber);
        emit HealthReported(operator, blockNumber);
    }
}
