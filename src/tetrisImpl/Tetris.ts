import { FigureType, FigureMoveDirection, TetrisOptions } from "./types";
import { Figure } from "./Figure";

export type Grid = (Figure | null)[][];

export class Tetris {
  grid: Grid = [];
  isGameOver = false;
  isPaused = false;
  score = 0;
  level = 1;

  nextFigureType = FigureType.T;
  nextFigureGrid: Grid = [];

  private debug = true;

  private activeFigure: Figure | null = null;

  private moveDownIntervalMs = 0;
  private moveDownIntervalId?: number;

  private setFigureTimeoutMs = 0;
  private setFigureTimeoutId?: number;

  private gameLevels = [
    { level: 1, minScore: 0, moveMs: 700, setMs: 200 },
    { level: 2, minScore: 20, moveMs: 550, setMs: 200 },
    { level: 3, minScore: 50, moveMs: 400, setMs: 200 },
    { level: 4, minScore: 90, moveMs: 300, setMs: 150 },
    { level: 5, minScore: 150, moveMs: 200, setMs: 100 },
  ];

  constructor(private options: TetrisOptions) {
    this.initGrid();
    this.prepareNextFigure();
  }

  startNewGame(): void {
    this.grid.forEach(row => row.fill(null));
    this.activeFigure = null;
    this.isGameOver = false;
    this.isPaused = false;

    const initLevel = this.gameLevels[0];
    this.level = initLevel.level;
    this.score = initLevel.minScore;
    this.moveDownIntervalMs = initLevel.moveMs;
    this.setFigureTimeoutMs = initLevel.setMs;

    this.updateGameState();
    this.startMoveDown();
    clearTimeout(this.setFigureTimeoutId);

    this.log("New game started");
    this.log(`Level ${this.level}`);
  }

  pause(value?: boolean): void {
    if (this.isGameOver) {
      return;
    }

    this.isPaused = value === undefined ? !this.isPaused : value;

    if (this.isPaused) {
      this.stopMoveDown();
    } else {
      this.startMoveDown();
    }

    this.notifyNewFrame();
  }

  destroy(): void {
    this.stopMoveDown();
    clearTimeout(this.setFigureTimeoutId);
  }

  moveFigure(dir: FigureMoveDirection): void {
    if (!this.activeFigure || this.isGameOver || this.isPaused) {
      return;
    }

    const figure = this.activeFigure.clone();

    switch (dir) {
      case FigureMoveDirection.Down:
        figure.y += 1;
        break;

      case FigureMoveDirection.Left:
        figure.x -= 1;
        break;

      case FigureMoveDirection.Right:
        figure.x += 1;
        break;

      case FigureMoveDirection.Up:
        figure.y -=1 ;
        break;

      case FigureMoveDirection.RotateRight:
        figure.rotateRight();
        break;

      case FigureMoveDirection.RotateLeft:
        figure.rotateLeft();
        break;

      case FigureMoveDirection.Drop:
        while (true) {
          if (this.isValidFigurePosition(figure)) {
            figure.y += 1;
          } else {
            figure.y -= 1;
            break;
          }
        }
        break;
    }

    if (this.isValidFigurePosition(figure)) {
      this.drawFigure(this.grid, this.activeFigure, true);
      this.drawFigure(this.grid, figure);
      this.activeFigure = figure;
    }

    this.updateGameState();
  }

  private createFigure(type: FigureType, outsideTop?: boolean): void {
    const figure = new Figure(type);

    figure.x = Math.round(this.options.width / 2) - Math.round(figure.actualWidth / 2) - figure.offsetLeft;

    if (outsideTop) {
      figure.y = -(figure.actualHeight + figure.offsetTop);
    } else {
      figure.y = figure.offsetTop ? -figure.offsetTop : 0;
    }

    this.activeFigure = figure;
    this.drawFigure(this.grid, figure);
  }

  private getRandomFigureType(): FigureType {
    const allTypes = Object.values(FigureType);
    const index = Math.floor(Math.random() * allTypes.length);
    return allTypes[index];
  }

  private updateGameState(): void {
    this.checkIfGameOver();

    if (!this.isGameOver) {
      this.tryToSetActiveFigure();

      if (!this.activeFigure) {
        this.createFigure(this.nextFigureType, true);
        this.prepareNextFigure();
      }
    }

    this.notifyNewFrame();
  }

  private startMoveDown(): void {
    clearInterval(this.moveDownIntervalId);

    this.moveDownIntervalId = setInterval(() => {
      this.moveFigure(FigureMoveDirection.Down);
    }, this.moveDownIntervalMs);
  }

