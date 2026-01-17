# 构建生产版本

构建 Next.js 应用的生产版本。

## 执行命令

```bash
npm run build
```

## 构建输出

- 构建产物位于 `.next/` 目录
- 包含优化后的静态资源和服务端代码

## 构建后启动

```bash
npm run start
```

生产服务器默认运行在 http://localhost:3000

## 注意事项

- 构建前确保没有 TypeScript 错误
- 构建前确保没有 ESLint 错误
- 检查环境变量配置是否正确
