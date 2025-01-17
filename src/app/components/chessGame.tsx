"use client";

import { useState, useCallback, useEffect } from "react";
import { Chess, WHITE, BLACK } from "chess.js";
import { Chessboard } from "react-chessboard";

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState("Game in progress.");

  var reverseArray = function (array: any) {
    return array.slice().reverse();
  };

  var pawnEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
    [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
    [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
    [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
    [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
    [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  ];

  var pawnEvalBlack = reverseArray(pawnEvalWhite);

  var knightEval = [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
    [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
    [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
    [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
    [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
    [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  ];

  var bishopEvalWhite = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  ];

  var bishopEvalBlack = reverseArray(bishopEvalWhite);

  var rookEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
  ];

  var rookEvalBlack = reverseArray(rookEvalWhite);

  var evalQueen = [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  ];

  var kingEvalWhite = [
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
  ];

  var kingEvalBlack = reverseArray(kingEvalWhite);

  var getPieceValue = function (piece: any, x: number, y: number) {
    if (piece === null) {
      return 0;
    }
    var getAbsoluteValue = function (
      piece: any,
      isWhite: boolean,
      x: number,
      y: number
    ) {
      if (piece.type === "p") {
        return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
      } else if (piece.type === "r") {
        return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
      } else if (piece.type === "n") {
        return 30 + knightEval[y][x];
      } else if (piece.type === "b") {
        return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
      } else if (piece.type === "q") {
        return 90 + evalQueen[y][x];
      } else if (piece.type === "k") {
        return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
      }
      throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === "w", x, y);
    return piece.color === "w" ? absoluteValue : -absoluteValue;
  };

  var evaluateBoard = function (game: Chess) {
    const board: any = game.board();
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j);
      }
    }
    return totalEvaluation;
  };

  var minimaxRoot = (depth: number, game: Chess, maximizingPlayer: boolean) => {
    const possibleMoves = game.moves();
    let bestMove = -9999;
    let bestMoveFound;

    for (let i = 0; i < possibleMoves.length; i++) {
      const newGame = new Chess(game.fen()); // Clone the game state
      newGame.move(possibleMoves[i]);

      const value = minimax(
        depth - 1,
        newGame,
        -10000,
        10000,
        !maximizingPlayer
      );

      if (value > bestMove) {
        bestMove = value;
        bestMoveFound = possibleMoves[i];
      }
    }
    return bestMoveFound;
  };

  var minimax = (
    depth: number,
    game: Chess,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean
  ): number => {
    if (depth === 0 || game.isGameOver()) {
      return -evaluateBoard(game);
    }

    const possibleMoves = game.moves();
    if (maximizingPlayer) {
      let maxEval = -9999;
      for (let i = 0; i < possibleMoves.length; i++) {
        const newGame = new Chess(game.fen()); // Clone the game state
        newGame.move(possibleMoves[i]);

        const evalValue = minimax(
          depth - 1,
          newGame,
          alpha,
          beta,
          !maximizingPlayer
        );

        maxEval = Math.max(maxEval, evalValue);
        alpha = Math.max(alpha, maxEval);

        if (beta <= alpha) {
          break;
        }
      }
      return maxEval;
    } else {
      let minEval = 9999;
      for (let i = 0; i < possibleMoves.length; i++) {
        const newGame = new Chess(game.fen()); // Clone the game state
        newGame.move(possibleMoves[i]);

        const evalValue = minimax(
          depth - 1,
          newGame,
          alpha,
          beta,
          !maximizingPlayer
        );

        minEval = Math.min(minEval, evalValue);
        beta = Math.min(beta, minEval);

        if (beta <= alpha) {
          break;
        }
      }
      return minEval;
    }
  };

  // Function to make a move and update the state
  const makeAMove = useCallback(
    (move: any) => {
      console.log(move);
      const gameCopy = new Chess(game.fen()); // Clone the current game state
      const result = gameCopy.move(move); // Attempt the move
      if (result) {
        setGame(gameCopy); // Update the game state if the move was valid
      }
      return result;
    },
    [game]
  );

  // Function to make the best AI move
  const makeAIMove = useCallback(
    (gameState: Chess) => {
      if (gameState.isGameOver()) return;

      if (gameState.turn() !== BLACK) return; // AI only plays when it's black's turn

      const possibleMoves = gameState.moves();
      if (possibleMoves.length === 0) return;

      var bestMove: any = getBestMove(game);

      // Make the best move found
      makeAMove(bestMove);
    },
    [makeAMove]
  );

  var getBestMove = function (game: Chess) {
    if (game.isGameOver()) {
      return;
    }
    var depth = 3;

    console.log(game);
    var bestMove = minimaxRoot(depth, game, true);
    return bestMove;
  };

  // Handle piece drop by the player
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    // Only allow moves if it's the player's (white's) turn
    if (game.turn() !== WHITE) {
      return false;
    }

    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Automatically promote to a queen
    });

    // Illegal move
    if (!move) return false;

    return true;
  };

  // Update the game's status (Checkmate, Draw, Check, etc.)
  const updateStatus = (gameState: Chess) => {
    if (gameState.isCheckmate()) {
      setStatus("Checkmate! Game over.");
    } else if (gameState.isDraw()) {
      setStatus("It's a draw.");
    } else if (gameState.isCheck()) {
      setStatus("Check!");
    } else {
      setStatus("Game in progress.");
    }
  };

  // Trigger AI move after the player's move
  useEffect(() => {
    if (game.turn() === BLACK) {
      setTimeout(() => {
        makeAIMove(game);
      }, 500); // AI takes a little time after the player's move
    }
  }, [game, makeAIMove]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Play Chess</h1>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
      <p className="mt-4 text-lg">{status}</p>
    </div>
  );
};

export default ChessGame;
