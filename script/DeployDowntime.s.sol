// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../lib/eigenlayer-contracts/lib/forge-std/src/Script.sol";
import "../lib/eigenlayer-contracts/lib/forge-std/src/console.sol";
import {Downtime} from "../src/contracts/rules/Downtime.sol";

contract DeployDowntime is Script {
    uint256 public DOWNTIME_THRES =50;
    address validator_utils = vm.envAddress("VALIDATOR_UTILS");
    function run() external {
        vm.startBroadcast();
        Downtime downtime = new Downtime(validator_utils,DOWNTIME_THRES);
        vm.stopBroadcast();

    }
}