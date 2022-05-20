// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MyToken.sol";
import "./crowdsale-contracts/validation/CappedCrowdsale.sol";
import "./crowdsale-contracts/validation/PausableCrowdsale.sol";
import "./crowdsale-contracts/validation/TimedCrowdsale.sol";
import "./crowdsale-contracts/emission/MintedCrowdsale.sol";

contract MyCrowdsale is Context, AccessControlEnumerable, CappedCrowdsale, PausableCrowdsale, TimedCrowdsale, MintedCrowdsale  {

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");


    constructor (uint256 rate_, address payable wallet_, IERC20 token_, uint256 cap_, uint256 openingTime_, uint256 closingTime_) 
    Crowdsale(rate_, wallet_, token_)
    {    
        // TimedCrowdsale
        require(cap_ > 0, "CappedCrowdsale: cap is 0");
        cap = cap_;

        // CappedCrowdsale
        require(openingTime_ >= block.timestamp, "TimedCrowdsale: opening time is before current time");
        require(closingTime_ > openingTime_, "TimedCrowdsale: opening time is not before closing time");
        openingTime = openingTime_;
        closingTime = closingTime_;

        // PausableCrowdsale
        _setupRole(PAUSER_ROLE, _msgSender());

    }

    /**
     * @dev Pauses crowdsale transfers.
     *
     * See {CrowdsalePausable} and {Pausable-_pause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function pause() public virtual {
        require(hasRole(PAUSER_ROLE, _msgSender()), "ERC20PresetMinterPauser: must have pauser role to pause");
        _pause();
    }

    /**
     * @dev Unpauses crowdsale transfers.
     *
     * See {CrowdsalePausable} and {Pausable-_unpause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function unpause() public virtual {
        require(hasRole(PAUSER_ROLE, _msgSender()), "ERC20PresetMinterPauser: must have pauser role to unpause");
        _unpause();
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) 
    internal override(CappedCrowdsale, PausableCrowdsale, TimedCrowdsale, Crowdsale) view {
        super._preValidatePurchase(beneficiary, weiAmount);
    }

    function _deliverTokens(address beneficiary, uint256 tokenAmount)
    internal override(MintedCrowdsale, Crowdsale) {
        MintedCrowdsale._deliverTokens(beneficiary, tokenAmount);
    }
}

//1, 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB, 0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8, 8, 1652942283, 1652942933

// 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6, 0xd7B63981A38ACEB507354DF5b51945bacbe28414