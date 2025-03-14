# ai-chess

This is a chess application built with Next.js, designed for users to play against an AI opponent. The AI is powered by the minimax algorithm with alpha-beta pruning. The AI implementation is based on resources by Lauri Hartikka in this [freeCodeCamp article](https://www.freecodecamp.org/news/simple-chess-ai-step-by-step-1d55a9266977/) and in this [GitHub repository](https://github.com/lhartikk/simple-chess-ai).

### Libraries and Resources Used

- [**chess.js**](https://www.npmjs.com/package/chess.js/v/1.0.0-beta.8): Handles the core chess logic, including rules, move validation, and game state management.
- [**react-chessboard**](https://www.npmjs.com/package/react-chessboard): Used to render the chessboard and manage interactions like piece movement.
- [Chess.com forum post by Madoby](https://www.chess.com/forum/view/general/chessboard-sound-files?page=2#comment-89885805): Provides the sound effects for various in-game actions, including moves, captures, and checkmates.

---

## Features

- **Play as White or Black**: Choose your side before starting a game.
- **AI Difficulty Levels**: Select from three levels of difficulty—Easy, Medium, and Hard (based on algorithm depth). You can also adjust the difficulty during the game.
- **Undo Moves**: Go back and try different moves with the Undo feature.
- **Sound Effects**: Audio feedback for moves, captures, checkmates, and more.
- **Responsive Design**: Adaption to different screen sizes.

---

## Running the application

The application can also be tested on my [homepage](https://salonenteemu.fi/projects/ai-chess-app) as it is one of the projects there.

Install the required dependencies with: `npm install`

Start the development server with: `npm run dev`

Open the application in a browser at: `http://localhost:3000/`