  private stopMoveDown(): void {
    clearInterval(this.moveDownIntervalId);
  }

  private checkIfGameOver(): void {
    this.isGameOver = this.grid[0].some(val => val && val !== this.activeFigure);
  }

  private notifyNewFrame(): void {
    this.options.onNewFrame?.();
  }

  private removeCompletedRows(): void {
    // Remove rows without empty cells
    const newGrid = this.grid.filter(row => row.some(val => !val));

    // Add new rows to the top of grid
    let removeCount = this.grid.length - newGrid.length;
    if (removeCount) {
      while (removeCount--) {
        newGrid.unshift(Array.from({ length: this.options.width }, () => null));
      }
      this.log(`Removed ${removeCount} row(s)`);
    }

    this.grid = newGrid;
  }

  private tryToSetActiveFigure(): void {
    clearTimeout(this.setFigureTimeoutId);

    // Use timeout to allow move right/left before figure is set
    this.setFigureTimeoutId = setTimeout(() => {
      if (!this.activeFigure) {
        return;
      }
      
      const figure = this.activeFigure.clone();
      figure.y += 1;

      if (!this.isValidFigurePosition(figure)) {
        // Set active figure logic
        this.score += 1;
        this.activeFigure = null;
        this.removeCompletedRows();
        this.updateLevelAndSpeed();
        this.updateGameState();
      }
    }, this.setFigureTimeoutMs);
  }

  private updateLevelAndSpeed(): void {
    const levelItem = this.gameLevels
      .slice(1)
      .reverse()
      .find(item => this.score >= item.minScore);

    if (levelItem && this.level !== levelItem.level) {
      this.level = levelItem.level;
      this.moveDownIntervalMs = levelItem.moveMs;
      this.setFigureTimeoutMs = levelItem.setMs;
      this.startMoveDown();
      this.log(`Level changed to ${this.level}`);
    }
  }

  private prepareNextFigure(): void {
    this.nextFigureType = this.getRandomFigureType();

    const previewWidth = this.options.nextFigureGridWidth;
    const previewHeight = this.options.nextFigureGridHeight;

    const figure = new Figure(this.nextFigureType);
    figure.x = Math.round(previewWidth / 2) - Math.round(figure.actualWidth / 2) - figure.offsetLeft
    figure.y = Math.round(previewHeight / 2) - Math.round(figure.actualHeight / 2) - figure.offsetTop;

    this.nextFigureGrid = Array.from(
      { length: previewHeight },
      () => Array.from({ length: previewWidth }, () => null)
    );

    this.drawFigure(this.nextFigureGrid, figure);
  }

  private isValidFigurePosition(figure: Figure): boolean {
    const { width, height } = this.options;

    const schema = figure.schema;
    const initY = figure.y;
    const initX = figure.x;

    for (let y = initY; y < initY + schema.length; ++y) {
      for (let x = initX; x < initX + schema[0].length; ++x) {
        const schemaY = y - initY;
        const schemaX = x - initX;

        if (schema[schemaY][schemaX]) {
          // Prevent move outside left, right or bottom bounds
          // But allow figure to appear outside top bound
          if (
            x < 0 || x > width - 1 || y > height - 1
          ) {
            return false;
          }

          // Check overlap with other figures
          if (this.grid[y]?.[x] && this.grid[y][x] !== this.activeFigure) {
            return false;
          }
        }
      }
    }

    return true;
  }

  private drawFigure(grid: Grid, figure: Figure, clear = false): void {
    const width = grid[0]?.length ?? 0;
    const height = grid.length;

    const startY = figure.y;
    const startX = figure.x;
    const schema = figure.schema;
      
    for (let y = startY; y < startY + schema.length; ++y) {
      for (let x = startX; x < startX + schema[0].length; ++x) {
        const schemaY = y - startY;
        const schemaX = x - startX;

        if (
          y >= 0 && y < height &&
          x >= 0 && x < width
        ) {
          const val = schema[schemaY][schemaX];
          if (val) {
            grid[y][x] = clear ? null : figure;
          }
        }
      }
    }
  }

  private initGrid(): void {
    const { width, height } = this.options;

    this.grid = Array.from(
      { length: height },
      () => Array.from({ length: width }, () => null)
    );
  }

  private log(...data: any[]): void {
    if (!this.debug) {
      return;
    }

    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ms = date.getMilliseconds();

    console.log(`[${hours}:${minutes}:${seconds}.${ms}]`, ...data);
  }
}
