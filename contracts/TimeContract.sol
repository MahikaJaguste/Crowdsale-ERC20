// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeContract {
  uint256 private startTime;

  constructor(uint256 newStartTime) {
    startTime = newStartTime;
  }

  /**
  * isNowAfter will return true if now is after the given start time
  */
  function isNowAfter() external view returns (bool){
      return (block.timestamp >= startTime);
  }
}