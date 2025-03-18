// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;
import "../../../lib/openzeppelin-contracts-v4.9.0/contracts/utils/cryptography/ECDSA.sol";
import "../utils/ValidatorUtils.sol";
contract DoubleSign{
    ValidatorUtils public validatorUtils;

    constructor(address _validatorUtils){
        validatorUtils=ValidatorUtils(_validatorUtils);
    }
    function slashIfViolated(
    address operator,
    bytes32 hash1,
    bytes memory sig1,
    bytes32 hash2,
    bytes memory sig2
) external returns (bool) {
    require(hash1 != hash2, "No conflict detected");

    address signer1 = ECDSA.recover(hash1, sig1);
    address signer2 = ECDSA.recover(hash2, sig2);

    require(signer1 == operator && signer2 == operator, "Invalid signatures");

    if (!validatorUtils.isSlashed1(operator)) {
        validatorUtils.markOperatorSlashed(operator);
        return true;
    }

    return false;
}

}