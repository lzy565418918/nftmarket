# 更新合约 ABI

编译合约后，更新前端使用的 ABI 文件。

## 步骤

1. 编译智能合约
2. 从 `artifacts/` 目录复制最新 ABI
3. 更新 `engine/` 目录下的 ABI 文件

## 执行

首先编译合约：
```bash
npx hardhat compile
```

然后我会：
1. 读取 `artifacts/contracts/` 下的编译产物
2. 提取 ABI 部分
3. 更新以下文件：
   - `engine/NFTCollection.json`
   - `engine/Resell.json`
   - `abis/index.tsx`

## ABI 文件位置

- `artifacts/` - Hardhat 编译产物
- `engine/` - 前端使用的 ABI 配置
