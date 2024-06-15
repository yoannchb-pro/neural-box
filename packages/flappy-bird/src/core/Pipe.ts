import { Base } from './Base';
import { Sprite } from './Sprite';
import { velocity } from './velocity';

type ConstructorProps = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  x: number;
};

export class Pipe {
  public x: number;
  public width = 70;
  public height: number;

  private spritedown = new Sprite('pipedown.png');
  private spriteup = new Sprite('pipeup.png');

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  public static PIPE_DISTANCE = 150;
  public static PIPE_RANGE = 250;

  constructor(params: ConstructorProps) {
    this.canvas = params.canvas;
    this.ctx = params.ctx;

    this.x = params.x;

    this.height = Math.max(
      Math.random() * this.canvas.height - Base.BASE_SIZE - Pipe.PIPE_DISTANCE * 1.5,
      200
    );
  }

  update() {
    this.x -= velocity;
    if (this.x <= -this.canvas.width) this.x = 0;
  }

  draw() {
    // top
    this.ctx.drawImage(
      this.spritedown.sprite,
      0,
      this.spriteup.sprite.height - this.height,
      this.spriteup.sprite.width,
      this.height,
      this.x,
      0,
      this.width,
      this.height
    );

    // bottom
    const bottomY = this.height + Pipe.PIPE_DISTANCE;
    this.ctx.drawImage(
      this.spriteup.sprite,
      0,
      0,
      this.spritedown.sprite.width,
      this.canvas.height - Base.BASE_SIZE - bottomY,
      this.x,
      bottomY,
      this.width,
      this.canvas.height - Base.BASE_SIZE - bottomY
    );
  }
}
