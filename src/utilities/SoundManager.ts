export class ImageManager {
  static get(path: string) {
    const img = new Image();
    img.src = `/images/${path}`;
    return img;
  }
}
