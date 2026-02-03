# KMS文档库系统

本地搭建的知识管理系统，支持Markdown语法编辑、保存和预览功能。

## 技术栈

- **后端**: Node.js + Express
- **前端**: React + @toast-ui/editor
- **文件上传**: Multer
- **代码高亮**: Highlight.js + Toast UI Editor插件
- **Markdown解析**: Marked.js
- **构建工具**: Webpack + Babel
- **存储**: 本地JSON文件存储 + 图片文件存储

## 功能特性

- ✅ 创建、编辑、删除文档
- ✅ Markdown语法编辑器（Toast UI Editor）
- ✅ 实时Markdown预览（自动转换为HTML）
- ✅ 代码语法高亮（支持100+编程语言）
- ✅ 图片上传功能（支持拖拽上传）
- ✅ 图片缩放功能（点击放大查看）
- ✅ 文档列表实时预览（显示前100字缩略）
- ✅ 文档列表管理
- ✅ 响应式设计
- ✅ 本地数据持久化

## 代码语法高亮

系统支持代码块的语法高亮功能，基于 **Highlight.js** 实现：

- 支持 **100+ 编程语言**（JavaScript、Python、CSS、Java、Go、Rust等）
- 自动检测代码语言
- GitHub风格的语法高亮主题
- 编辑模式和预览模式均支持

**使用方法**：

在Markdown中使用代码块语法：

````markdown
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
  return 42;
}
\`\`\`
````

````markdown
\`\`\`python
def greet(name):
    return f"Hello, {name}!"
\`\`\`
````

支持的代码块语言包括但不限于：
- JavaScript, TypeScript
- Python, Ruby
- Java, C, C++, C#
- Go, Rust
- CSS, SCSS, HTML
- SQL, JSON, YAML
- Shell, Bash
- 等100+语言

## 图片上传功能

系统支持图片上传功能，可以将图片插入到Markdown文档中：

### 支持的图片格式
- JPEG / JPG
- PNG
- GIF
- WebP

### 图片上传限制
- 最大文件大小：5MB
- 支持的文件格式：jpeg, jpg, png, gif, webp

### 上传方式
1. **编辑器工具栏**：点击图片图标选择文件上传
2. **拖拽上传**：直接将图片拖拽到编辑器中
3. **粘贴上传**：从剪贴板粘贴图片

### 图片存储
- 上传的图片存储在服务器本地的 `uploads/` 目录
- 图片文件自动重命名为唯一名称（时间戳 + 随机数）
- 图片URL格式：`/uploads/image-{timestamp}-{random}.{ext}`

### 使用示例

上传图片后，会自动插入Markdown图片语法：

```markdown
![图片描述](/uploads/image-1701234567890-123456789.png)
```

预览时会显示为：

![图片描述](/uploads/image-1701234567890-123456789.png)

## 图片缩放功能

系统支持图片缩放和放大查看功能，方便查看图片细节：

### 默认显示
- 图片默认最大宽度为 800px
- 自动适应容器宽度
- 保持图片原始宽高比
- 鼠标悬停时有轻微放大效果

### 缩放功能
点击图片可以打开全屏查看，支持以下操作：

**操作方式**：
1. **点击图片**：打开全屏查看
2. **+ 按钮**：放大图片（最大 3x）
3. **- 按钮**：缩小图片（最小 0.5x）
4. **重置按钮**：恢复到原始大小
5. **关闭按钮**：关闭全屏查看

**快捷键**：
- `ESC`：关闭全屏查看
- `+` 或 `=`：放大图片
- `-`：缩小图片

**鼠标操作**：
- 点击黑色背景区域：关闭全屏查看
- 点击图片本身：不关闭（可以点击按钮操作）

## 安装与使用

### 1. 安装依赖

```bash
npm install --legacy-peer-deps
```

### 2. 构建前端

```bash
npm run build
```

### 3. 启动服务器

```bash
npm start
```

服务器将在 http://localhost:3000 启动

### 其他命令

```bash
# 停止服务器
npm stop

# 重启服务器
npm run restart
```

### 端口占用问题处理

如果重复执行 `npm start` 出现端口占用错误，请先停止正在运行的服务器：

```bash
npm stop
# 或者
pkill -f "node server/index.js"
```

系统会显示友好的错误提示，告知端口被占用并提供解决方案。

## 目录结构

```
kms-docs-system/
├── client/          # 前端React代码
│   ├── App.js       # 主应用组件
│   ├── index.js     # 入口文件
│   └── styles.css   # 样式文件
├── server/          # 后端Express代码
│   └── index.js     # 服务器文件
├── public/          # 公共资源
│   └── index.html   # HTML模板
├── data/            # 数据存储目录（自动生成）
│   └── documents.json
├── uploads/         # 图片上传目录（自动生成）
├── dist/            # 构建输出目录
└── package.json     # 项目配置
```

## API接口

### 获取所有文档
```
GET /api/documents
```

### 获取单个文档
```
GET /api/documents/:id
```

### 创建文档
```
POST /api/documents
Content-Type: application/json

{
  "title": "文档标题",
  "content": "Markdown内容"
}
```

### 更新文档
```
PUT /api/documents/:id
Content-Type: application/json

{
  "title": "更新后的标题",
  "content": "更新后的内容"
}
```

### 删除文档
```
DELETE /api/documents/:id
```

### 上传图片
```
POST /api/upload
Content-Type: multipart/form-data

参数：image (文件)
响应：
{
  "url": "/uploads/image-1234567890-123456789.png"
}
```

## 使用说明

1. 启动应用后，访问 http://localhost:3000
2. 点击左侧"新建文档"按钮创建新文档
3. 点击文档列表中的文档进行查看
4. 点击"编辑"按钮进入编辑模式
5. 使用Toast UI Editor编辑器编写Markdown内容
6. **上传图片**：
   - 点击工具栏的图片图标选择文件
   - 或者直接拖拽图片到编辑器
   - 或者从剪贴板粘贴图片
7. **查看图片**：
   - 图片默认按合理尺寸显示（最大 800px）
   - 鼠标悬停在图片上有放大提示
   - 点击图片打开全屏查看
   - 使用快捷键或按钮缩放图片
8. 点击"保存"按钮保存更改
9. 点击"删除"按钮删除不需要的文档

## 开发模式

开发时可以监听文件变化自动构建：

```bash
npm run build:dev
```

然后在另一个终端运行：

```bash
npm start
```

## 注意事项

- 数据存储在本地文件系统中，请确保有足够的磁盘空间
- 上传的图片会永久存储在 `uploads/` 目录中，请注意磁盘空间使用
- 默认端口为3000，如需修改请编辑 server/index.js
- 构建产物在 dist 目录中
- 图片上传大小限制为 5MB，可在 server/index.js 中修改
