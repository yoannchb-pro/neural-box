import { Base } from './Base';
import { Sprite } from './Sprite';
import { velocity } from './velocity';

type ConstructorProps = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

export class Pipe {
  private x: number;
  private y: number = 0;

  private spritedown = new Sprite('pipedown.png');
  private spriteup = new Sprite('pipeup.png');

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private static PIPE_DISTANCE = 150;
  private static PIPE_RANGE = 150;

  constructor(params: ConstructorProps) {
    this.canvas = params.canvas;
    this.ctx = params.ctx;

    this.x = this.canvas.width;
    this.spritedown.sprite.onload = () => {
      const spriteHeight = this.spritedown.sprite.height;
      this.y = Math.random() * (this.canvas.height - Base.BASE_SIZE) - spriteHeight;
    };
  }

  update() {
    this.x -= velocity;
    if (this.x <= -this.canvas.width) this.x = 0;
  }

  draw() {
    const w = 75;
    const h = this.canvas.height;

    // top
    this.ctx.drawImage(this.spritedown.sprite, this.x, this.y, w, h);

    // bottom
    this.ctx.drawImage(
      this.spriteup.sprite,
      this.x,
      this.y + this.spritedown.sprite.height + Pipe.PIPE_DISTANCE,
      w,
      h
    );
  }
}
