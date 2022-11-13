import { Object } from "./Object";

export class Ground extends Object {
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

  update() {
    this.draw();
  }

  draw(): void {
    super.draw();
    const pattern = this.ctx.createPattern(
      this.image,
      "repeat"
    ) as CanvasPattern;
    this.ctx.fillStyle = pattern;
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.ctx.restore();
  }
}
