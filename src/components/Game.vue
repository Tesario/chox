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
import { getRandomInt } from "../helpers/helper";
import { bullet } from "../constants/index";
import { ImageManager } from "../utilities/ImageManager";
import { calculateVelocity } from "../helpers/helper";
import { System } from "detect-collisions";
import { player as playerConstants } from "../constants";

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

    const physics: System = new System();

    window.addEventListener("keydown", (e) => onKeyPress(e, true));
    window.addEventListener("keyup", (e) => onKeyPress(e, false));
    window.addEventListener("click", onFire);
    c.addEventListener("mousemove", (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const player = new Player(
      ctx,
      physics,
      initPlayer.w,
      initPlayer.h,
      this.canvas.w / 2 - initPlayer.w,
      this.canvas.h / 2 - initPlayer.h,
      initPlayer.rotation,
      initPlayer.velocity,
      ImageManager.get("survivor-move_rifle/survivor-move_rifle_0.png")
    );
    const ground = new Ground(
      ctx,
      physics,
      this.canvas.w,
      this.canvas.h,
      0,
      0,
      0,
      ImageManager.get("grass.jpg")
    );

    const crates: Crate[] = [];
    for (let i = 0; i < 20; i++) {
      crates.push(
        new Crate(
          ctx,
          physics,
          50,
          50,
          getRandomInt(0, this.canvas.w - 50),
          getRandomInt(0, this.canvas.h - 50),
          0,
          ImageManager.get("crate.png")
        )
      );
    }

    const handleCollisions = () => {
      physics.checkAll(({ a, b, overlapV }) => {
        if (
          a === player.circle ||
          crates.map((crate) => crate.box).includes(a)
        ) {
          a.x = a.pos.x - overlapV.x;
          a.y = a.pos.y - overlapV.y;
        }

        if (
          b === player.circle ||
          crates.map((crate) => crate.box).includes(b)
        ) {
          b.x = b.pos.x + overlapV.x;
          b.y = b.pos.y + overlapV.y;
        }

        if (a === player.circle) {
          player.velocity.x *= 0.95;
          player.velocity.y *= 0.95;
        }
      });
    };

    const update = () => {
      ground.draw();

      crates.forEach((crate) => {
        crate.draw();
      });

      if (keys["KeyA"]) {
        player.changeVelocity("x", -playerConstants.speed);
      }
      if (keys["KeyD"]) {
        player.changeVelocity("x", playerConstants.speed);
      }
      if (keys["KeyW"]) {
        player.changeVelocity("y", -playerConstants.speed);
      }
      if (keys["KeyS"]) {
        player.changeVelocity("y", playerConstants.speed);
      }

      let x, y;
      let degreeMultiplier = 1;

      if (player.circle.x < mouse.x && player.circle.y < mouse.y) {
        x = mouse.x - player.circle.x;
        y = mouse.y - player.circle.y;
      } else if (player.circle.x > mouse.x && player.circle.y < mouse.y) {
        x = player.circle.x - mouse.x;
        y = mouse.y - player.circle.y;
        degreeMultiplier = 2;
      } else if (player.circle.x > mouse.x && player.circle.y > mouse.y) {
        x = player.circle.x - mouse.x;
        y = player.circle.y - mouse.y;
        degreeMultiplier = 3;
      } else {
        x = mouse.x - player.circle.x;
        y = player.circle.y - mouse.y;
        degreeMultiplier = 4;
      }

      let z = Math.sqrt(x * x + y * y);
      let rads = Math.asin(y / z);

      bullets.forEach((bullet) => bullet.update());
      player.Rotation =
        (degreeMultiplier % 2 === 0 ? Math.PI / 2 - rads : rads) +
        ((degreeMultiplier * 90 - 90) * Math.PI) / 180;

      player.update();

      ctx.strokeStyle = "#FFFFFF";
      ctx.beginPath();
      physics.draw(ctx);
      ctx.stroke();

      physics.checkAll(handleCollisions);
      physics.update();

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
          physics,
          bullet.w,
          bullet.h,
          player.circle.x - bullet.w / 2,
          player.circle.y - bullet.h / 2,
          player.Rotation,
          calculateVelocity(player.circle.x, player.circle.y, mouse.x, mouse.y)
        )
      );
    }

    requestAnimationFrame(update);
  },
  unmounted() {},
};
</script>