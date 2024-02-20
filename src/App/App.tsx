import { useEffect, useRef, useState } from "react";
import { FigureMoveDirection, Tetris, Grid } from "../tetrisImpl";
import { DebugMenu } from "./DebugMenu/DebugMenu";
import "./App.less";
import { GameGrid } from "./GameGrid/GameGrid";

function App() {
  const tetrisRef = useRef<Tetris>();

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

    tetrisRef.current = tetris;

    return () => {
      tetris.destruct();
    }
  }, []);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      const map = {
        [FigureMoveDirection.Left]: ["ArrowLeft", "KeyA"],
        [FigureMoveDirection.Right]: ["ArrowRight", "KeyD"],
        [FigureMoveDirection.Down]: ["ArrowDown", "KeyS"],
        [FigureMoveDirection.RotateRight]: ["ArrowUp", "KeyW"],
        [FigureMoveDirection.Drop]: ["Space"],
      };

      const dir = Object.keys(map).find(key => {
        return (map as Record<string, string[]>)[key].includes(event.code);
      });

      if (dir) {
        tetrisRef.current?.moveFigure(dir as FigureMoveDirection);
      }
    }

    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    }
  }, []);

  return (
    <div className="tetris">

      <GameGrid grid={grid} cellSize={30} />

      <div className="control-panel">
        <GameGrid
          grid={nextFigurePreview}
          cellSize={20}
        />
        {tetrisRef.current && (
          <DebugMenu tetris={tetrisRef.current} />
        )}
      </div>
    </div>
  );
}

export default App
