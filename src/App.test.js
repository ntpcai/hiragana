import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders the Hiragana title and all 46 kana buttons', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /hiragana/i })).toBeInTheDocument();
  expect(screen.getAllByRole('button')).toHaveLength(46);
});

test('shows the katakana character after a button is pressed', () => {
  render(<App />);

  const button = screen.getByRole('button', { name: 'a (あ)' });
  fireEvent.click(button);

  expect(button).toHaveTextContent('ア');
});

test('returns to the hiragana character shortly after being pressed', () => {
  jest.useFakeTimers();

  try {
    render(<App />);

    const button = screen.getByRole('button', { name: 'a (あ)' });
    fireEvent.click(button);
    expect(button).toHaveTextContent('ア');

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(button).toHaveTextContent('あ');
  } finally {
    jest.useRealTimers();
  }
});
