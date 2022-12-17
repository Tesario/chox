export class ImageManager {
  static get(path: string) {
    const img = new Image();
    img.src = `/images/${path}`;
    return img;
  }

  static getRandom(arr: string[]) {
    const index = Math.floor(Math.random() * arr.length);
    const img = new Image();
    img.src = `/images/${arr[index]}`;
    return img;
  }
}
