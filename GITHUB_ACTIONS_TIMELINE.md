# KMS 文档库系统 - GitHub Actions 搭建记录

## 项目概述

为 KMS 文档库系统添加自动化测试和 CI/CD 流程，使用 GitHub Actions 实现持续集成。

---

## 时间线记录

### 📅 2025-02-04

#### 1. 初始配置（00:00 - 00:10）

**工作内容：**
- 创建 `.github/workflows/test.yml` 工作流文件
- 配置 Jest 测试框架
- 添加 React Testing Library 和 Supertest
- 配置测试覆盖率阈值（50%）

**配置详情：**
```yaml
name: Run Tests
on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:
```

**测试配置：**
- 前端测试：4 个测试用例（React 组件测试）
- 后端测试：6 个测试用例（Express API 测试）
- 测试框架：Jest + React Testing Library + Supertest

---

#### 2. 首次推送失败（00:10 - 00:15）

**问题发现：**
```
! [remote rejected] main -> main 
(refusing to allow a Personal Access Token to create or update 
workflow `.github/workflows/test.yml` without `workflow` scope)
```

**问题分析：**
- Personal Access Token 缺少 `workflow` 权限
- 无法创建或更新 GitHub Actions 工作流文件
- `.github/workflows/` 被添加到 `.gitignore`

**解决方案：**
1. 从 `.gitignore` 中移除 `.github/workflows/`
2. 简化 workflow 配置
3. 使用 SSH 方式或更新 token

---

#### 3. 简化 Workflow（00:15 - 00:20）

**优化内容：**
- 移除 matrix 测试（改为单 Node.js 版本）
- 移除覆盖率上传步骤
- 移除 schedule 触发（避免频繁执行）
- 保留核心测试功能

**简化后配置：**
```yaml
name: Run Tests
on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci --legacy-peer-deps
      - run: npm test
```

---

#### 4. 推送成功（00:20 - 00:25）

**操作：**
- 修复 `.gitignore` 配置
- 提交 workflow 文件
- 推送到 GitHub 成功

**状态：**
- ✅ Workflow 文件已在 GitHub 上
- ✅ 可以手动触发运行
- ✅ Push 到 main 分支自动触发

---

#### 5. 第一次运行错误（00:25 - 00:30）

**错误信息：**
```
Dependencies lock file is not found in /home/runner/work/...
Supported file patterns: package-lock.json, npm-shrinkwrap.json, yarn.lock
```

**错误分析：**
- Workflow 使用 `npm ci` 命令
- `npm ci` 需要 `package-lock.json` 文件
- `package-lock.json` 在 `.gitignore` 中，未推送到 GitHub

**解决方案：**
- 将 `npm ci` 改为 `npm install --legacy-peer-deps`
- `npm install` 不需要 `package-lock.json`

---

#### 6. 第二次运行错误（00:30 - 00:35）

**错误信息：**
```
Dependencies lock file is not found...
```

**错误分析：**
- `actions/setup-node` 配置了 `cache: 'npm'`
- npm 缓存也需要 `package-lock.json` 来创建哈希
- 即使没有 `npm ci`，缓存配置仍然依赖 lock 文件

**解决方案：**
- 移除 `cache: 'npm'` 配置
- 现在 workflow 完全不依赖 lock 文件

---

#### 7. 最终修复完成（00:35 - 00:40）

**最终配置：**
```yaml
name: Run Tests
on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install --legacy-peer-deps
      
      - name: Run tests
        run: npm test
```

**修复要点：**
1. ✅ 使用 `npm install` 替代 `npm ci`
2. ✅ 移除 `cache: 'npm'` 配置
3. ✅ 单 Node.js 版本（20.x）
4. ✅ 核心测试功能保留

---

## 问题总结

### 主要问题列表

| # | 问题 | 原因 | 解决方案 | 状态 |
|---|------|------|----------|------|
| 1 | Token 权限不足 | 缺少 `workflow` 权限 | 更新 token 或使用 SSH | ✅ 已解决 |
| 2 | Workflow 未推送 | 在 `.gitignore` 中 | 移除 `.github/workflows/` | ✅ 已解决 |
| 3 | npm ci 失败 | 缺少 `package-lock.json` | 改为 `npm install` | ✅ 已解决 |
| 4 | npm 缓存失败 | `cache: 'npm'` 需要 lock 文件 | 移除缓存配置 | ✅ 已解决 |

### 根本原因

