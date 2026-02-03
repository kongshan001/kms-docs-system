import React, { useState, useEffect } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'highlight.js/styles/github.css';
import { Editor } from '@toast-ui/react-editor';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import hljs from 'highlight.js';
import { marked } from 'marked';

const PREVIEW_LENGTH = 200;

marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error('Highlight error:', err);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  langPrefix: 'hljs language-'
});

function ImageZoom({ image, onClose }) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoom(z => Math.min(z + 0.2, 3));
      } else if (e.key === '-') {
        e.preventDefault();
        setZoom(z => Math.max(z - 0.2, 0.5));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="image-zoom-overlay" onClick={onClose}>
      <div className="image-zoom-container" onClick={e => e.stopPropagation()}>
        <img 
          src={image} 
          alt="Zoomed" 
          className="image-zoom-img"
          style={{ transform: `scale(${zoom})` }}
        />
        <div className="image-zoom-controls">
          <button className="image-zoom-btn" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>
            - 缩小
          </button>
          <button className="image-zoom-btn" onClick={() => setZoom(z => Math.min(z + 0.2, 3))}>
            + 放大
          </button>
          <button className="image-zoom-btn" onClick={() => setZoom(1)}>
            重置
          </button>
          <button className="image-zoom-btn" onClick={onClose}>
            关闭 (ESC)
          </button>
        </div>
        <div className="image-zoom-info">
          当前缩放: {Math.round(zoom * 100)}% | 快捷键: + 放大 | - 缩小 | ESC 关闭
        </div>
      </div>
    </div>
  );
}

function App() {
  const [documents, setDocuments] = useState([]);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewDocForm, setShowNewDocForm] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [zoomedImage, setZoomedImage] = useState(null);
  const editorRef = React.createRef();
  const previewRef = React.useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (!isEditing && previewRef.current) {
      const images = previewRef.current.querySelectorAll('img');
      images.forEach(img => {
        img.addEventListener('click', () => handleImageClick(img.src));
      });

      return () => {
        images.forEach(img => {
          img.removeEventListener('click', () => handleImageClick(img.src));
        });
      };
    }
  }, [currentDoc, isEditing]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchDocument = async (id) => {
    try {
      const response = await fetch(`/api/documents/${id}`);
      const data = await response.json();
      setCurrentDoc(data);
      setIsEditing(false);
      setShowNewDocForm(false);
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  const uploadImage = async (file, callback) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok && result.url) {
        callback(result.url, file.name);
      } else {
        alert('图片上传失败: ' + (result.error || '未知错误'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('图片上传失败: ' + error.message);
    }
  };

  const createDocument = async () => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newDocTitle, content: '' })
      });
      const data = await response.json();
      await fetchDocuments();
      setCurrentDoc(data);
      setIsEditing(true);
      setShowNewDocForm(false);
      setNewDocTitle('');
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const updateDocument = async () => {
    if (!currentDoc) return;
    
    try {
      const markdownContent = editorRef.current.getInstance().getMarkdown();
      const response = await fetch(`/api/documents/${currentDoc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: currentDoc.title,
          content: markdownContent
        })
      });
      const data = await response.json();
      setCurrentDoc(data);
      setIsEditing(false);
      await fetchDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const deleteDocument = async (id) => {
    if (!confirm('确定要删除这个文档吗？')) return;
    
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      setCurrentDoc(null);
      await fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      const markdownContent = editorRef.current.getInstance().getMarkdown();
      setCurrentDoc(prev => ({ ...prev, content: markdownContent }));
    }
  };

  const handleImageClick = (src) => {
    setZoomedImage(src);
  };

  const convertMarkdownToHTML = (markdown) => {
    if (!markdown) return '';
    return marked(markdown);
  };

  const truncateHTML = (html, maxLength) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    let text = tempDiv.textContent || tempDiv.innerText || '';
    
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '...';
    }
    
    return text;
  };

  const renderMarkdownPreview = (content) => {
    const html = convertMarkdownToHTML(content);
    return { __html: html };
  };

  return (
    <div className="app">
      {zoomedImage && <ImageZoom image={zoomedImage} onClose={() => setZoomedImage(null)} />}
      <div className="sidebar">
        <h2>文档库</h2>
        <button className="btn-primary" onClick={() => setShowNewDocForm(true)}>
          新建文档
        </button>
        
        {showNewDocForm && (
          <div className="new-doc-form">
            <input
              type="text"
              placeholder="文档标题"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              autoFocus
            />
            <button className="btn-success" onClick={createDocument}>创建</button>
            <button className="btn-secondary" onClick={() => setShowNewDocForm(false)}>取消</button>
          </div>
        )}
        
        <ul className="doc-list">
          {documents.map(doc => (
            <li 
              key={doc.id} 
              className={currentDoc?.id === doc.id ? 'active' : ''}
              onClick={() => fetchDocument(doc.id)}
            >
              <div className="doc-item">
                <span className="doc-title">{doc.title}</span>
                {doc.content && (
                  <div className="doc-preview">
                    {truncateHTML(convertMarkdownToHTML(doc.content), 100)}
                  </div>
                )}
              </div>
              <button 
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDocument(doc.id);
                }}
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="main-content">
        {currentDoc ? (
          <>
            <div className="doc-header">
              <h1>{currentDoc.title}</h1>
              <div className="doc-actions">
                {!isEditing && (
                  <button className="btn-primary" onClick={() => setIsEditing(true)}>
                    编辑
                  </button>
                )}
                {isEditing && (
                  <>
                    <button className="btn-success" onClick={updateDocument}>
                      保存
                    </button>
                    <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                      取消
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="doc-content">
              {isEditing ? (
                <Editor
                  ref={editorRef}
                  initialValue={currentDoc.content}
                  previewStyle="vertical"
                  height="600px"
                  initialEditType="markdown"
                  useCommandShortcut={true}
                  plugins={[codeSyntaxHighlight]}
                  hooks={{
                    addImageBlobHook: uploadImage
                  }}
                  onChange={handleEditorChange}
                />
              ) : (
                <div 
                  ref={previewRef}
                  className="markdown-preview"
                  dangerouslySetInnerHTML={renderMarkdownPreview(currentDoc.content)}
                />
              )}
            </div>
          </>
        ) : (
          <div className="placeholder">
            <p>选择或创建一个文档开始编辑</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
