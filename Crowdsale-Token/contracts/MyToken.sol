// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyToken is ERC20PresetMinterPauser {

    using SafeERC20 for IERC20;

    constructor(string memory name, string memory symbol) ERC20PresetMinterPauser(name, symbol) {
    }
}