export enum FigureType {
  I = "I",
  J = "J",
  L = "L",
  O = "O",
  S = "S",
  T = "T",
  Z = "Z",
}

export enum FigureMoveDirection {
  Left = "left",
  Right = "right",
  Down = "down",
  Up = "up",
  RotateLeft = "rotateLeft",
  RotateRight = "rotateRight",
  Drop = "drop",
}

export interface TetrisOptions {
  width: number;
  height: number;
  onNewFrame?: () => void;
}
