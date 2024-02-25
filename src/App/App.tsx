import { useEffect, useState } from "react";
import { Tetris, Grid } from "../tetrisImpl";
import { GameGrid } from "./GameGrid/GameGrid";
import { GameControls } from "./GameControls/GameControls";
import { GameStats } from "./GameStats/GameStats";
import "./App.less";

function App() {
  const [tetrisInstance, setTetrisInstance] = useState<Tetris>();
  const [grid, setGrid] = useState<Grid>([]);
  const [nextFigureGrid, setNextFigureGrid] = useState<Grid>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);

  useEffect(() => {
    const tetris = new Tetris({
      width: 10,
      height: 20,
      nextFigureGridWidth: 4,
      nextFigureGridHeight: 4,
      onNewFrame: () => {
        setGrid([...tetris.grid]);
        setNextFigureGrid(tetris.nextFigureGrid);
        setIsPaused(tetris.isPaused);
        setIsGameOver(tetris.isGameOver);
        setLevel(tetris.level);
        setScore(tetris.score);
        setLines(tetris.lines);
      }
    });
    
    tetris.startNewGame();

    setGrid(tetris.grid);
    setNextFigureGrid(tetris.nextFigureGrid);
    setTetrisInstance(tetris);

    return () => {
      tetris.destroy();
    }
  }, []);

  function renderGameOverlay() {
    let text = "";

    if (isGameOver) {
      text = "GAME OVER";
    } else if (isPaused) {
      text = "PAUSE";
    }

    return text && (
      <div className="game-overlay">
        <div className="overlay-text">{text}</div>
      </div>
    );
  }

  return tetrisInstance && (
    <div className="tetris">
      <div className="game-screen">
        <GameGrid grid={grid} cellSize={30} />
        {renderGameOverlay()}
      </div>
      <div className="control-panel">
        <div className="next-figure">
          <header>NEXT</header>
          <GameGrid grid={nextFigureGrid} cellSize={20} />
        </div>
        <hr/>
        <GameControls tetris={tetrisInstance} />
        <hr/>
        <GameStats level={level} score={score} lines={lines} />
      </div>
    </div>
  );
}

export default App
