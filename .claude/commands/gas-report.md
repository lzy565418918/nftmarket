# Gas 消耗报告

生成智能合约的 Gas 消耗报告，分析合约函数的 Gas 使用情况。

## 执行命令

```bash
REPORT_GAS=true npx hardhat test
```

## 报告内容

- 每个合约函数的 Gas 消耗
- 部署 Gas 成本
- 最小/最大/平均 Gas 使用量

## 优化建议

运行报告后，我会分析结果并提供 Gas 优化建议：

1. 存储优化（使用 packed storage）
2. 循环优化
3. 函数可见性优化
4. 数据类型优化
