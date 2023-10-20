// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

interface INFT {
    function safeMint(address to) external returns (bool);
}
