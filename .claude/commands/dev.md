# 启动开发环境

启动 NFT Market 完整开发环境，包括 Hardhat 本地节点和 Next.js 开发服务器。

## 步骤

1. 在后台启动 Hardhat 本地区块链节点
2. 启动 Next.js 开发服务器

请按顺序执行以下命令：

```bash
# 后台启动 Hardhat 节点
npx hardhat node &

# 等待节点启动
sleep 3

# 启动 Next.js 开发服务器
npm run dev
```

启动后：
- Hardhat 节点运行在 http://localhost:8545
- Next.js 应用运行在 http://localhost:3000
