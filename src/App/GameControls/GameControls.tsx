import { useEffect } from "react";
import { FigureMoveDirection, Tetris } from "../../tetrisImpl";
import "./GameControls.less";

interface GameControlsProps {
  tetris: Tetris;
}

export function GameControls({ tetris }: GameControlsProps) {

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      controlHandler(event.code);
    }
    window.addEventListener("keydown", keyDownHandler);
    return () => window.removeEventListener("keydown", keyDownHandler);
  }, []);

  function buttonClickHander(event: React.MouseEvent): void {
    const el = event.target;
    if (el instanceof HTMLButtonElement && el.name.startsWith("control-")) {
      el.blur();
      controlHandler(el.name.replace("control-", ""));
    }
  }

  function controlHandler(keyCode: string): void {
    switch (keyCode) {
      case "KeyW":
      case "ArrowUp":
        tetris.moveFigure(FigureMoveDirection.RotateRight);
        break;

      case "KeyA":
      case "ArrowLeft":
        tetris.moveFigure(FigureMoveDirection.Left);
        break;

      case "KeyS":
      case "ArrowDown":
        tetris.moveFigure(FigureMoveDirection.Down);
        break;

      case "KeyD":
      case "ArrowRight":
        tetris.moveFigure(FigureMoveDirection.Right);
        break;

      case "Space":
        tetris.moveFigure(FigureMoveDirection.Drop);
        break;

      case "KeyP":
        tetris.pause();
        break;

      case "KeyR":
        tetris.startNewGame();
        break;
    }
  }

  return (
    <div className="game-controls" onClick={buttonClickHander}>
      <div className="buttons-row">
        <button name="control-KeyR">RESET</button>
        <button name="control-KeyP">PAUSE</button>
      </div>

      <div className="buttons-row move-buttons">
        <button name="control-KeyA">LEFT</button>
        <div>
          <button name="control-KeyW">ROTATE</button>
          <button name="control-KeyS">DOWN</button>
        </div>
        <button name="control-KeyD">RIGHT</button>
      </div>

      <div className="buttons-row">
        <button name="control-Space">DROP</button>
      </div>

      <div className="keys-info">
        <ul>
          <li>W - Rotate</li>
          <li>A - Left</li>
          <li>S - Down</li>
          <li>D - Right</li>
        </ul>
        <ul>
          <li>Space - Drop</li>
          <li>R - Reset</li>
          <li>P - Pause</li>
        </ul>
      </div>
    </div>
  );
}
