# 编译智能合约

编译项目中的所有 Solidity 智能合约。

## 合约位置

- `/contracts/` - Hardhat 示例合约
- `/nftContracts/` - NFT 相关合约
  - `NFTCollection.sol` - ERC721 NFT 合约
  - `NFTMarketResell.sol` - NFT 转售市场合约

## 执行命令

```bash
npx hardhat compile
```

编译成功后，ABI 文件将生成在 `artifacts/` 目录中。
