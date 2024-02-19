import { FigureType } from ".";

export class Figure {
  x = 0;
  y = 0;

  schema: number[][] = [];

  actualWidth = 0;
  actualHeight = 0;

  offsetLeft = 0;
  offsetRight = 0;
  offsetTop = 0;
  offsetBottom = 0;

  constructor(public type: FigureType) {
    this.schema = schemaMap[type];
    this.checkSchema();
    this.calcActualSize();
  }

  clone(): Figure {
    const figure = new Figure(this.type);
    figure.x = this.x;
    figure.y = this.y;
    figure.schema = [...this.schema];
    return figure;
  }

  rotateLeft(): void {
    const newSchema: number[][] = [];

    for (let x = this.schema[0].length - 1; x >= 0; --x) {
      const row = [];
      for (let y = 0; y < this.schema.length; ++y) {
        row.push(this.schema[y][x]);
      }
      newSchema.push(row);
    }

    this.schema = newSchema;
  }

  rotateRight(): void {
    const newSchema: number[][] = [];

    for (let x = 0; x < this.schema[0].length; ++x) {
      const row = [];
      for (let y = this.schema.length - 1; y >= 0; --y) {
        row.push(this.schema[y][x]);
      }
      newSchema.push(row);
    }

    this.schema = newSchema;
  }

  private checkSchema(): void {
    if (this.schema.some(v => v.length !== this.schema[0].length)) {
      console.warn(`Invalid schema for figure "${this.type} (all sub-arrays should be equal length)"`);
    }
  }

  private calcActualSize(): void {
    const height = this.schema.length;
    const width = this.schema[0].length;

    const mergedY = Array.from({ length: height }, () => 0);
    const mergedX = Array.from({ length: width }, () => 0);

    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        if (this.schema[y][x]) {
          if (!mergedY[y]) {
            mergedY[y] = 1;
          }
          if (!mergedX[x]) {
            mergedX[x] = 1;
          }
          this
        }
      }
    }

    // actual size
    this.actualHeight = mergedY.filter(v => v).length;
    this.actualWidth = mergedX.filter(v => v).length;

    // offset left
    let index = mergedX.indexOf(1);
    this.offsetLeft = index === -1 ? 0 : index;

    // offset right
    index = mergedX.lastIndexOf(1);
    this.offsetRight = index === -1 ? 0 : ((mergedX.length - 1) - index);

    // offset top
    index = mergedY.indexOf(1);
    this.offsetTop = index === -1 ? 0 : index;

    // offset bottom
    index = mergedY.lastIndexOf(1);
    this.offsetBottom = index === -1 ? 0 : ((mergedY.length - 1) - index);
  }
}

const schemaMap = {
  [FigureType.I]: [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [FigureType.J]: [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  [FigureType.L]: [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1]
  ],
  [FigureType.O]: [
    [1, 1],
    [1, 1],
  ],
  [FigureType.S]: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [FigureType.T]: [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [FigureType.Z]: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
}
