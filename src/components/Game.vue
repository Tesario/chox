<template>
  <canvas id="game" :width="canvas.w" :height="canvas.h"></canvas>
</template>
<script lang="ts">
import { ref } from "vue";
import { Player } from "../game/Player";
import { initPlayer } from "../constants";
import { Ground } from "../game/Ground";
import { Bullet } from "../game/Bullet";
import { Crate } from "../game/Crate";
import { bullet } from "../constants/index";
import { ImageManager } from "../utilities/ImageManager";
import { calculateVelocity } from "../helpers/helper";

type Canvas = {
  w: number;
  h: number;
};

export default {
  setup() {
    const canvas = ref<Canvas>({ w: 0, h: 0 });
    return { canvas };
  },
  mounted() {
    this.canvas = { w: window.innerWidth, h: window.innerHeight };
    const keys: { [key: string]: boolean } = {};
    const bullets: Bullet[] = [];
    const c = document.getElementById("game") as HTMLCanvasElement;
    const ctx = c.getContext("2d") as CanvasRenderingContext2D;
    const mouse = { x: 0, y: 0 };
    const speed = 5;

    window.addEventListener("keydown", (e) => onKeyPress(e, true));
    window.addEventListener("keyup", (e) => onKeyPress(e, false));
    window.addEventListener("click", onFire);
    c.addEventListener("mousemove", (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const player = new Player(
      ctx,
      initPlayer.w,
      initPlayer.h,
      this.canvas.w / 2 - initPlayer.w,
      this.canvas.h / 2 - initPlayer.h,
      initPlayer.rotation,
      ImageManager.get("survivor-move_rifle/survivor-move_rifle_0.png")
    );
    const ground = new Ground(
      ctx,
      this.canvas.w,
      this.canvas.h,
      0,
      0,
      0,
      ImageManager.get("grass.jpg")
    );
    const crate = new Crate(
      ctx,
      50,
      50,
      150,
      150,
      0,
      ImageManager.get("crate.png")
    );

    const update = () => {
      ground.draw();
      crate.draw();

      if (keys["KeyA"] && player.X > 0) {
        player.X -= speed;
      }
      if (keys["KeyD"] && player.X < this.canvas.w - player.w) {
        player.X += speed;
      }
      if (keys["KeyW"] && player.Y > 0) {
        player.Y -= speed;
      }
      if (keys["KeyS"] && player.Y < this.canvas.h - player.h) {
        player.Y += speed;
      }

      let x, y;
      let degreeMultiplier = 1;

      if (
        player.X + player.w / 2 < mouse.x &&
        player.Y + player.h / 2 < mouse.y
      ) {
        x = mouse.x - player.X - player.w / 2;
        y = mouse.y - player.Y - player.h / 2;
      } else if (
        player.X + player.w / 2 > mouse.x &&
        player.Y + player.h / 2 < mouse.y
      ) {
        x = player.X - mouse.x + player.w / 2;
        y = mouse.y - player.Y - player.h / 2;
        degreeMultiplier = 2;
      } else if (
        player.X + player.w / 2 > mouse.x &&
        player.Y + player.h / 2 > mouse.y
      ) {
        x = player.X - mouse.x + player.w / 2;
        y = player.Y - mouse.y + player.h / 2;
        degreeMultiplier = 3;
      } else {
        x = mouse.x - player.X - player.w / 2;
        y = player.Y - mouse.y + player.h / 2;
        degreeMultiplier = 4;
      }

      let z = Math.sqrt(x * x + y * y);
      let rads = Math.asin(y / z);

      bullets.forEach((bullet) => bullet.update());
      player.Rotation =
        (degreeMultiplier % 2 === 0 ? Math.PI / 2 - rads : rads) +
        ((degreeMultiplier * 90 - 90) * Math.PI) / 180;
      player.update();

      requestAnimationFrame(update);
    };

    function onKeyPress(e: KeyboardEvent, pressed: boolean) {
      keys[e.code] = pressed;
    }

    function onFire() {
      const shooting = new Audio("/sounds/ak47-fire.mp3");
      shooting.volume = 0.1;
      shooting.play();
      bullets.push(
        new Bullet(
          ctx,
          bullet.w,
          bullet.h,
          player.X + player.w / 2 - bullet.w / 2,
          player.Y + player.h / 2 - bullet.h / 2,
          player.Rotation,
          calculateVelocity(
            player.X + player.w / 2,
            player.Y + player.h / 2,
            mouse.x,
            mouse.y
          )
        )
      );
    }

    requestAnimationFrame(update);
  },
  unmounted() {},
};
</script>