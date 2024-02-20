import { useMemo } from "react";
import { Grid } from "../../tetrisImpl";
import { Figure } from "../../tetrisImpl/Figure";
import "./GameGrid.less";

interface GameGridProps {
  grid: Grid;
  cellSize: number;
}

export function GameGrid({ grid, cellSize, }: GameGridProps) {
  const [cols, rows, cells] = useMemo(() => {
    return [
      grid[0]?.length || 0,
      grid.length,
      grid.flat(),
    ];
  }, [grid]);

  function getCellClassName(cell: Figure | null): string {
    const cellType = cell ? `figure-${cell.type}` : "empty";
    return `grid-cell ${cellType}`;
  }

  return (
    <div
      className="game-grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      }}
    >
      {cells.map((cell, index) => (
        <div key={index} className={getCellClassName(cell)} />
      ))}
    </div>
  );
}
