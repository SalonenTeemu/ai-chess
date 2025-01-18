"use client";

import { useState, useCallback, useEffect } from "react";
import { Chess, WHITE, BLACK } from "chess.js";
import { Chessboard } from "react-chessboard";
import { minimaxRoot } from "../utils/utils";

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState("Game in progress.");
  const [history, setHistory] = useState([game.fen()]);

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
      if (gameState.turn() !== BLACK) return;

      const bestMove = getBestMove(gameState);
      makeAMove(bestMove);
    },
    [makeAMove]
  );

  const getBestMove = (game: Chess) => {
    if (game.isGameOver()) return;
    const depth = 3;
    return minimaxRoot(depth, game, true);
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (game.turn() !== WHITE) return false;

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
    updateStatus(game);
    if (game.turn() === BLACK) {
      setTimeout(() => {
        makeAIMove(game);
      }, 500);
    }
  }, [game, makeAIMove]);

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setHistory([newGame.fen()]);
    setStatus("Game in progress.");
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
      <div className="shadow-lg p-2 rounded-md">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardWidth={boardWidth}
          customBoardStyle={{ borderRadius: "4px" }}
        />
      </div>
      <p className="mt-4 text-lg">{status}</p>
      <div className="mt-4 flex space-x-4">
        <button
          className="bg-lime-500 text-slate-950 px-4 py-2 rounded-md shadow hover:bg-lime-600"
          onClick={resetGame}>
          New Game
        </button>
        <button
          className="bg-yellow-500 text-slate-950 px-4 py-2 rounded-md shadow hover:bg-yellow-600"
          onClick={undoMove}>
          Undo
        </button>
      </div>
    </div>
  );
}
