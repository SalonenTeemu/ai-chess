import { Chess } from "chess.js";

/**
 * Function to reverse an array.
 *
 * @param array Array to reverse
 * @returns The reversed array
 */
const reverseArray = function (array: any) {
  return array.slice().reverse();
};

/**
 * Evaluation table for white pawn at each position on the board.
 */
const pawnEvalWhite = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
  [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
  [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
  [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
  [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
  [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
];

/**
 * Evaluation table for black pawn at each position on the board.
 */
const pawnEvalBlack = reverseArray(pawnEvalWhite);

/**
 * Evaluation table for knight at each position on the board.
 */
const knightEval = [
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
  [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
  [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
  [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
  [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
  [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
];

/**
 * Evaluation table for white bishop at each position on the board.
 */
const bishopEvalWhite = [
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
  [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
  [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
  [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
  [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
];

/**
 * Evaluation table for black bishop at each position on the board.
 */
const bishopEvalBlack = reverseArray(bishopEvalWhite);

/**
 * Evaluation table for white rook at each position on the board.
 */
const rookEvalWhite = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
];

/**
 * Evaluation table for black rook at each position on the board.
 */
const rookEvalBlack = reverseArray(rookEvalWhite);

/**
 * Evaluation table for queen at each position on the board.
 */
const evalQueen = [
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
];

/**
 * Evaluation table for white king at each position on the board.
 */
const kingEvalWhite = [
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
  [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
];

/**
 * Evaluation table for black king at each position on the board.
 */
export const kingEvalBlack = reverseArray(kingEvalWhite);

/**
 * Calculate the value of a piece at a given position on the board.
 *
 * @param piece The piece to evaluate
 * @param x The x position of the piece
 * @param y The y position of the piece
 * @returns The value of the piece at the given position
 */
export const getPieceValue = function (piece: any, x: number, y: number) {
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
    } else {
      console.log("Unknown piece type: " + piece.type);
    }
  };

  var absoluteValue = getAbsoluteValue(piece, piece.color === "w", x, y);
  return piece.color === "w" ? absoluteValue : -absoluteValue;
};

/**
 * Evaluate the current board state.
 *
 * @param game The current game state
 * @returns The evaluation of the current board state
 */
export const evaluateBoard = function (game: Chess) {
  const board: any = game.board();
  var totalEvaluation = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j);
    }
  }
  return totalEvaluation;
};

/**
 * Calculate the best move using the minimax algorithm.
 *
 * @param depth The depth of the minimax algorithm
 * @param game The current game state
 * @param maximizingPlayer If to maximize the player
 * @returns The best move
 */
export const minimaxRoot = (
  depth: number,
  game: Chess,
  maximizingPlayer: boolean
) => {
  const possibleMoves = game.moves();
  let bestMove = -9999;
  let bestMoveFound;

  for (let i = 0; i < possibleMoves.length; i++) {
    const newGame = new Chess(game.fen()); // Clone the game state
    newGame.move(possibleMoves[i]);

    const value = minimax(depth - 1, newGame, -10000, 10000, !maximizingPlayer);

    if (value > bestMove) {
      bestMove = value;
      bestMoveFound = possibleMoves[i];
    }
  }
  return bestMoveFound;
};

/**
 * The minimax algorithm with alpha-beta pruning.
 *
 * @param depth The depth of the minimax algorithm
 * @param game The current game state
 * @param alpha The alpha value
 * @param beta The beta value
 * @param maximizingPlayer If to maximize the player
 * @returns The evaluation of the current board state
 */
const minimax = (
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

/**
 * Get the style for the notification based on the type.
 *
 * @returns The style for the notification based on the type.
 */
export const getNotificationStyle = function (notification: any) {
  switch (notification.type) {
    case "positive":
      return "bg-green-500 text-slate-50";
    case "neutral":
      return "bg-yellow-500 text-slate-50";
    case "negative":
      return "bg-red-500 text-slate-50";
    default:
      return "";
  }
};

/**
 * Play a sound effect related to the game.
 *
 * @param sound The sound to play
 */
export const playSound = function (sound: string) {
  const audio = new Audio(`/audio/${sound}.mp3`);
  audio.play();
};
