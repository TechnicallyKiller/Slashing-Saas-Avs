// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../lib/eigenlayer-contracts/lib/forge-std/src/Script.sol";
import "../lib/eigenlayer-contracts/lib/forge-std/src/console.sol";
import {ValidatorUtils} from "../src/contracts/utils/ValidatorUtils.sol";
import {OperatorRegistry} from "../src/contracts/OperatorRegistry.sol";
import {NodeHealthReporter} from "../src/contracts/utils/NodeHealthReporter.sol";
import {Downtime} from "../src/contracts/rules/Downtime.sol";
import {DoubleSign} from "../src/contracts/rules/DoubleSigning.sol";
import {SlashingTriggerManager} from "../src/contracts/SlashingTriggerManager.sol";


contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        address botkey = vm.envAddress("BOT_KEY");

        

        address delegationManager = vm.envAddress("DELEGATION_MANAGER");
        address strategyManager = vm.envAddress("STRATEGY_MANAGER");
        ValidatorUtils validatorUtils = new ValidatorUtils();
        console.log("validator deployed at ", address(validatorUtils));
        OperatorRegistry operatorRegistry = new OperatorRegistry(delegationManager);
        NodeHealthReporter reporter = new NodeHealthReporter(address(validatorUtils),botkey);
        console.log("validator deployed at ", address(reporter));
        Downtime downtime = new Downtime(address(validatorUtils), 20);
        DoubleSign doubleSign = new DoubleSign(address(validatorUtils));
        // address _validatorUtils,
        // address _downtime,
        // address _doubleSign,
        // address _operatorRegistry,
        // address _delegationManager,
        // address _strategyManager,
        // address _strategy,
        // uint256 _minStrategyShareThreshold,
        // address _allocationManager//
        
        
        uint256 minThreshold = 100;

        SlashingTriggerManager trigger = new SlashingTriggerManager(
            address(validatorUtils),
            address(downtime),
            address(doubleSign),
            address(operatorRegistry),
            delegationManager,
            strategyManager,
            minThreshold
        );

        vm.stopBroadcast();
    }
}
