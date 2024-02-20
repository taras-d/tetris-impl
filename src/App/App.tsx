import { useEffect, useState } from "react";
import { Tetris, Grid } from "../tetrisImpl";
import { GameGrid } from "./GameGrid/GameGrid";
import { GameControls } from "./GameControls/GameControls";
import "./App.less";

function App() {
  const [tetrisInstance, setTetrisInstance] = useState<Tetris>();
  const [grid, setGrid] = useState<Grid>([]);
  const [nextFigurePreview, setNextFigurePreview] = useState<Grid>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const tetris = new Tetris({
      width: 10,
      height: 20,
      onNewFrame: () => {
        setGrid([...tetris.grid]);
        setNextFigurePreview(tetris.nextFigurePreview);
        setIsPaused(tetris.isPaused);
        setIsGameOver(tetris.isGameOver);
      }
    });
    tetris.startNewGame();

    setGrid(tetris.grid);
    setNextFigurePreview(tetris.nextFigurePreview);
    setTetrisInstance(tetris);

    return () => {
      tetris.destroy();
    }
  }, []);

  return tetrisInstance && (
    <div className="tetris">
      <GameGrid grid={grid} cellSize={30} />
      <div className="control-panel">
        <div className="next-figure">
          <header>NEXT</header>
          <GameGrid grid={nextFigurePreview} cellSize={20} />
        </div>
        <hr/>
        <GameControls tetris={tetrisInstance} />
        <hr/>
        {/* GameStats */}
      </div>
    </div>
  );
}

export default App
