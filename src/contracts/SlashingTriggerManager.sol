// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./utils/ValidatorUtils.sol";
import "./rules/Downtime.sol";
import "./rules/DoubleSigning.sol";
import "./OperatorRegistry.sol";
import "@eigen-layer/interfaces/IPausable.sol";
import "@eigen-layer/interfaces/IDelegationManager.sol";
import "@eigen-layer/interfaces/IPermissionController.sol";
import "@eigen-layer/interfaces/IStrategyManager.sol";

contract SlashingTriggerManager {
    event OperatorSlashed(address indexed operator, string reason, uint256 blockNumber);
    event AVSMetadata(address indexed operator, uint256 delegatedShares, address delegator);
    event AVSPaused();
    event AVSResumed();

    ValidatorUtils public validatorUtils;
    Downtime public downtime;
    DoubleSign public doubleSign;
    OperatorRegistry public operatorRegistry;
    IDelegationManager public delegationManager;
    IStrategyManager public strategyManager;

    address public AVSAdmin;
    bool public isPaused;
    uint256 public minStrategyShareThreshold;
 

    modifier onlyAVSAdmin() {
        require(msg.sender == AVSAdmin, "Not AVS admin");
        _;
    }

    modifier notPaused() {
        require(!isPaused, "AVS is paused");
        _;
    }

    constructor(
        address _validatorUtils,
        address _downtime,
        address _doubleSign,
        address _operatorRegistry,
        address _delegationManager,
        address _strategyManager,
        uint256 _minStrategyShareThreshold
    ) {
        validatorUtils = ValidatorUtils(_validatorUtils);
        downtime = Downtime(_downtime);
        doubleSign = DoubleSign(_doubleSign);
        operatorRegistry = OperatorRegistry(_operatorRegistry);
        delegationManager = IDelegationManager(_delegationManager);
        strategyManager = IStrategyManager(_strategyManager);
        AVSAdmin = msg.sender;
        
        minStrategyShareThreshold = _minStrategyShareThreshold;
    }

    function pauseAVS() external onlyAVSAdmin {
        isPaused = true;
        emit AVSPaused();
    }

    function resumeAVS() external onlyAVSAdmin {
        isPaused = false;
        emit AVSResumed();
    }

    function triggerSlashing(address operator, bytes32 messageHash1, bytes memory signature1, bytes32 messageHash2, bytes memory signature2) external onlyAVSAdmin notPaused {
        require(operatorRegistry.isRegistered(operator), "Operator not registered");

        address delegator = delegationManager.delegatedTo(operator);
        require(delegator != address(0), "Operator not delegated");

    

        bool isDown = downtime.isDowntimeDetected(operator);
        bool isDoubleSign = doubleSign.isDoubleSignDetected(operator, messageHash1, signature1, messageHash2, signature2);

        require(isDown || isDoubleSign, "No slashing condition met");
        require(!validatorUtils.isSlashed(operator), "Already slashed");

        validatorUtils.markOperatorSlashed(operator);

        emit OperatorSlashed(operator, isDown ? "Downtime" : "Double Sign", block.number);
        
}
}