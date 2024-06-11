import { Sprite } from './Sprite';

type ConstructorProps = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

export class Bird extends Sprite {
  private y: number;
  private vy = 0;
  private rotation = 0;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(params: ConstructorProps) {
    super(`bird.png`);
    this.canvas = params.canvas;
    this.ctx = params.ctx;
    this.y = this.canvas.height / 2;
  }

  jump() {
    this.vy = -20;
    this.rotation = -55;
  }

  update() {
    this.vy += 1;
    this.y += this.vy;
    this.rotation += 5;
    if (this.rotation > 90) this.rotation = 90;
  }

  draw() {
    this.ctx.save();

    const rotation = this.rotation * (Math.PI / 180);
    const x = 40 + this.sprite.width / 2;

    this.ctx.setTransform(1, 0, 0, 1, x, this.y);
    this.ctx.rotate(rotation);
    this.ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2);

    this.ctx.restore();
  }
}
