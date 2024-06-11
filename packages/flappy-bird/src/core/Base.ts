import { Sprite } from './Sprite';
import { velocity } from './velocity';

type ConstructorProps = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

export class Base extends Sprite {
  private x = 0;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  public static BASE_SIZE = 100;

  constructor(params: ConstructorProps) {
    super(`base.png`);
    this.canvas = params.canvas;
    this.ctx = params.ctx;
  }

  update() {
    this.x -= velocity;
    if (this.x <= -this.canvas.width) this.x = 0;
  }

  draw() {
    this.ctx.drawImage(
      this.sprite,
      this.x,
      this.canvas.height - Base.BASE_SIZE,
      this.canvas.width,
      Base.BASE_SIZE
    );

    this.ctx.drawImage(
      this.sprite,
      this.x + this.canvas.width,
      this.canvas.height - Base.BASE_SIZE,
      this.canvas.width,
      Base.BASE_SIZE
    );
  }
}
