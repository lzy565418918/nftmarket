# 运行智能合约测试

运行 Hardhat 测试套件，验证智能合约功能。

## 测试文件位置

- `/test/` - 测试文件目录

## 执行命令

### 基础测试
```bash
npx hardhat test
```

### 带 Gas 报告的测试
```bash
REPORT_GAS=true npx hardhat test
```

### 运行特定测试文件
```bash
npx hardhat test test/Lock.ts
```

测试框架使用 Chai 断言库和 Mocha 测试运行器。
