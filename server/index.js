const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, '..', 'data');
const DOCS_FILE = path.join(DATA_DIR, 'documents.json');
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('只支持图片文件 (jpeg, jpg, png, gif, webp)'));
    }
  }
});

const server = app.listen(PORT, () => {
  console.log(`KMS系统已启动: http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，请先停止正在运行的服务器`);
    console.error('运行: pkill -f "node server/index.js"');
  } else {
    console.error('服务器启动失败:', err);
  }
  process.exit(1);
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use('/uploads', express.static(UPLOAD_DIR));

async function initDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DOCS_FILE);
    } catch {
      await fs.writeFile(DOCS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error initializing data directory:', error);
  }
}

async function initUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Error initializing upload directory:', error);
  }
}

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '没有上传文件' });
  }
  
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
}, (error, req, res, next) => {
  if (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/documents', async (req, res) => {
  try {
    const data = await fs.readFile(DOCS_FILE, 'utf8');
    const documents = JSON.parse(data);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read documents' });
  }
});

app.get('/api/documents/:id', async (req, res) => {
  try {
    const data = await fs.readFile(DOCS_FILE, 'utf8');
    const documents = JSON.parse(data);
    const document = documents.find(doc => doc.id === req.params.id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read document' });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const data = await fs.readFile(DOCS_FILE, 'utf8');
    const documents = JSON.parse(data);
    
    const newDocument = {
      id: Date.now().toString(),
      title,
      content: content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    documents.push(newDocument);
    await fs.writeFile(DOCS_FILE, JSON.stringify(documents, null, 2));
    
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create document' });
  }
});

app.put('/api/documents/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const data = await fs.readFile(DOCS_FILE, 'utf8');
    const documents = JSON.parse(data);
    
    const index = documents.findIndex(doc => doc.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    documents[index] = {
      ...documents[index],
      title: title || documents[index].title,
      content: content !== undefined ? content : documents[index].content,
      updatedAt: new Date().toISOString()
    };
    
    await fs.writeFile(DOCS_FILE, JSON.stringify(documents, null, 2));
    
    res.json(documents[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update document' });
  }
});

app.delete('/api/documents/:id', async (req, res) => {
  try {
    const data = await fs.readFile(DOCS_FILE, 'utf8');
    const documents = JSON.parse(data);
    
    const index = documents.findIndex(doc => doc.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    documents.splice(index, 1);
    await fs.writeFile(DOCS_FILE, JSON.stringify(documents, null, 2));
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

initDataDir().then(() => {
});
initUploadDir();
