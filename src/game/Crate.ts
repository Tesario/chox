import { Box } from "detect-collisions/dist/bodies/box";
import { System } from "detect-collisions/dist/system";
import { Object } from "./Object";

export class Crate extends Object {
  private image;
  public box: Box;
  constructor(
    ctx: CanvasRenderingContext2D,
    physics: System,
    w: number,
    h: number,
    x: number,
    y: number,
    rotation: number,
    image: CanvasImageSource
  ) {
    super(ctx, physics, w, h, x, y, rotation);
    this.image = image;
    this.box = new Box({ x: this.x, y: this.y }, this.h, this.w);
    physics.insert(this.box);
  }

  draw(): void {
    super.draw();
    this.ctx.drawImage(this.image, this.box.x, this.box.y, this.w, this.h);
    this.box.setPosition(this.box.x, this.box.y);
    this.ctx.restore();
  }
}
