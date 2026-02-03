#!/bin/bash

if [ ! -f .config ]; then
    echo "错误: .config 文件不存在"
    exit 1
fi

source .config

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
    exit 1
fi

git remote set-url origin https://github.com/$GITHUB_USERNAME/$GITHUB_REPO.git
