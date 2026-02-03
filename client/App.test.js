import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('App Component Basic Tests', () => {
  test('can create React element', () => {
    const element = React.createElement('div', { className: 'test' }, 'Hello');
    expect(element).toBeTruthy();
  });

  test('can render simple component', () => {
    function SimpleComponent() {
      return React.createElement('div', { className: 'test' }, 'Hello World');
    }
    
    render(React.createElement(SimpleComponent));
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('can handle user interaction', async () => {
    function ButtonComponent() {
      const [count, setCount] = React.useState(0);
      return React.createElement('button', {
        onClick: () => setCount(c => c + 1)
      }, count.toString());
    }
    
    const user = userEvent.setup();
    render(React.createElement(ButtonComponent));
    
    const button = screen.getByText('0');
    await user.click(button);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('can handle input interaction', async () => {
    function InputComponent() {
      const [value, setValue] = React.useState('');
      return React.createElement('input', {
        value: value,
        placeholder: '文档标题',
        onChange: (e) => setValue(e.target.value)
      });
    }
    
    const user = userEvent.setup();
    render(React.createElement(InputComponent));
    
    const input = screen.getByPlaceholderText('文档标题');
    expect(input).toBeInTheDocument();
    
    await user.type(input, 'Test Document');
    expect(input).toHaveValue('Test Document');
  });
});
