import { Base } from './Base';
import { Sprite } from './Sprite';
type ConstructorProps = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

const BACKGROUND_SPRITE = new Sprite('background.png').sprite;

export class Background {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(params: ConstructorProps) {
    this.canvas = params.canvas;
    this.ctx = params.ctx;
  }

  draw() {
    this.ctx.drawImage(
      BACKGROUND_SPRITE,
      0,
      0,
      this.canvas.width,
      this.canvas.height - Base.BASE_SIZE
    );
  }
}
