import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders heading', () => {
  render(<App />);
  const linkElement = screen.getByText(/not the real Wordle/i);
  expect(linkElement).toBeInTheDocument();
});
