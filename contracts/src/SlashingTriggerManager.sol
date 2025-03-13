// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {IDelegationManager} from "../../lib/eigenlayer-contracts/src/contracts/interfaces/IDelegationManager.sol";
import {IAllocationManager} from "../../lib/eigenlayer-contracts/src/contracts/interfaces/IAllocationManager.sol";
import {IStrategyManager} from "../../lib/eigenlayer-contracts/src/contracts/interfaces/IStrategyManager.sol";
import {IRewardsCoordinator} from "../../lib/eigenlayer-contracts/src/contracts/interfaces/IRewardsCoordinator.sol";



contract SlashingTriggerManager {
// Addresses of interface contracts
   address public Idelegate= 0xA44151489861Fe9e3055d95adC98FbD462B948e7;
   address public Iallocate=0x78469728304326CBc65f8f95FA756B0B73164462;
   address public iStrat=0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6;
   address public IRewards=0xA44151489861Fe9e3055d95adC98FbD462B948e7;

// events
event voilationRule(address rule , address operator);
    

    

    function emitViolation(address rule, address operator, string memory reason) external {
        emit ViolationRuleTriggered(rule, operator, reason);
        
    }

   

}
