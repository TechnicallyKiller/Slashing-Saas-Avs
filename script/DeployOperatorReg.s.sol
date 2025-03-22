// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;
import "../lib/eigenlayer-contracts/lib/forge-std/src/Script.sol";
import "../lib/eigenlayer-contracts/lib/forge-std/src/console.sol";
import {OperatorRegistry} from "../src/contracts/OperatorRegistry.sol";


contract DeployOperatorReg is Script {
    function run() external {

        vm.startBroadcast();
        address delegationManager = vm.envAddress("DELEGATION_MANAGER");

        OperatorRegistry operatorRegistry = new OperatorRegistry(delegationManager);

        vm.stopBroadcast();


    }
}