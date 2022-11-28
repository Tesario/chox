import { System } from "detect-collisions";
import { Line } from "detect-collisions/dist/bodies/line";
import { Object } from "./Object";

export class Ground extends Object {
  private image;
  private bound1: Line = new Line({ x: 0, y: 0 }, { x: this.w, y: 0 });
  private bound2: Line = new Line(
    { x: this.w, y: 0 },
    { x: this.w, y: this.h }
  );
  private bound3: Line = new Line(
    { x: this.w, y: this.h },
    { x: 0, y: this.h }
  );
  private bound4: Line = new Line({ x: 0, y: this.h }, { x: 0, y: 0 });
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
    physics.insert(this.bound1);
    physics.insert(this.bound2);
    physics.insert(this.bound3);
    physics.insert(this.bound4);
  }

  update() {
    this.draw();
  }

  get Bounds(): Line[] {
    return [this.bound1, this.bound2, this.bound3, this.bound4];
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
