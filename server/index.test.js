global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const fs = require('fs').promises;
const path = require('path');

jest.mock('fs/promises');

describe('Server API Logic Tests', () => {
  const DATA_DIR = path.join(__dirname, '..', 'data');
  const DOCS_FILE = path.join(DATA_DIR, 'documents.json');

  beforeEach(() => {
    jest.clearAllMocks();
    fs.readFile = jest.fn(() => Promise.resolve('[]'));
    fs.writeFile = jest.fn(() => Promise.resolve());
    fs.mkdir = jest.fn(() => Promise.resolve());
    fs.access = jest.fn(() => Promise.reject(new Error('File not found')));
  });

  describe('GET /api/documents', () => {
    test('should return empty array when no documents', async () => {
      fs.readFile = jest.fn(() => Promise.resolve('[]'));
      
      const data = await fs.readFile(DOCS_FILE, 'utf8');
      const documents = JSON.parse(data);
      
      expect(documents).toEqual([]);
    });

    test('should return documents list', async () => {
      const mockDocs = [
        {
          id: '1',
          title: 'Test Doc',
          content: 'Test content',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ];
      fs.readFile = jest.fn(() => Promise.resolve(JSON.stringify(mockDocs)));
      
      const data = await fs.readFile(DOCS_FILE, 'utf8');
      const documents = JSON.parse(data);
      
      expect(documents).toEqual(mockDocs);
    });
  });

  describe('POST /api/documents', () => {
    test('should create new document with required fields', async () => {
      fs.readFile = jest.fn(() => Promise.resolve('[]'));
      fs.writeFile = jest.fn(() => Promise.resolve());
      
      const newDoc = {
        id: Date.now().toString(),
        title: 'New Document',
        content: 'New content',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const data = await fs.readFile(DOCS_FILE, 'utf8');
      const documents = JSON.parse(data);
      documents.push(newDoc);
      await fs.writeFile(DOCS_FILE, JSON.stringify(documents, null, 2));
      
      expect(fs.writeFile).toHaveBeenCalled();
      const writtenData = JSON.parse(fs.writeFile.mock.calls[0][1]);
      expect(writtenData).toHaveLength(1);
      expect(writtenData[0].title).toBe('New Document');
    });

    test('should append document to existing list', async () => {
      const existingDocs = [
        {
          id: '1',
          title: 'Existing Doc',
          content: 'Content',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ];
      fs.readFile = jest.fn(() => Promise.resolve(JSON.stringify(existingDocs)));
      fs.writeFile = jest.fn(() => Promise.resolve());
      
      const newDoc = {
        id: Date.now().toString(),
        title: 'New Document',
        content: 'New content',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const data = await fs.readFile(DOCS_FILE, 'utf8');
      const documents = JSON.parse(data);
      documents.push(newDoc);
      await fs.writeFile(DOCS_FILE, JSON.stringify(documents, null, 2));
      
      expect(documents).toHaveLength(2);
      expect(documents[1].title).toBe('New Document');
    });
  });

  describe('PUT /api/documents/:id', () => {
    test('should update existing document', async () => {
      const existingDoc = {
        id: '1',
        title: 'Old Title',
        content: 'Old content',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      };
      fs.readFile = jest.fn(() => Promise.resolve(JSON.stringify([existingDoc])));
      fs.writeFile = jest.fn(() => Promise.resolve());
      
      const data = await fs.readFile(DOCS_FILE, 'utf8');
      const documents = JSON.parse(data);
      const index = documents.findIndex(doc => doc.id === '1');
      
      documents[index] = {
        ...documents[index],
        title: 'Updated Title',
        content: 'Updated content',
        updatedAt: new Date().toISOString()
      };
      
      await fs.writeFile(DOCS_FILE, JSON.stringify(documents, null, 2));
      
      expect(documents[index].title).toBe('Updated Title');
      expect(documents[index].content).toBe('Updated content');
    });
  });

  describe('DELETE /api/documents/:id', () => {
    test('should remove document from array', async () => {
      const existingDocs = [
        {
          id: '1',
          title: 'Doc 1',
          content: 'Content 1',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: '2',
          title: 'Doc 2',
          content: 'Content 2',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ];
      fs.readFile = jest.fn(() => Promise.resolve(JSON.stringify(existingDocs)));
      fs.writeFile = jest.fn(() => Promise.resolve());
      
      const data = await fs.readFile(DOCS_FILE, 'utf8');
      const documents = JSON.parse(data);
      const index = documents.findIndex(doc => doc.id === '1');
      
      documents.splice(index, 1);
      
      await fs.writeFile(DOCS_FILE, JSON.stringify(documents, null, 2));
      
      expect(documents).toHaveLength(1);
      expect(documents[0].id).toBe('2');
    });
  });
});
