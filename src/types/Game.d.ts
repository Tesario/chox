export type Velocity = { x: number; y: number };

export type Player = {
  w: number;
  h: number;
  x: number;
  y: number;
  velocity: Velocity;
  rotation: number;
};

export interface PlayerI {
  ctx: CanvasRenderingContext2D;
  player: Player;
  img: CanvasImageSource;
}

export interface ObjectI {
  readonly ctx: CanvasRenderingContext2D;
  readonly w: number;
  readonly h: number;
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
}
