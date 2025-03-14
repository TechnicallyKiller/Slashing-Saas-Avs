// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../lib/eigenlayer-contracts/lib/forge-std/src/Script.sol";
import {NodeHealthReporter} from "../src/contracts/utils/NodeHealthReporter.sol";

contract DeployNodeHealthReporter is Script {
    function run() external {
        address validatorUtils = vm.envAddress("VALIDATOR_UTILS"); // Set in .env
        address authorizedBot = vm.envAddress("BOT_KEY");   // Set in .env

        vm.startBroadcast();

        NodeHealthReporter reporter = new NodeHealthReporter(validatorUtils, authorizedBot);
        console.log("NodeHealthReporter deployed at:", address(reporter));

        vm.stopBroadcast();
    }
}