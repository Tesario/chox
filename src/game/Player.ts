import { Circle } from "detect-collisions/dist/bodies/circle";
import { System } from "detect-collisions/dist/system";
import { player } from "../constants";
import { Velocity } from "../types/Game";
import { Object } from "./Object";

export class Player extends Object {
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
    public velocity: Velocity,
    image: CanvasImageSource
  ) {
    super(ctx, physics, w, h, x, y, rotation);
    this.velocity = velocity;
    this.image = image;
    this.circle = new Circle({ x: this.x, y: this.y }, this.h / 2);
    physics.insert(this.circle);
  }

  get Rotation(): number {
    return this.rotation;
  }
  set Rotation(value: number) {
    this.rotation = value;
  }

  changeVelocity(direction: "x" | "y", speed: number) {
    this.velocity[direction] += speed;
    if (Math.abs(this.velocity[direction]) > player.maxSpeed) {
      this.velocity[direction] =
        this.velocity[direction] > 0 ? player.maxSpeed : -player.maxSpeed;
    }
  }

  update() {
    this.circle.x += this.velocity.x;
    this.circle.y += this.velocity.y;

    this.draw();

    if (this.velocity.x > 0) {
      this.velocity.x -= player.slow;
      if (this.velocity.x < 0) {
        this.velocity.x = 0;
      }
    } else {
      this.velocity.x += player.slow;
      if (this.velocity.x > 0) {
        this.velocity.x = 0;
      }
    }

    if (this.velocity.y > 0) {
      this.velocity.y -= player.slow;
      if (this.velocity.y < 0) {
        this.velocity.y = 0;
      }
    } else {
      this.velocity.y += player.slow;
      if (this.velocity.y > 0) {
        this.velocity.y = 0;
      }
    }
  }

  draw(): void {
    this.ctx.save();
    this.ctx.translate(this.circle.x, this.circle.y);
    this.ctx.rotate(this.rotation);
    this.ctx.translate(-this.circle.x, -this.circle.y);

    this.ctx.drawImage(
      this.image,
      this.circle.x - this.w / 2 + 22,
      this.circle.y - this.h / 2,
      this.w,
      this.h
    );

    this.circle.setPosition(this.circle.x, this.circle.y);
    this.ctx.restore();
  }
}
