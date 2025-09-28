import React, { useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';
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
const PIECES_TO_WIN = 4;

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f91e3', // blue
      // main: '#9c27b0', // purple
      // main: '#4caf50', // green
    },
  },
});

const GameContainer = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

const HeaderSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  textAlign: 'center',
}));

const GameContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const GameBoardContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  width: '100%',
  paddingLeft: '7%',
  paddingRight: '7%',
});

const DropButton = styled(Button)({
  height: '50px',
  fontSize: '1.6rem',
  minWidth: 'unset',
  width: '100%',
  '&:not(:disabled):hover': {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
});

const GameBoard = styled(Paper)({
  width: '100%',
});

const BoardRow = styled(Grid)({
  justifyContent: 'space-between',
});

const CellContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  border: '1px solid',
  borderColor: theme.palette.primary.main,
}));

const BoardCell = styled(Box)({
  height: '50px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.6rem',
});

const ResetButton = styled(Button)(({ theme }) => ({
  width: 'fit-content',
  fontSize: '16px',
  marginTop: theme.spacing(2),
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const DropButtonContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
});

const ConnectFour: React.FC = () => {
  const [board, setBoard] = useState<Board>(EMPTY_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('red');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winner, setWinner] = useState<Player>(null);

  const checkWin = useCallback(
    (board: Board, row: number, col: number, player: Player): boolean => {
      const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

      for (const [deltaRow, deltaCol] of directions) {
        let count = 1;

        for (const direction of [1, -1]) {
          for (let i = 1; i < PIECES_TO_WIN; i++) {
            const newRow = row + deltaRow * i * direction;
            const newCol = col + deltaCol * i * direction;
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
        }

        if (count >= PIECES_TO_WIN) {
          return true;
        }
      }

      return false;
    },
    []
  );

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

      if (targetRow === -1) return;

      const newBoard = board.map((row) => [...row]);
      newBoard[targetRow][col] = currentPlayer;

      if (checkWin(newBoard, targetRow, col, currentPlayer)) {
        setGameStatus('won');
        setWinner(currentPlayer);
      } else {
        setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
      }

      setBoard(newBoard);
    },
    [board, currentPlayer, gameStatus, checkWin]
  );

  const resetGame = useCallback(() => {
    setBoard(EMPTY_BOARD);
    setCurrentPlayer('red');
    setGameStatus('playing');
    setWinner(null);
  }, []);

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

  const isColumnFull = (col: number): boolean => {
    return board[0][col] !== null;
  };

  return (
    <ThemeProvider theme={theme}>
      <GameContainer>
        <HeaderSection>
          <Typography component="h1" variant="h2">
            Connect Four!
          </Typography>
          <Typography component="h2" variant="h6">
            Get four of the same color in a row to win!
          </Typography>
        </HeaderSection>

        <GameContent>
          {gameStatus === 'won' && (
            <Typography variant="h5" sx={{ mb: 2 }}>
              Winner is {getPieceIcon(winner)}!
            </Typography>
          )}

          <GameBoardContainer>
            <Grid container>
              {Array.from({ length: COLS }, (_, col) => (
                <DropButtonContainer key={col}>
                  <DropButton
                    variant="text"
                    onClick={() => dropPiece(col)}
                    disabled={gameStatus === 'won' || isColumnFull(col)}
                  >
                    {getPieceIcon(currentPlayer)}
                  </DropButton>
                </DropButtonContainer>
              ))}
            </Grid>

            <GameBoard>
              {board.map((row, rowIndex) => (
                <BoardRow container key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <CellContainer key={`${rowIndex}-${colIndex}`}>
                      <BoardCell>{getPieceIcon(cell)}</BoardCell>
                    </CellContainer>
                  ))}
                </BoardRow>
              ))}
            </GameBoard>

            <ResetButton color="primary" onClick={resetGame} size="large">
              {gameStatus === 'won' ? 'New Game' : 'Reset Board'}
            </ResetButton>
          </GameBoardContainer>
        </GameContent>
      </GameContainer>
    </ThemeProvider>
  );
};

export default ConnectFour;
