export class Object {
  constructor(
    protected ctx: CanvasRenderingContext2D,
    public w: number,
    public h: number,
    protected x: number,
    protected y: number,
    protected rotation: number
  ) {
    this.ctx = ctx;
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
