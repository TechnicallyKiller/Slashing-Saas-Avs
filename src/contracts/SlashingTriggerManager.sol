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
import "@eigen-layer/interfaces/IStrategy.sol";
import "@eigen-layer/interfaces/IAllocationManager.sol";

contract SlashingTriggerManager {
    // Events
    event SlashTriggered(address indexed operator, string reason);
    event SlashingEvaluated(address indexed operator, bool result, string rule);
    event AVSMetadata(address indexed operator, uint256 delegatedShares, address delegator);
    event AVSPaused();
    event AVSResumed();

    // Core dependencies
    ValidatorUtils public validatorUtils;
    Downtime public downtime;
    DoubleSign public doubleSign;
    OperatorRegistry public operatorRegistry;

    IDelegationManager public delegationManager;
    IStrategyManager public strategyManager;
    IAllocationManager public allocationManager;
    IStrategy public strategy;

    // Configs
    address public AVSAdmin;
    bool public isPaused;
    uint256 public minStrategyShareThreshold;

    // Modifiers
    modifier onlyAVSAdmin() {
        require(msg.sender == AVSAdmin, "Not AVS admin");
        _;
    }

    modifier notPaused() {
        require(!isPaused, "AVS is paused");
        _;
    }

    // Constructor
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

    // Admin Controls
    function pauseAVS() external onlyAVSAdmin {
        isPaused = true;
        emit AVSPaused();
    }

    function resumeAVS() external onlyAVSAdmin {
        isPaused = false;
        emit AVSResumed();
    }

    // Slashing Routes
    function triggerDowntimeSlashing(address operator) external notPaused {
        require(operatorRegistry.isOperator(operator), "Not a registered operator");

       

        bool result = downtime.slashIfViolated(operator);
        emit SlashingEvaluated(operator, result, "Downtime");

        if (result) {
            emit SlashTriggered(operator, "Downtime Violation");
        }
    }

    function triggerDoubleSignSlashing(
        address operator,
        bytes32 hash1,
        bytes memory sig1,
        bytes32 hash2,
        bytes memory sig2
    ) external notPaused {
        require(operatorRegistry.isOperator(operator), "Not a registered operator");

        bool result = doubleSign.slashIfViolated(operator, hash1, sig1, hash2, sig2);
        emit SlashingEvaluated(operator, result, "Double Sign");

        if (result) {
            emit SlashTriggered(operator, "Double Sign Violation");
        }
    }

    // Strategy Insights & Governance Utilities
  

   
    function isDelegated(address staker) public view returns (bool) {
        return delegationManager.isDelegated(staker);
    }

    function getDelegationApprover(address operator) public view returns (address) {
        return delegationManager.delegationApprover(operator);
    }

   


}
