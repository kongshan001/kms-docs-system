const React = require('react');

module.exports = {
  Editor: () => React.createElement('div', { 'data-testid': 'editor' }, 'Mock Editor'),
  Viewer: () => React.createElement('div', { 'data-testid': 'viewer' }, 'Mock Viewer')
};
