import { Object } from "./Object";

export class Player extends Object {
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

  get Rotation(): number {
    return this.rotation;
  }
  set Rotation(value: number) {
    this.rotation = value;
  }

  get X(): number {
    return this.x;
  }
  set X(value: number) {
    this.x = value;
  }

  get Y(): number {
    return this.y;
  }
  set Y(value: number) {
    this.y = value;
  }

  update() {
    this.draw();
  }

  draw(): void {
    super.draw();
    this.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    this.ctx.restore();
  }
}
