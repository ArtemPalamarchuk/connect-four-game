# Connect Four Game

A React-based implementation of the classic Connect Four game built with TypeScript, Material-UI, and Vite.

## Getting Started

## Prerequisites:
- Node.js (v16 or higher)
- npm

## Installation & Running:
```bash
npm install
npm run dev
npm test
npm run build
```

## How to Play

1. Players take turns dropping pieces into columns
2. Click on a column button to drop your piece  
3. Get 4 pieces in a row (horizontally, vertically, or diagonally) to win
4. Use the Reset/New Game button to start over

## Game Rules

- Red player always goes first
- Pieces fall to the lowest available spot in a column
- Columns become disabled when full
- Game ends when a player gets 4 in a row
- Winner is displayed and no more moves are allowed

## Theme Customization

The game supports different color themes. To change the primary color, 
modify the theme in App.tsx:
main: '#3f91e3'  // blue (default)
main: '#9c27b0'  // purple
main: '#4caf50'  // green

## Tech Stack

- React 18 with hooks
- TypeScript for type safety
- Material-UI (MUI) for components and styling
- Vite for fast development and building
- Vitest + React Testing Library for testing
