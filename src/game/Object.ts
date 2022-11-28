import { System } from "detect-collisions";

export class Object {
  constructor(
    protected ctx: CanvasRenderingContext2D,
    protected physics: System,
    public w: number,
    public h: number,
    public x: number,
    public y: number,
    protected rotation: number
  ) {
    this.ctx = ctx;
    this.physics = physics;
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.rotation = rotation;
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    this.ctx.rotate(this.rotation);
    this.ctx.translate(-(this.x + this.w / 2), -(this.y + this.h / 2));
  }
}
