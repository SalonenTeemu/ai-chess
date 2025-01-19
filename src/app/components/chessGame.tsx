"use client";

import { useState, useCallback, useEffect } from "react";
import { Chess, WHITE, BLACK } from "chess.js";
import { Chessboard } from "react-chessboard";
import { minimaxRoot, getNotificationStyle, playSound } from "../utils/utils";

/**
 * The ChessGame component.
 *
 * @returns The ChessGame component.
 */
export default function ChessGame() {
  const [game, setGame] = useState(new Chess()); // The game state
  const [status, setStatus] = useState("Game in progress."); // The game status to show
  const [history, setHistory] = useState([game.fen()]); // History of moves
  const [difficulty, setDifficulty] = useState(2); // 1: Easy, 2: Medium, 3: Hard
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white"); // Default to white
  const [gameStarted, setGameStarted] = useState(false); // Track if the game has started
  const [notification, setNotification] = useState<{
    message: string;
    type: string;
  }>({ message: "", type: "" }); // Notification with type

  /**
   * Updates the width of the chessboard based on the window size.
   *
   * @returns The width of the chessboard based on the window size.
   */
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

  /**
   * Makes a move on the board, updates the game state, history and plays a sound effect.
   */
  const makeAMove = useCallback(
    (move: any) => {
      const gameCopy = new Chess(game.fen());
      try {
        const result = gameCopy.move(move);
        if (!gameCopy.isGameOver()) {
          if (gameCopy.inCheck()) {
            playSound("move-check");
          } else if (result?.promotion) {
            playSound("promote");
          } else if (result?.captured) {
            playSound("capture");
          } else if (result?.san === "O-O" || result?.san === "O-O-O") {
            playSound("castle");
          } else {
            playSound("move-self");
          }
        }
        setGame(gameCopy);
        setHistory([...history, gameCopy.fen()]);
        return result;
      } catch (error) {
        playSound("illegal");
        setNotification({ message: "Invalid move.", type: "negative" });
        setTimeout(() => setNotification({ message: "", type: "" }), 3000);
        return false;
      }
    },
    [game, history]
  );

  /**
   * Makes a move for the AI based on the difficulty level.
   */
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

  /**
   * Finds the best move for the AI using the minimax algorithm.
   *
   * @param game The game state
   * @returns The best move for the AI
   */
  const getBestMove = (game: Chess) => {
    if (game.isGameOver()) return;
    return minimaxRoot(difficulty, game, playerColor === "white");
  };

  /**
   * Makes a move on the board when a piece is dropped by the player.
   *
   * @param sourceSquare The source square of the piece
   * @param targetSquare The target square of the piece
   * @returns The result of the move (illegal move or not)
   */
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

  /**
   * Updates the game status based on the current game state.
   *
   * @param gameState The current game state
   */
  const updateStatus = (gameState: Chess) => {
    if (gameState.isGameOver()) {
      if (gameState.isDraw()) {
        handleDraw(gameState);
      } else {
        handleWin(gameState);
      }
    } else {
      handleInProgress(gameState);
    }
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  /**
   * Handles the draw scenarios.
   *
   * @param gameState The current game state
   */
  const handleDraw = (gameState: Chess) => {
    if (gameState.isDrawByFiftyMoves()) {
      setStatus("Draw by 50-move rule.");
      setNotification({
        message: "Game is drawn by 50-move rule.",
        type: "neutral",
      });
    } else if (gameState.isInsufficientMaterial()) {
      setStatus("Draw by insufficient material.");
      setNotification({
        message: "Game is drawn by insufficient material.",
        type: "neutral",
      });
    } else if (gameState.isThreefoldRepetition()) {
      setStatus("Draw by repetition.");
      setNotification({
        message: "Game is drawn by repetition.",
        type: "neutral",
      });
    } else if (gameState.isStalemate()) {
      setStatus("Stalemate.");
      setNotification({
        message: "Game is a stalemate.",
        type: "neutral",
      });
    } else {
      setStatus("Game over.");
    }
    playSound("game-end");
  };

  /**
   * Handles the win scenarios.
   *
   * @param gameState The current game state
   */
  const handleWin = (gameState: Chess) => {
    const turn = gameState.turn() === WHITE ? "Black" : "White";
    const turnLowerCase = turn.toLowerCase();
    if (gameState.isCheckmate()) {
      setStatus("Checkmate. " + turn + " wins.");
      setNotification({
        message:
          playerColor === turnLowerCase
            ? "Checkmate. You win!"
            : "Checkmate. " + turn + " wins.",
        type: playerColor === turnLowerCase ? "positive" : "negative",
      });
    }
    playSound("game-end");
  };

  /**
   * Handles the game in progress scenarios.
   *
   * @param gameState The current game state
   */
  const handleInProgress = (gameState: Chess) => {
    const turn = gameState.turn() === WHITE ? "White" : "Black";
    if (gameState.inCheck()) {
      setStatus("Check. " + turn + " is in check.");
    } else {
      setStatus("Game in progress. " + turn + " to move.");
    }
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
        }, 1000);
      }
    }
  }, [game, gameStarted, makeAIMove, playerColor]);

  /**
   * Starts a new game with the selected color.
   *
   * @param color The color of the player
   */
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
      }, 1000);
    }
  };

  /**
   * Resets the game to allow user choose color again.
   */
  const resetGame = () => {
    setGameStarted(false);
  };

  /**
   * Undoes the last move made by the player and AI.
   */
  const undoMove = useCallback(() => {
    if (history.length > 2) {
      history.pop();
      history.pop();
      const previousFen = history[history.length - 1];
      const newGame = new Chess(previousFen);
      setGame(newGame);
      setHistory([...history]);
    } else {
      setNotification({ message: "Cannot undo further.", type: "negative" });
      setTimeout(() => setNotification({ message: "", type: "" }), 3000);
    }
  }, [history]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-50 selection:bg-lime-500">
      <h1 className="text-4xl font-bold mb-3">Play vs Computer</h1>
      {notification.message && (
        <div
          className={`absolute top-0 left-0 right-0 text-center p-2 font-semibold ${getNotificationStyle(
            notification
          )}`}>
          {notification.message}
        </div>
      )}
      {!gameStarted ? (
        <div className="flex flex-col items-center">
          <p className="text-lg mb-4">Choose your color:</p>
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
          <div className="flex space-x-4 mb-3">
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
          <p className="mt-2 text-lg">{status}</p>
          <div className="mt-3 flex space-x-4">
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
