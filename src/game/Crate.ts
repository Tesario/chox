import { Object } from "./Object";

export class Crate extends Object {
  private image;
  constructor(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    x: number,
    y: number,
    rotation: number,
    image: CanvasImageSource
  ) {
    super(ctx, w, h, x, y, rotation);
    this.image = image;
  }

  draw(): void {
    super.draw();
    this.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    this.ctx.restore();
  }
}
