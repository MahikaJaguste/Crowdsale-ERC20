// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../Crowdsale.sol";

/**
 * @title CappedCrowdsale
 * @dev Crowdsale with a limit for total contributions.
 */
abstract contract CappedCrowdsale is Crowdsale {

    using SafeMath for uint256;

    uint256 public cap;

    /**
     * @dev Checks whether the cap has been reached.
     * @return Whether the cap was reached
     */
    function capReached() public view returns (bool) {
        return _weiRaised >= cap;
    }

    /**
     * @dev Extend parent behavior requiring purchase to respect the funding cap.
     * @param beneficiary Token purchaser
     * @param weiAmount Amount of wei contributed
     */
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal virtual override view {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(_weiRaised.add(weiAmount) <= cap, "CappedCrowdsale: cap exceeded");
    }
}