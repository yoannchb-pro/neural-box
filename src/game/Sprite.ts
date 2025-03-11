export class Sprite {
  public sprite: HTMLImageElement = new Image();

  constructor(src: string) {
    this.sprite.src = `./sprites/${src}`;
  }
}
