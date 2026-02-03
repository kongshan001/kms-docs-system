#!/bin/bash

# GitHub 推送脚本
# 使用方法：./git-push.sh YOUR_TOKEN

if [ -z "$1" ]; then
    echo "使用方法: ./git-push.sh YOUR_GITHUB_TOKEN"
    echo ""
    echo "获取 GitHub Token："
    echo "1. 访问: https://github.com/settings/tokens"
    echo "2. 点击: Generate new token (classic)"
    echo "3. 勾选权限:"
    echo "   ✅ repo (Full control of private repositories)"
    echo "   ✅ workflow (Update GitHub Action workflows)"
    echo "4. 生成并复制 token"
    echo ""
    echo "然后运行: ./git-push.sh YOUR_TOKEN"
    exit 1
fi

TOKEN=$1
REPO="kongshan001/kms-docs-system"

echo "========================================"
echo "推送到 GitHub"
echo "========================================"
echo "仓库: $REPO"
echo ""

# 设置带 token 的远程 URL
git remote set-url origin https://$TOKEN@github.com/$REPO.git

# 推送代码
echo "正在推送代码..."
if git push; then
    echo ""
    echo "========================================"
    echo "✅ 推送成功！"
    echo "========================================"
    echo ""
    echo "仓库地址: https://github.com/$REPO"
    echo ""
    echo "GitHub Actions 将自动运行测试"
    echo "查看测试状态: https://github.com/$REPO/actions"
    echo ""
    
    # 重置远程 URL（移除 token）
    git remote set-url origin https://github.com/$REPO.git
    echo "已移除远程 URL 中的 token"
else
    echo ""
    echo "========================================"
    echo "❌ 推送失败"
    echo "========================================"
    echo ""
    echo "可能的原因："
    echo "1. Token 没有足够的权限"
    echo "2. Token 已过期"
    echo "3. 网络连接问题"
    echo ""
    echo "请检查 token 权限："
    echo "✅ repo"
    echo "✅ workflow"
    echo ""
    
    # 重置远程 URL（移除 token）
    git remote set-url origin https://github.com/$REPO.git
    exit 1
fi
