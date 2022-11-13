<template>
  <canvas id="game" :width="canvas.width" :height="canvas.height"></canvas>
</template>
<script lang="ts">
import running from "../assets/images/survivor-move_rifle/survivor-move_rifle_0.png";
import { ref } from "vue";

type Keys = {
  [key: string]: boolean;
};

type Canvas = {
  width: number;
  height: number;
};

type Bullets = { x: number; y: number; rotate: number }[];

export default {
  setup() {
    const canvas = ref<Canvas>({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const bullet = { w: 60, h: 5, speed: 50 };
    const player = ref({ w: 150, h: 100, x: 0, y: 0 });
    const mousePos = ref({ x: 0, y: 0 });
    const keys = ref<Keys>({});
    const bullets = ref<Bullets>([]);

    const c = ref<HTMLCanvasElement>();
    const ctx = ref<CanvasRenderingContext2D>();

    function update() {
      ctx?.value?.clearRect(0, 0, canvas.value.width, canvas.value.height);
      ctx!.value!.fillStyle = "#eeeeee";
      ctx?.value?.fillRect(0, 0, canvas.value.width, canvas.value.height);

      let doublePress = 1;

      if (
        (keys.value["KeyA"] && keys.value["KeyW"]) ||
        (keys.value["KeyW"] && keys.value["KeyD"]) ||
        (keys.value["KeyD"] && keys.value["KeyS"]) ||
        (keys.value["KeyS"] && keys.value["KeyA"])
      ) {
        doublePress = 1.5;
      }

      if (keys.value["KeyA"]) {
        player.value.x -= player.value.speed / doublePress;
      }
      if (keys.value["KeyD"]) {
        player.value.x += player.value.speed / doublePress;
      }
      if (keys.value["KeyW"]) {
        player.value.y -= player.value.speed / doublePress;
      }
      if (keys.value["KeyS"]) {
        player.value.y += player.value.speed / doublePress;
      }
    }

    function onKeyPress(e: KeyboardEvent, pressed: boolean) {
      keys.value[e.code] = pressed;

      if (e.code === "ShiftLeft") {
        if (keys.value["ShiftLeft"]) {
          player.value.speed = boost;
        } else {
          player.value.speed = speed;
        }
      }
    }

    function onFire(e: MouseEvent) {
      bullets.value = [
        ...bullets.value,
        { x: e.clientX, y: e.clientY, rotate: 0 },
      ];
    }

    return {
      canvas,
      ctx,
      c,
      pos,
      keys,
      update,
      mousePos,
      player,
      onKeyPress,
      onFire,
      bullets,
      bullet,
    };
  },
  mounted() {
    this.c = document.getElementById("game") as HTMLCanvasElement;
    this.ctx = this.c?.getContext("2d") as CanvasRenderingContext2D;

    this.c.addEventListener("mousemove", (e: MouseEvent) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
    });
    window.addEventListener("keydown", (e) => this.onKeyPress(e, true));
    window.addEventListener("keyup", (e) => this.onKeyPress(e, false));
    window.addEventListener("click", this.onFire);

    let i = 0;
    var img = new Image();
    img.src = running;

    img.addEventListener("load", () => {
      this.ctx?.drawImage(img, this.pos.x, this.pos.y, 150, 100);
    });

    if (this.ctx !== undefined) {
      setInterval(() => {
        this.update();

        let x, y;
        let degreeMultiplier = 1;

        if (
          this.pos.x + 75 < this.mousePos.x &&
          this.pos.y + 50 < this.mousePos.y
        ) {
          x = this.mousePos.x - this.pos.x - 75;
          y = this.mousePos.y - this.pos.y - 50;
        } else if (
          this.pos.x + 75 > this.mousePos.x &&
          this.pos.y + 50 < this.mousePos.y
        ) {
          x = this.pos.x - this.mousePos.x + 75;
          y = this.mousePos.y - this.pos.y - 50;
          degreeMultiplier = 2;
        } else if (
          this.pos.x + 75 > this.mousePos.x &&
          this.pos.y + 50 > this.mousePos.y
        ) {
          x = this.pos.x - this.mousePos.x + 75;
          y = this.pos.y - this.mousePos.y + 50;
          degreeMultiplier = 3;
        } else {
          x = this.mousePos.x - this.pos.x - 75;
          y = this.pos.y - this.mousePos.y + 50;
          degreeMultiplier = 4;
        }

        let z = Math.sqrt(x * x + y * y);
        let rads = Math.asin(y / z);

        // console.log(rads * (180 / Math.PI));
        // console.log(
        //   (degreeMultiplier % 2 === 0 ? 2 * Math.PI - rads : rads) +
        //     ((degreeMultiplier * 90 - 90) * Math.PI) / 180
        // );

        this.ctx?.save();
        this.ctx?.translate(this.pos.x + 75, this.pos.y + 50);
        this.ctx?.rotate(
          (degreeMultiplier % 2 === 0 ? Math.PI / 2 - rads : rads) +
            ((degreeMultiplier * 90 - 90) * Math.PI) / 180
        );
        this.ctx?.translate(-(this.pos.x + 75), -(this.pos.y + 50));
        this.ctx?.drawImage(img, this.pos.x, this.pos.y, 150, 100);
        this.ctx?.restore();

        this.bullets.forEach((pos) => {
          const grd = this.ctx?.createLinearGradient(
            pos.x,
            0,
            pos.x + this.bullet.w,
            0
          );
          grd?.addColorStop(0, "rgba(255,255,255,0)");
          grd?.addColorStop(0.5, "yellow");
          grd?.addColorStop(1, "orange");

          this.ctx?.save();
          this.ctx?.translate(pos.x, pos.y);
          this.ctx?.rotate(
            (degreeMultiplier % 2 === 0 ? Math.PI / 2 - rads : rads) +
              ((degreeMultiplier * 90 - 90) * Math.PI) / 180
          );
          this.ctx?.translate(-pos.x, -pos.y);

          this.ctx!.fillStyle = grd ?? "";
          this.ctx?.fillRect(pos.x, pos.y, this.bullet.w, this.bullet.h);
          this.ctx?.restore();
        });
      }, 1000 / 60);
    }
  },
  unmounted() {
    window.removeEventListener("keydown", (e) => this.onKeyPress(e, true));
    window.removeEventListener("keyup", (e) => this.onKeyPress(e, false));
  },
};
</script>