import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Snabbis header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Snabbis/i);
  expect(headerElement).toBeInTheDocument();
});
