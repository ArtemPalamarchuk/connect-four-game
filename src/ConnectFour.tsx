import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
} from '@mui/material';

type Player = 'red' | 'black' | null;
type Board = Player[][];
type GameStatus = 'playing' | 'won';

const ROWS = 4;
const COLS = 4;
const EMPTY_BOARD: Board = Array(ROWS)
  .fill(null)
  .map(() => Array(COLS).fill(null));

// Theme with blue primary color (change to purple or green by uncommenting desired line)
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f91e3', // blue
      // main: '#9c27b0', // purple
      // main: '#4caf50', // green
    },
  },
});

const ConnectFour: React.FC = () => {
  const [board, setBoard] = useState<Board>(EMPTY_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('red');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winner, setWinner] = useState<Player>(null);

  // Check for win condition
  const checkWin = useCallback(
    (board: Board, row: number, col: number, player: Player): boolean => {
      const directions = [
        [0, 1], // horizontal
        [1, 0], // vertical
        [1, 1], // diagonal \
        [1, -1], // diagonal /
      ];

      for (const [deltaRow, deltaCol] of directions) {
        let count = 1;

        // Check positive direction
        for (let i = 1; i < 4; i++) {
          const newRow = row + deltaRow * i;
          const newCol = col + deltaCol * i;
          if (
            newRow >= 0 &&
            newRow < ROWS &&
            newCol >= 0 &&
            newCol < COLS &&
            board[newRow][newCol] === player
          ) {
            count++;
          } else {
            break;
          }
        }

        // Check negative direction
        for (let i = 1; i < 4; i++) {
          const newRow = row - deltaRow * i;
          const newCol = col - deltaCol * i;
          if (
            newRow >= 0 &&
            newRow < ROWS &&
            newCol >= 0 &&
            newCol < COLS &&
            board[newRow][newCol] === player
          ) {
            count++;
          } else {
            break;
          }
        }

        if (count >= 4) {
          return true;
        }
      }

      return false;
    },
    []
  );

  // Drop piece in column
  const dropPiece = useCallback(
    (col: number) => {
      if (gameStatus === 'won') return;

      // Find the lowest available row in the column
      let targetRow = -1;
      for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === null) {
          targetRow = row;
          break;
        }
      }

      // Column is full
      if (targetRow === -1) return;

      // Create new board with the dropped piece
      const newBoard = board.map((row) => [...row]);
      newBoard[targetRow][col] = currentPlayer;

      // Check for win
      if (checkWin(newBoard, targetRow, col, currentPlayer)) {
        setGameStatus('won');
        setWinner(currentPlayer);
      } else {
        // Switch player
        setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
      }

      setBoard(newBoard);
    },
    [board, currentPlayer, gameStatus, checkWin]
  );

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(EMPTY_BOARD);
    setCurrentPlayer('red');
    setGameStatus('playing');
    setWinner(null);
  }, []);

  // Get piece icon
  const getPieceIcon = (piece: Player): string => {
    switch (piece) {
      case 'red':
        return '🔴';
      case 'black':
        return '⚫';
      default:
        return '⬜';
    }
  };

  // Check if column is full
  const isColumnFull = (col: number): boolean => {
    return board[0][col] !== null;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header section */}
        <Box sx={{ mt: 4 }}>
          {/* Title */}
          <Typography component="h1" variant="h2" sx={{ textAlign: 'center' }}>
            Connect Four!
          </Typography>

          {/* Description */}
          <Typography component="h2" variant="h6" sx={{ textAlign: 'center' }}>
            Get four of the same color in a row to win!
          </Typography>
        </Box>

        {/* Game content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {gameStatus === 'won' && (
            <Typography variant="h5" sx={{ mb: 2 }}>
              Winner is {getPieceIcon(winner)}!
            </Typography>
          )}

          {/* Game board container */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              width: '100%',
              px: '7%',
            }}
          >
            {/* Drop buttons */}
            <Grid container sx={{ justifyContent: 'space-between' }}>
              {Array.from({ length: COLS }, (_, col) => (
                <Box
                  key={col}
                  sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                >
                  <Button
                    variant="text"
                    onClick={() => dropPiece(col)}
                    disabled={gameStatus === 'won' || isColumnFull(col)}
                    sx={{
                      height: '50px',
                      fontSize: '1.6rem',
                      minWidth: 'unset',
                      width: '100%',
                      '&:not(:disabled):hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)',
                      },
                    }}
                  >
                    {getPieceIcon(currentPlayer)}
                  </Button>
                </Box>
              ))}
            </Grid>

            {/* Game board using MUI Grid - на всю ширину */}
            <Paper sx={{ width: '100%' }}>
              {board.map((row, rowIndex) => (
                <Grid
                  container
                  key={rowIndex}
                  sx={{ justifyContent: 'space-between' }}
                >
                  {row.map((cell, colIndex) => (
                    <Box
                      key={`${rowIndex}-${colIndex}`}
                      sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        border: '1px solid',
                        borderColor: 'primary.main',
                      }}
                    >
                      <Box
                        sx={{
                          height: '50px',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.6rem',
                        }}
                      >
                        {getPieceIcon(cell)}
                      </Box>
                    </Box>
                  ))}
                </Grid>
              ))}
            </Paper>

            {/* Reset/New Game Button */}
            <Button
              color="primary"
              onClick={resetGame}
              size="large"
              sx={{
                width: 'fit-content',
                fontSize: '16px',
                mt: 2,
                mx: 'auto',
              }}
            >
              {gameStatus === 'won' ? 'New Game' : 'Reset Board'}
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ConnectFour;
