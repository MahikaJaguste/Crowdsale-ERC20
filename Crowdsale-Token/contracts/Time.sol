// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;pragma solidity ^0.8;

contract Time {
    function getTimeStamp() public view returns(uint) {
        return block.timestamp;
    }
}