# Git 推送说明

## 快速推送方式

### 方法1：使用推送脚本（推荐）

```bash
./git-push.sh YOUR_GITHUB_TOKEN
```

**步骤：**
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 填写描述（如：Git Push）
4. 勾选权限：
   - ✅ repo (Full control of private repositories)
   - ✅ workflow (Update GitHub Action workflows)
5. 生成 token 并复制
6. 运行脚本：`./git-push.sh YOUR_GITHUB_TOKEN`

脚本会自动：
- 设置远程 URL（带 token）
- 推送代码
- 移除远程 URL 中的 token

### 方法2：手动推送

```bash
# 设置带 token 的远程 URL
git remote set-url origin https://YOUR_TOKEN@github.com/kongshan001/kms-docs-system.git

# 推送代码
git push

# 移除 token
git remote set-url origin https://github.com/kongshan001/kms-docs-system.git
```

### 方法3：使用 SSH（推荐长期使用）

**首次设置：**
```bash
# 生成 SSH 密钥（如果没有）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加 SSH 密钥到 GitHub
cat ~/.ssh/id_ed25519.pub | pbcopy
# 然后访问：https://github.com/settings/keys 添加密钥

# 设置远程 URL 为 SSH
git remote set-url origin git@github.com:kongshan001/kms-docs-system.git
```

**后续推送：**
```bash
git push
```

## 常用 Git 命令

```bash
# 查看状态
git status

# 查看远程仓库
git remote -v

# 查看提交历史
git log --oneline -5

# 查看未推送的提交
git log origin/main..HEAD --oneline
```

## 推送后

推送成功后：
1. 访问 https://github.com/kongshan001/kms-docs-system
2. GitHub Actions 会自动运行测试
3. 查看测试状态：https://github.com/kongshan001/kms-docs-system/actions
4. 查看测试覆盖率：https://github.com/kongshan001/kms-docs-system/actions/workflows/run-tests

## 注意事项

⚠️ **Token 安全：**
- 妥善保管 Personal Access Token
- 不要将 token 提交到代码仓库
- 定期更新 token
- 使用 SSH 方式更安全

⚠️ **GitHub Actions 权限：**
- 确保token 有 `workflow` 权限
- 否则无法创建/更新 workflow 文件

## 快速参考

| 操作 | 命令 |
|------|------|
| 推送 | `git push` |
| 查看状态 | `git status` |
| 查看日志 | `git log -5` |
| 强制推送 | `git push --force` |
| 拉取更新 | `git pull` |

## 故障排查

**问题：推送被拒绝**
```
! [remote rejected] ... without `workflow` scope
```
**解决**：token 需要添加 `workflow` 权限

**问题：认证失败**
```
Authentication failed
```
**解决**：检查 token 是否正确、是否已过期

**问题：连接超时**
```
fatal: unable to access 'https://github.com/...'
```
**解决**：检查网络连接，尝试使用 SSH
