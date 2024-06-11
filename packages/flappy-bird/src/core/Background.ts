import { Base } from './Base';
import { Sprite } from './Sprite';
type ConstructorProps = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

export class Background extends Sprite {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(params: ConstructorProps) {
    super('background.png');
    this.canvas = params.canvas;
    this.ctx = params.ctx;
  }

  draw() {
    this.ctx.drawImage(this.sprite, 0, 0, this.canvas.width, this.canvas.height - Base.BASE_SIZE);
  }
}
