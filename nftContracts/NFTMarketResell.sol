// SPDX-License-Identifier: MIT LICENSE

/*
Follow/Subscribe Youtube, Github, IM, Tiktok
for more amazing content!!
@Net2Dev
███╗░░██╗███████╗████████╗██████╗░██████╗░███████╗██╗░░░██╗
████╗░██║██╔════╝╚══██╔══╝╚════██╗██╔══██╗██╔════╝██║░░░██║
██╔██╗██║█████╗░░░░░██║░░░░░███╔═╝██║░░██║█████╗░░╚██╗░██╔╝
██║╚████║██╔══╝░░░░░██║░░░██╔══╝░░██║░░██║██╔══╝░░░╚████╔╝░
██║░╚███║███████╗░░░██║░░░███████╗██████╔╝███████╗░░╚██╔╝░░
╚═╝░░╚══╝╚══════╝░░░╚═╝░░░╚══════╝╚═════╝░╚══════╝░░░╚═╝░░░
THIS CONTRACT IS AVAILABLE FOR EDUCATIONAL 
PURPOSES ONLY. YOU ARE SOLELY REPONSIBLE 
FOR ITS USE. I AM NOT RESPONSIBLE FOR ANY
OTHER USE. THIS IS TRAINING/EDUCATIONAL
MATERIAL. ONLY USE IT IF YOU AGREE TO THE
TERMS SPECIFIED ABOVE.

Revised v2

- Added Cancel Sale Function
- Fixed ItemId to TokenId Conflict Bug 
  using tokenId as location in Memory in Struct

Revised v3

- Added Listing Fee Balance Withdraw Function

*/

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title NFT 二级市场转售合约
/// @notice 支持 NFT 上架、购买、取消出售、查询、手续费提取等功能
contract NFTMarketResell is IERC721Receiver, ReentrancyGuard, Ownable {
    // 合约拥有者地址（手续费归属）
    address payable holder;
    // 上架手续费
    uint256 listingFee = 0.0025 ether;

    /// @dev NFT 上架信息结构体
    struct List {
        uint256 tokenId;         // NFT 的 tokenId
        address payable seller;  // 卖家地址
        address payable holder;  // 当前持有者（上架时为合约地址）
        uint256 price;           // 出售价格
        bool sold;               // 是否已售出
    }

    // tokenId => 上架信息
    mapping(uint256 => List) public vaultItems;

    /// @dev NFT 上架事件
    event NFTListCreated(
        uint256 indexed tokenId,
        address seller,
        address holder,
        uint256 price,
        bool sold
    );

    /// @notice 获取上架手续费
    function getListingFee() public view returns (uint256) {
        return listingFee;
    }

    // NFT 合约实例
    ERC721Enumerable nft;

    /// @dev 构造函数，初始化 NFT 合约地址和拥有者
    /// @param _nft 目标 NFT 合约（需实现 ERC721Enumerable）
    constructor(ERC721Enumerable _nft) Ownable(msg.sender) {
        holder = payable(msg.sender);
        nft = _nft;
    }

    /// @notice NFT 上架出售
    /// @param tokenId 上架的 NFT tokenId
    /// @param price 出售价格
    function listSale(
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(nft.ownerOf(tokenId) == msg.sender, "NFT not yours"); // 必须是 NFT 持有者
        require(vaultItems[tokenId].tokenId == 0, "NFT already listed"); // 不能重复上架
        require(price > 0, "Amount must be higher than 0"); // 价格必须大于 0
        require(
            msg.value == listingFee,
            "Please transfer 0.0025 crypto to pay listing fee"
        ); // 必须支付上架手续费

        // 记录上架信息
        vaultItems[tokenId] = List(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );
        // NFT 转移到市场合约托管
        nft.transferFrom(msg.sender, address(this), tokenId);
        emit NFTListCreated(tokenId, msg.sender, address(this), price, false);
    }

    /// @notice 购买 NFT
    /// @param tokenId 购买的 NFT tokenId
    function buyNft(uint256 tokenId) public payable nonReentrant {
        uint256 price = vaultItems[tokenId].price;
        require(
            msg.value == price,
            "Transfer Total Amount to complete transaction"
        ); // 必须支付正确金额

        // 支付给卖家
        vaultItems[tokenId].seller.transfer(msg.value);
        // NFT 转移给买家
        nft.transferFrom(address(this), msg.sender, tokenId);
        // 标记为已售出
        vaultItems[tokenId].sold = true;
        // 删除上架信息
        delete vaultItems[tokenId];
    }

    /// @notice 取消 NFT 出售（仅限卖家）
    /// @param tokenId 取消的 NFT tokenId
    function cancelSale(uint256 tokenId) public nonReentrant {
        require(vaultItems[tokenId].seller == msg.sender, "NFT not yours"); // 只能由卖家取消
        // NFT 归还卖家
        nft.transferFrom(address(this), msg.sender, tokenId);
        // 删除上架信息
        delete vaultItems[tokenId];
    }

    /// @notice 查询某 NFT 的上架价格
    /// @param tokenId 查询的 NFT tokenId
    /// @return price 上架价格
    function getPrice(uint256 tokenId) public view returns (uint256) {
        uint256 price = vaultItems[tokenId].price;
        return price;
    }

    /// @notice 查询所有正在市场上架的 NFT 列表
    /// @return items 上架 NFT 信息数组
    function nftListings() public view returns (List[] memory) {
        uint256 nftCount = nft.totalSupply();
        uint256 currentIndex = 0;
        List[] memory items = new List[](nftCount);
        for (uint256 i = 0; i < nftCount; i++) {
            // 只返回当前合约托管的 NFT
            if (vaultItems[i + 1].holder == address(this)) {
                uint256 currentId = i + 1;
                List storage currentItem = vaultItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /// @notice 实现 ERC721 接收接口，防止用户直接转 NFT 到市场合约
    function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        require(from == address(0x0), "Cannot send nfts to Vault directly");
        return IERC721Receiver.onERC721Received.selector;
    }

    /// @notice 提取市场合约内累计的手续费（仅限合约拥有者）
    function withdraw() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
