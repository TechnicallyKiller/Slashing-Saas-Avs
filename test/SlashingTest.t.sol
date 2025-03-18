// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "../lib/eigenlayer-contracts/lib/forge-std/src/Test.sol";
import "../src/contracts/rules/DoubleSigning.sol";
import "../src/contracts/rules/Downtime.sol";
import "../src/contracts/utils/ValidatorUtils.sol";


contract SlashingTests is Test {
    ValidatorUtils utils;
    Downtime downtime;
    DoubleSign doubleSign;

    address operator;

    function setUp() public {
        utils = new ValidatorUtils();
        downtime = new Downtime(address(utils), 20);
        doubleSign = new DoubleSign(address(utils));
        operator = address(0x1234);
    }

    function testDowntimeSlashingSuccess() public {
        utils.updateLastSeenBlock(operator, block.number - 100);
        bool result = downtime.slashIfViolated(operator);
        assertTrue(result, "Downtime slashing should pass");
    }

    function testDoubleSignSlashing() public {
        bytes32 h1 = keccak256(abi.encodePacked("H1"));
        bytes32 h2 = keccak256(abi.encodePacked("H2"));

        (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(1, h1); // Dummy sig
        (uint8 v2, bytes32 r2, bytes32 s2) = vm.sign(1, h2);

        bytes memory sig1 = abi.encodePacked(r1, s1, v1);
        bytes memory sig2 = abi.encodePacked(r2, s2, v2);

        bool result = doubleSign.slashIfViolated(operator, h1, sig1, h2, sig2);
        assertTrue(result, "Double sign slashing should succeed");
    }
}
