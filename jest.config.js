module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@toast-ui/editor/dist/toastui-editor.css$': '<rootDir>/__mocks__/cssMock.js',
    '^@toast-ui/react-editor$': '<rootDir>/__mocks__/@toast-ui/react-editor.js',
    '^@toast-ui/editor-plugin-code-syntax-highlight$': '<rootDir>/__mocks__/@toast-ui/editor-plugin-code-syntax-highlight.js',
    '^marked$': '<rootDir>/__mocks__/marked.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@toast-ui)/)'
  ],
  testMatch: [
    '<rootDir>/client/**/*.test.{js,jsx}',
    '<rootDir>/server/**/*.test.{js,jsx}'
  ],
  collectCoverageFrom: [
    'client/**/*.{js,jsx}',
    'server/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**'
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testTimeout: 10000
};
