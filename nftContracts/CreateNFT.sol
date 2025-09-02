// SPDX-License-Identifier: MIT OR Apache-2.0

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract N2DNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    address public contractAddress;
    uint256 public cost = 0.075 ether;

    constructor(address marketContract)
        ERC721("n2DMarket", "N2DM")
        Ownable(msg.sender)
    {
        contractAddress = marketContract;
    }

    function createNFT(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    function mintNFT(string memory tokenURI)
        public
        payable
        nonReentrant
        returns (uint256)
    {
        require(msg.value == cost, "Need to send 0.075 ether!");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    function withdraw() public onlyOwner nonReentrant {
        payable(owner()).transfer(address(this).balance);
    }
}