1. **`.gitignore` 配置问题**
   - 最初将 `.github/workflows/` 加入 `.gitignore`
   - 导致 workflow 文件无法推送到 GitHub
   - 解决方案：从 `.gitignore` 中移除

2. **`package-lock.json` 策略**
   - 项目使用 `--legacy-peer-deps` 安装依赖
   - 为避免冲突，不提交 `package-lock.json`
   - Workflow 需要适配这种策略

3. **GitHub Actions 配置适配**
   - 需要理解 `npm ci` vs `npm install` 的区别
   - 需要理解 `cache: 'npm'` 的依赖关系
   - 最终选择最简配置确保稳定性

---

## 经验总结

### ✅ 最佳实践

1. **测试先行**
   - 本地测试通过后再配置 CI
   - 确保测试用例稳定可靠

2. **简化配置**
   - 从简单配置开始
   - 逐步添加复杂功能
   - 避免一次性配置过多选项

3. **理解依赖关系**
   - `npm ci` → 需要 `package-lock.json`
   - `cache: 'npm'` → 需要 `package-lock.json`
   - 选择适合项目策略的工具

4. **文档记录**
   - 记录所有配置变更
   - 记录问题解决过程
   - 方便后续维护和排查

### ⚠️ 注意事项

1. **Token 权限**
   - 创建 Personal Access Token 时勾选 `workflow` 权限
   - 或者使用 SSH 方式避免权限问题

2. **`.gitignore` 检查**
   - 推送前检查是否意外忽略了重要文件
   - 使用 `git status` 和 `git diff` 确认

3. **Workflow 语法**
   - YAML 语法严格，注意缩进
   - 使用在线工具验证 YAML

4. **缓存策略**
   - 如果没有 lock 文件，不要使用 npm 缓存
   - 缓存可以加速，但不是必须的

---

## 当前状态

### 测试配置
- **前端测试**：4 个测试用例（React 组件）
- **后端测试**：6 个测试用例（Express API）
- **测试框架**：Jest + React Testing Library + Supertest
- **覆盖率阈值**：50%（分支、函数、行、语句）

### GitHub Actions 配置
- **触发条件**：Push 到 main 分支、手动触发
- **运行环境**：Ubuntu Latest
- **Node.js 版本**：20.x
- **安装命令**：`npm install --legacy-peer-deps`
- **测试命令**：`npm test`

### 自动化功能
- ✅ Push 到 main 自动运行测试
- ✅ 手动触发支持
- ✅ 测试报告和日志
- ✅ 持续集成（CI）

---

## 后续优化建议

### 短期（1-2 周）
1. 监控测试稳定性
2. 添加更多测试用例
3. 考虑添加代码覆盖率报告

### 中期（1 个月）
1. 添加 Pull Request 触发
2. 配置多 Node.js 版本测试
3. 添加代码质量检查（ESLint、Prettier）

### 长期（3 个月）
1. 配置自动部署（CD）
2. 添加性能测试
3. 集成第三方服务（Codecov、Sentry 等）

---

## 快速参考

### 本地测试
```bash
npm test              # 运行所有测试
npm run test:watch   # 监听模式
npm run test:coverage # 覆盖率报告
```

### GitHub Actions 链接
- Actions 页面：https://github.com/kongshan001/kms-docs-system/actions
- Workflow 文件：https://github.com/kongshan001/kms-docs-system/blob/main/.github/workflows/test.yml

### 推送代码
```bash
./push.sh  # 使用本地 .config 中的 token 自动推送
```

---

## 相关文件

- `.github/workflows/test.yml` - GitHub Actions 工作流配置
- `.gitignore` - 已移除 `.github/workflows/`
- `.config` - 本地配置文件（存储 token，不提交到 Git）
- `push.sh` - 自动推送脚本
- `WORKFLOW_TRIGGERS.md` - 测试触发配置说明
- `GIT_PUSH.md` - Git 推送详细文档

---

## 作者

**项目：** KMS 文档库系统  
**搭建时间：** 2025-02-04  
**文档版本：** v1.0  

---

## 附录：完整 Workflow 文件

```yaml
name: Run Tests

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
    
    - name: Install dependencies
      run: npm install --legacy-peer-deps
    
    - name: Run tests
      run: npm test
```

---

*本文档记录了 KMS 文档库系统从零搭建 GitHub Actions 自动化测试的完整过程，包括遇到的问题、解决方案和经验总结。*
