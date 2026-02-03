#!/bin/bash

if [ ! -f .config ]; then
    echo "错误: .config 文件不存在"
    exit 1
fi

source .config

USE_SSH="${1:-false}"

if [ "$USE_SSH" = "true" ]; then
    echo "使用 SSH 方式推送..."
    
    if [ -z "$GITHUB_URL" ]; then
        echo "错误: GITHUB_URL 未在 .config 中设置"
        exit 1
    fi
    
    git remote set-url origin "$GITHUB_URL"
    
    if git push; then
        echo ""
        echo "✅ 推送成功！"
        echo "仓库: https://github.com/$GITHUB_USERNAME/$GITHUB_REPO"
        echo ""
        echo "提示: GitHub Actions 文件未推送（token 无 workflow 权限）"
    else
        echo ""
        echo "❌ 推送失败"
        exit 1
    fi
else
    if [ -z "$GITHUB_TOKEN" ]; then
        echo "错误: GITHUB_TOKEN 未在 .config 中设置"
        exit 1
    fi
    
    echo "推送到 GitHub: $GITHUB_USERNAME/$GITHUB_REPO"
    
    git remote set-url origin https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$GITHUB_REPO.git
    
    if git push; then
        echo ""
        echo "✅ 推送成功！"
        echo "仓库: https://github.com/$GITHUB_USERNAME/$GITHUB_REPO"
        echo "Actions: https://github.com/$GITHUB_USERNAME/$GITHUB_REPO/actions"
    else
        echo ""
        echo "❌ 推送失败"
        echo ""
        echo "token 可能缺少 workflow 权限"
        echo "请使用 SSH 方式: ./push.sh ssh"
        exit 1
    fi
    
    git remote set-url origin https://github.com/$GITHUB_USERNAME/$GITHUB_REPO.git
fi
