# 部署智能合约

使用 Hardhat Ignition 部署智能合约到指定网络。

## 部署模块位置

- `/ignition/modules/` - Hardhat Ignition 部署模块

## 执行命令

### 部署到本地 Hardhat 网络
```bash
npx hardhat ignition deploy ./ignition/modules/Lock.ts --network localhost
```

### 部署到其他网络（需要在 hardhat.config.ts 中配置）
```bash
npx hardhat ignition deploy ./ignition/modules/Lock.ts --network <network-name>
```

## 部署前检查

1. 确保 Hardhat 节点已启动（本地部署）
2. 确保合约已编译
3. 确保网络配置正确

## 部署后

更新 `engine/configuration.ts` 中的合约地址。
