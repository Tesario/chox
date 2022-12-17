import { Circle } from "detect-collisions";
import { System } from "detect-collisions/dist/system";
import { Object } from "./Object";

export class Tree extends Object {
  private image;
  public circle: Circle;
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
    this.circle = new Circle({ x: this.x, y: this.y }, this.h / 3);
    physics.insert(this.circle);
  }

  draw(): void {
    this.ctx.save();
    this.ctx.translate(this.circle.x, this.circle.y);
    this.ctx.rotate(this.rotation);
    this.ctx.translate(-this.circle.x, -this.circle.y);
    this.ctx.drawImage(
      this.image,
      this.circle.x - this.w / 2,
      this.circle.y - this.h / 2,
      this.w,
      this.h
    );
    this.circle.setPosition(this.circle.x, this.circle.y);
    this.ctx.restore();
  }
}
