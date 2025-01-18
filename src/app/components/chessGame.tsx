"use client";

import { useState, useCallback, useEffect } from "react";
import { Chess, WHITE, BLACK } from "chess.js";
import { Chessboard } from "react-chessboard";
import { minimaxRoot } from "../utils/utils";

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState("Game in progress.");
  const [history, setHistory] = useState([game.fen()]);
  const [difficulty, setDifficulty] = useState(2); // 1: Easy, 2: Medium, 3: Hard
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white"); // Default to white
  const [gameStarted, setGameStarted] = useState(false); // Track if the game has started

  const updateBoardWidth = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth * 0.37;
    }
    return 600;
  };
  const [boardWidth, setBoardWidth] = useState(updateBoardWidth());

  useEffect(() => {
    const handleResize = () => {
      setBoardWidth(updateBoardWidth());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const makeAMove = useCallback(
    (move: any) => {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      if (result) {
        setGame(gameCopy);
        setHistory([...history, gameCopy.fen()]);
      }
      return result;
    },
    [game, history]
  );

  const makeAIMove = useCallback(
    (gameState: Chess) => {
      if (gameState.isGameOver()) return;
      if (
        (playerColor === "white" && gameState.turn() !== BLACK) ||
        (playerColor === "black" && gameState.turn() !== WHITE)
      ) {
        return;
      }

      const bestMove = getBestMove(gameState);
      makeAMove(bestMove);
    },
    [makeAMove, playerColor]
  );

  const getBestMove = (game: Chess) => {
    if (game.isGameOver()) return;
    return minimaxRoot(difficulty, game, playerColor === "white");
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (game.turn() !== WHITE && playerColor === "white") return false;
    if (game.turn() !== BLACK && playerColor === "black") return false;

    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) return false;
    return true;
  };

  const updateStatus = (gameState: Chess) => {
    if (gameState.isCheckmate()) setStatus("Checkmate! Game over.");
    else if (gameState.isDraw()) setStatus("It's a draw.");
    else if (gameState.isCheck()) setStatus("Check!");
    else setStatus("Game in progress.");
  };

  useEffect(() => {
    if (gameStarted) {
      updateStatus(game);
      if (
        (playerColor === "white" && game.turn() === BLACK) ||
        (playerColor === "black" && game.turn() === WHITE)
      ) {
        setTimeout(() => {
          makeAIMove(game);
        }, 500);
      }
    }
  }, [game, gameStarted, makeAIMove, playerColor]);

  const startNewGame = (color: "white" | "black") => {
    const newGame = new Chess();
    setPlayerColor(color);
    setGame(newGame);
    setHistory([newGame.fen()]);
    setGameStarted(true);
    setStatus("Game in progress.");

    if (color === "black") {
      setTimeout(() => {
        makeAIMove(newGame);
      }, 500);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
  };

  const undoMove = useCallback(() => {
    if (history.length > 2) {
      history.pop();
      history.pop();
      const previousFen = history[history.length - 1];
      const newGame = new Chess(previousFen);
      setGame(newGame);
      setHistory([...history]);
    } else {
      setStatus("No moves to undo.");
    }
  }, [history]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-50 selection:bg-lime-500">
      <h1 className="text-4xl font-bold mb-6">Play vs Computer</h1>
      {!gameStarted ? (
        <div className="flex flex-col items-center">
          <p className="text-lg mb-4">Choose your color to start:</p>
          <div className="flex space-x-4">
            <button
              className="bg-lime-500 text-slate-950 px-4 py-2 rounded-md shadow hover:bg-lime-600"
              onClick={() => startNewGame("white")}>
              Play as White
            </button>
            <button
              className="bg-yellow-500 text-slate-950 px-4 py-2 rounded-md shadow hover:bg-yellow-600"
              onClick={() => startNewGame("black")}>
              Play as Black
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md shadow ${
                difficulty === 1
                  ? "bg-lime-500 text-slate-950"
                  : "bg-gray-700 text-white"
              }`}
              onClick={() => setDifficulty(1)}>
              Easy
            </button>
            <button
              className={`px-4 py-2 rounded-md shadow ${
                difficulty === 2
                  ? "bg-lime-500 text-slate-950"
                  : "bg-gray-700 text-white"
              }`}
              onClick={() => setDifficulty(2)}>
              Medium
            </button>
            <button
              className={`px-4 py-2 rounded-md shadow ${
                difficulty === 3
                  ? "bg-lime-500 text-slate-950"
                  : "bg-gray-700 text-white"
              }`}
              onClick={() => setDifficulty(3)}>
              Hard
            </button>
          </div>
          <div className="shadow-lg p-2 rounded-md">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              boardWidth={boardWidth}
              arePiecesDraggable={
                (playerColor === "white" && game.turn() === WHITE) ||
                (playerColor === "black" && game.turn() === BLACK)
              }
              boardOrientation={playerColor}
              customBoardStyle={{ borderRadius: "4px" }}
            />
          </div>
          <p className="mt-4 text-lg">{status}</p>
          <div className="mt-4 flex space-x-4">
            <button
              className="bg-lime-500 text-slate-950 px-4 py-2 rounded-md shadow hover:bg-lime-600"
              onClick={() => resetGame()}>
              New Game
            </button>
            <button
              className="bg-yellow-500 text-slate-950 px-4 py-2 rounded-md shadow hover:bg-yellow-600"
              onClick={undoMove}>
              Undo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
