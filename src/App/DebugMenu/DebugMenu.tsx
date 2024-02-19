import { useState } from "react";
import { FigureMoveDirection, FigureType, Tetris } from "../../tetrisImpl";
import "./DebugMenu.less";

interface DebugMenuProps {
  tetris: Tetris;
}

export function DebugMenu({ tetris }: DebugMenuProps) {
  const [createType, setCreateType] = useState("");

  function handleButtonClick(event: React.MouseEvent): void {
    const target = event.target as HTMLButtonElement;
    target.blur();

    switch (target.name) {
      case "create-figure":
        tetris.createFigure(
          (createType as FigureType) || tetris.getRandomFigureType(),
        );
        break;

      case "reset":
        tetris.startNewGame();
        break;

      case "pause":
        tetris.pause();
        break;

      case "move-figure":
        tetris.moveFigure(target.value as FigureMoveDirection);
        break;
    }
  }

  return (
    <fieldset className="debug-menu">
      <legend>Debug menu</legend>
      <section>
        Figure
        <select value={createType} onChange={e => setCreateType(e.target.value)}>
          <option value="">Random</option>
          {Object.values(FigureType).map(value => (
            <option value={value} key={value}>{value}</option>
          ))}
        </select>
        <button name="create-figure" onClick={handleButtonClick}>Create</button>
      </section>
      <section>
        <button name="reset" onClick={handleButtonClick}>Reset</button>
        <br/>
        <button name="pause" onClick={handleButtonClick}>Toggle pause</button>
      </section>
      <section>
        Move X
        <button
          name="move-figure"
          value={FigureMoveDirection.Left}
          onClick={handleButtonClick}>
          Left
        </button>
        <button
          name="move-figure"
          value={FigureMoveDirection.Right}
          onClick={handleButtonClick}>
          Right
        </button>
      </section>
      <section>
        Move Y
        <button
          name="move-figure"
          value={FigureMoveDirection.Up}
          onClick={handleButtonClick}>
          Up
        </button>
        <button
          name="move-figure"
          value={FigureMoveDirection.Down}
          onClick={handleButtonClick}>
          Down
        </button>
      </section>
      <section>
        Rotate
        <button
          name="move-figure"
          value={FigureMoveDirection.RotateLeft}
          onClick={handleButtonClick}>
          Left
        </button>
        <button
          name="move-figure"
          value={FigureMoveDirection.RotateRight}
          onClick={handleButtonClick}>
          Right
        </button>
      </section>
      <section>
        <button
          name="move-figure"
          value={FigureMoveDirection.Drop}
          onClick={handleButtonClick}>
          Drop figure
        </button>
      </section>
      <section>
        Is game over: {tetris.isGameOver ? "Yes" : "No"}
        <br/>
        Is paused: {tetris.isPaused ? "Yes" : "No"}
        <br/>
        Next figure will be: {tetris.nextFigureType}
        <br/>
        Score: {tetris.score}
        <br/>
        Level: {tetris.level}
      </section>
    </fieldset>
  );
}