# 检查项目配置

检查项目的关键配置是否正确。

## 检查项目

### 1. 合约地址配置
检查 `engine/configuration.ts` 中的合约地址是否与部署的合约匹配。

### 2. 网络配置
检查 RPC 端点配置：
- 本地开发：http://localhost:8545
- 测试网/主网：相应的 RPC URL

### 3. IPFS 配置
检查 IPFS 客户端配置是否正确。

### 4. ABI 文件
确认 ABI 文件与已部署的合约版本匹配。

### 5. 环境变量
检查是否有需要配置的环境变量。

## 执行

我会读取并分析以下配置文件：
- `engine/configuration.ts`
- `hardhat.config.ts`
- `next.config.ts`
- `package.json`

并报告任何配置问题或不一致之处。
