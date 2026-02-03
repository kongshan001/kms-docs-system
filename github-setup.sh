#!/bin/bash

# GitHub 仓库设置脚本
# 使用方法：./github-setup.sh YOUR_USERNAME

if [ -z "$1" ]; then
    echo "使用方法: ./github-setup.sh YOUR_USERNAME"
    echo "示例: ./github-setup.sh johndoe"
    exit 1
fi

USERNAME=$1
REPO_NAME="kms-docs-system"

echo "========================================"
echo "GitHub 仓库设置"
echo "========================================"
echo "用户名: $USERNAME"
echo "仓库名: $REPO_NAME"
echo ""

echo "步骤1: 请在浏览器中访问以下链接创建仓库"
echo "https://github.com/new"
echo ""
echo "步骤2: 填写仓库信息"
echo "- Repository name: $REPO_NAME"
echo "- Description: 本地KMS文档库系统，支持Markdown编辑、代码高亮和图片上传"
echo "- ⚠️ 不要勾选 README、.gitignore、license"
echo ""

read -p "按回车键继续..." 

echo ""
echo "步骤3: 添加远程仓库并推送代码"
echo ""

# 使用 HTTPS
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git 2>/dev/null || echo "远程仓库已存在"

echo "正在推送到 GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "✅ 代码推送成功！"
    echo "========================================"
    echo ""
    echo "仓库地址: https://github.com/$USERNAME/$REPO_NAME"
    echo ""
else
    echo ""
    echo "========================================"
    echo "❌ 推送失败"
    echo "========================================"
    echo ""
    echo "可能的原因："
    echo "1. 仓库尚未创建，请先在 GitHub 上创建仓库"
    echo "2. 需要进行身份验证（GitHub token）"
    echo ""
    echo "请访问以下链接获取帮助："
    echo "https://docs.github.com/zh/authentication"
fi
