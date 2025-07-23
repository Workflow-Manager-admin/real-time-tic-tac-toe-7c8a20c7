import React, { useState, useEffect } from "react";
import "./App.css";

// Color palette variables
const COLORS = {
  primary: "#0D47A1",
  secondary: "#1976D2",
  accent: "#FFC107",
  gridBg: "#f8f9fa",
  xMark: "#0D47A1",
  oMark: "#FFC107",
  border: "#e9ecef",
  scoreX: "#0D47A1",
  scoreO: "#FFC107",
};

const initialBoard = Array(9).fill(null);

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

// PUBLIC_INTERFACE
function App() {
  /**
   * React Tic Tac Toe App (Minimalist, Modern, Responsive, Two-Player Local)
   * - 3x3 grid, header, score panel, restart, minimalistically styled.
   */
  // Game state
  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [status, setStatus] = useState("");
  const [gameOver, setGameOver] = useState(false);

  // On every turn/game update, check winner/draw
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setStatus(`Winner: ${winner}`);
      setGameOver(true);
      setScores((prev) => ({
        ...prev,
        [winner]: prev[winner] + 1,
      }));
    } else if (board.every((sq) => sq !== null)) {
      setStatus("Draw!");
      setGameOver(true);
    } else {
      setStatus(`Next: ${isXNext ? "X" : "O"}`);
      setGameOver(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (board[idx] !== null || gameOver) return;
    const boardCopy = [...board];
    boardCopy[idx] = isXNext ? "X" : "O";
    setBoard(boardCopy);
    setIsXNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(initialBoard);
    setIsXNext(true);
    setStatus("Next: X");
    setGameOver(false);
  }

  // PUBLIC_INTERFACE
  function handleFullReset() {
    setScores({ X: 0, O: 0 });
    handleRestart();
  }

  // Render
  return (
    <div className="ttt-root">
      <div className="ttt-container">
        <Header />
        <ScorePanel scores={scores} />
        <StatusPanel status={status} />
        <GameGrid
          board={board}
          onSquareClick={handleSquareClick}
          gameOver={gameOver}
        />
        <Actions
          onRestart={handleRestart}
          onFullReset={handleFullReset}
          gameOver={gameOver}
        />
        <Footer />
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function Header() {
  /** Game header/title **/
  return (
    <div className="ttt-header">
      <h1>Tic Tac Toe</h1>
      <h2 className="ttt-subtitle">Minimal Two-Player Game</h2>
    </div>
  );
}

// PUBLIC_INTERFACE
function ScorePanel({ scores }) {
  /** Displays player scores (above grid) */
  return (
    <div className="ttt-score-panel">
      <div className="ttt-score ttt-x" title="Player X">
        <span>X</span>
        <span className="ttt-score-value">{scores.X}</span>
      </div>
      <div className="ttt-score ttt-o" title="Player O">
        <span>O</span>
        <span className="ttt-score-value">{scores.O}</span>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function StatusPanel({ status }) {
  /** Shows turn status/win/draw indicators */
  return <div className="ttt-status">{status}</div>;
}

// PUBLIC_INTERFACE
function GameGrid({ board, onSquareClick, gameOver }) {
  /** Renders 3x3 grid of squares for interaction */
  return (
    <div className="ttt-grid" aria-label="Tic Tac Toe Game Grid">
      {board.map((cell, idx) => (
        <Square
          key={idx}
          value={cell}
          onClick={() => onSquareClick(idx)}
          highlight={false}
          disabled={!!cell || gameOver}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, disabled }) {
  /** Single square in the grid */
  return (
    <button
      className={`ttt-square ${value === "X" ? "ttt-x" : value === "O" ? "ttt-o" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Square ${value ? value : "empty"}`}
      tabIndex={0}
      type="button"
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Actions({ onRestart, onFullReset, gameOver }) {
  /** Action buttons below the grid */
  return (
    <div className="ttt-actions">
      <button className="ttt-btn ttt-btn-accent" onClick={onRestart}>
        Restart Round
      </button>
      <button className="ttt-btn ttt-btn-secondary" onClick={onFullReset}>
        Reset Scores
      </button>
      {gameOver && (
        <span className="ttt-hint">Start a new round!</span>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function Footer() {
  /** Credits/footer */
  return (
    <div className="ttt-footer">
      <span>
        Minimal Tic Tac Toe &middot;{" "}
        <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">
          React
        </a>
      </span>
    </div>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(board) {
  /** Finds winner, returns "X", "O", or null */
  for (let combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }
  return null;
}

export default App;
