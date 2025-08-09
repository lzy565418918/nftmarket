// SPDX-License-Identifier: MIT LICENSE

/*
N2D NFT ERC721 NFT Smart Contract.

Follow/Subscribe Youtube, Github, IM, Tiktok
for more amazing content!!
@Net2Dev
███╗░░██╗███████╗████████╗██████╗░██████╗░███████╗██╗░░░██╗
████╗░██║██╔════╝╚══██╔══╝╚════██╗██╔══██╗██╔════╝██║░░░██║
██╔██╗██║█████╗░░░░██║░░░░░███╔═╝██║░░██║█████╗░░╚██╗░██╔╝
██║╚████║██╔══╝░░░░░██║░░░██╔══╝░░██║░░██║██╔══╝░░░╚████╔╝░
██║░╚███║███████╗░░██║░░░███████╗██████╔╝███████╗░░╚██╔╝░░
╚═╝░░╚══╝╚══════╝░░╚═╝░░░╚══════╝╚═════╝░╚══════╝░░░╚═╝░░░

THIS CONTRACT IS AVAILABLE FOR EDUCATIONAL
PURPOSES ONLY. YOU ARE SOLELY RESPONSIBLE
FOR ITS USE. I AM NOT RESPONSIBLE FOR ANY
OTHER USE. THIS IS TRAINING/EDUCATIONAL
MATERIAL. ONLY USE IT IF YOU AGREE TO THE
TERMS SPECIFIED ABOVE.
*/

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

pragma solidity ^0.8.20;

contract Collection is ERC721Enumerable, Ownable {
    using Strings for uint256;

    // 基础元数据 URI，拼接 tokenId 和扩展名后得到完整元数据链接
    string public baseURI;
    // 元数据文件扩展名（如 .json）
    string public baseExtension = ".json";
    // NFT 最大供应量
    uint256 public maxSupply = 1000;
    // 单次最大铸造数量
    uint256 public maxMintAmount = 5;
    // 合约暂停状态，true 时禁止铸造
    bool public paused = false;

    /// @dev 构造函数，初始化合约名称、符号和基础 URI
    /// @notice 部署时设置 NFT 名称、符号和默认元数据基础 URI
    constructor() ERC721("Net2Dev NFT Collection", "N2D") Ownable(msg.sender) {
        baseURI = "ipfs://QmYB5uWZqfunBq7yWnamTqoXWBAHiQoirNLmuxMzDThHhi/";
    }

    /// @dev 返回基础 URI，供 tokenURI 拼接使用
    /// @return 当前基础 URI
    function _baseURI() internal view virtual override returns (string memory) {
        return "ipfs://QmYB5uWZqfunBq7yWnamTqoXWBAHiQoirNLmuxMzDThHhi/";
    }

    /// @notice 批量铸造 NFT
    /// @dev 只能在未暂停状态下，每次最多铸造 maxMintAmount 个 NFT，且总量不超过 maxSupply
    /// @param _to 接收 NFT 的地址
    /// @param _mintAmount 铸造数量
    function mint(address _to, uint256 _mintAmount) public payable {
        uint256 supply = totalSupply();
        require(!paused, "Minting is paused"); // 检查是否暂停
        require(_mintAmount > 0, "Mint amount must be greater than 0"); // 检查数量
        require(_mintAmount <= maxMintAmount, "Exceeds max mint amount"); // 检查单次上限
        require(supply + _mintAmount <= maxSupply, "Exceeds max supply"); // 检查总量上限

        // 循环铸造 NFT，tokenId 从 supply+1 开始递增
        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(_to, supply + i);
        }
    }

    /// @notice 查询某地址拥有的所有 NFT tokenId
    /// @dev 遍历 owner 的 NFT 数量，返回所有 tokenId
    /// @param _owner 查询地址
    /// @return tokenIds 该地址拥有的所有 tokenId 数组
    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    /// @notice 获取指定 tokenId 的元数据 URI
    /// @dev 拼接 baseURI + tokenId + baseExtension
    /// @param tokenId NFT 的 tokenId
    /// @return 元数据 URI
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            ownerOf(tokenId) != address(0),
            "ERC721Metadata: URI query for nonexistent token"
        ); // 检查 token 是否存在

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    // ================== only owner 管理函数 ==================

    /// @notice 设置单次最大铸造数量
    /// @dev 仅合约拥有者可调用
    /// @param _newmaxMintAmount 新的最大铸造数量
    function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
        maxMintAmount = _newmaxMintAmount;
    }

    /// @notice 设置基础 URI
    /// @dev 仅合约拥有者可调用
    /// @param _newBaseURI 新的基础 URI
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    /// @notice 设置元数据文件扩展名
    /// @dev 仅合约拥有者可调用
    /// @param _newBaseExtension 新的扩展名
    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    /// @notice 设置合约暂停状态
    /// @dev 仅合约拥有者可调用，暂停后无法铸造
    /// @param _state true 为暂停，false 为恢复
    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    /// @notice 提取合约内所有 ETH 到合约拥有者
    /// @dev 仅合约拥有者可调用，通常用于提取 mint 费用
    function withdraw() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}(
            ""
        );
        require(success, "Transfer failed.");
    }
}
