import { useEffect, useRef, useState } from "react";
import { FigureMoveDirection, Tetris, Figure } from "../tetrisImpl";
import { DebugMenu } from "./DebugMenu/DebugMenu";
import "./App.less";

function App() {
  const tetrisRef = useRef<Tetris>();

  const [grid, setGrid] = useState<(Figure | null)[][]>([]);
  const [nextFigurePreview, setNextFigurePreview] = useState<(Figure | null)[][]>([]);
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

  function getCellClassName(brick: Figure | null): string {
    const type = brick ? `type-${brick.type}` : "empty";
    return `cell ${type}`;
  }

  return (
    <div className="tetris">

      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <div
                className={getCellClassName(cell)}
                key={cellIndex}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="control-panel">
        
        <div className="next-figure">
          {nextFigurePreview.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: "flex" }}>
              {row.map((cell, cellIndex) => (
                <div key={cellIndex}>{cell ? 1 : 0}</div>
              ))}
            </div>
          ))}
        </div>

        {tetrisRef.current && (
          <DebugMenu tetris={tetrisRef.current} />
        )}
      </div>
    </div>
  );
}

export default App
