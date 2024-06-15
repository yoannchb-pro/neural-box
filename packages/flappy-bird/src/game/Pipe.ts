import { Base } from './Base';
import { Sprite } from './Sprite';
import { velocity } from './velocity';

type ConstructorProps = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  x: number;
};

const PIPEDOWN_SPRITE = new Sprite('pipedown.png').sprite;
const PIPEUP_SPRITE = new Sprite('pipeup.png').sprite;

export class Pipe {
  public x: number;
  public width = 70;
  public height: number;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  public passed = false;

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
      PIPEDOWN_SPRITE,
      0,
      PIPEDOWN_SPRITE.height - this.height,
      PIPEDOWN_SPRITE.width,
      this.height,
      this.x,
      0,
      this.width,
      this.height
    );

    // bottom
    const bottomY = this.height + Pipe.PIPE_DISTANCE;
    this.ctx.drawImage(
      PIPEUP_SPRITE,
      0,
      0,
      PIPEUP_SPRITE.width,
      this.canvas.height - Base.BASE_SIZE - bottomY,
      this.x,
      bottomY,
      this.width,
      this.canvas.height - Base.BASE_SIZE - bottomY
    );
  }
}
