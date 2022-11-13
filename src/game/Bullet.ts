import { bullet } from "../constants";
import { Velocity } from "../types/Game";
import { Object } from "./Object";

export class Bullet extends Object {
  private velocity: Velocity;
  constructor(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    x: number,
    y: number,
    rotation: number,
    velocity: Velocity
  ) {
    super(ctx, w, h, x, y, rotation);
    this.velocity = velocity;
  }

  update() {
    this.draw();
    this.x += this.velocity.x * bullet.speed;
    this.y += this.velocity.y * bullet.speed;
  }

  draw(): void {
    super.draw();
    const grd = this.ctx.createLinearGradient(this.x, 0, this.x + this.w, 0);
    grd?.addColorStop(0, "rgba(255,255,255,0)");
    grd?.addColorStop(0.6, "yellow");
    grd?.addColorStop(0.9, "orange");
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
    this.ctx.restore();
  }
}
