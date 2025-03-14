// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;
import "../../../lib/openzeppelin-contracts-v4.9.0/contracts/utils/cryptography/ECDSA.sol";
import "../utils/ValidatorUtils.sol";
contract DoubleSign{
    ValidatorUtils public validatorUtils;

    constructor(address _validatorUtils){
        validatorUtils=ValidatorUtils(_validatorUtils);
    }
    function isDoubleSignDetected(address operator,
    bytes32 messageHash1,
    bytes memory sign1,
    bytes32 messageHash2,
    bytes memory sign2) external view returns(bool) {
        address signer1 = ECDSA.recover(messageHash1,sign1);
        address signer2 = ECDSA.recover(messageHash2,sign2);
        return (signer1 == operator && signer2 == operator && messageHash1 != messageHash2);
    }

}