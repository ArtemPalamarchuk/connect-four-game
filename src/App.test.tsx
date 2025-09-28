import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach } from 'vitest';
import App from './App';

const PIECES_TO_WIN = 4;
const ROWS = 4;

describe('App', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('board starts with all empty cells', () => {
    const emptyCells = screen.getAllByText('⬜');
    expect(emptyCells).toHaveLength(ROWS * PIECES_TO_WIN);
  });

  test('renders game title and description', () => {
    expect(screen.getByText('Connect Four!')).toBeInTheDocument();
    expect(
      screen.getByText('Get four of the same color in a row to win!')
    ).toBeInTheDocument();
  });

  test('shows red player icons on all drop buttons initially', () => {
    const dropButtons = screen.getAllByText('🔴');
    expect(dropButtons).toHaveLength(PIECES_TO_WIN);
  });

  test('switches to black player after red move', () => {
    const firstDropButton = screen.getAllByRole('button')[0];
    fireEvent.click(firstDropButton);

    const blackButtons = screen.getAllByText('⚫');
    expect(blackButtons).toHaveLength(PIECES_TO_WIN);
  });

  test('places piece on board after drop', () => {
    const emptyBefore = screen.getAllByText('⬜').length;

    const firstDropButton = screen.getAllByRole('button')[0];
    fireEvent.click(firstDropButton);

    const emptyAfter = screen.getAllByText('⬜').length;
    expect(emptyAfter).toBe(emptyBefore - 1);
  });

  test('resets game when reset button clicked', () => {
    const firstDropButton = screen.getAllByRole('button')[0];
    fireEvent.click(firstDropButton);

    const resetButton = screen.getByText('Reset Board');
    fireEvent.click(resetButton);

    const redButtons = screen.getAllByText('🔴');
    expect(redButtons).toHaveLength(PIECES_TO_WIN);
  });

  test('disables drop buttons in full columns', () => {
    const firstDropButton = screen.getAllByRole('button')[0];

    for (let i = 0; i < ROWS; i++) {
      fireEvent.click(firstDropButton);
    }

    expect(firstDropButton).toBeDisabled();
  });
});
