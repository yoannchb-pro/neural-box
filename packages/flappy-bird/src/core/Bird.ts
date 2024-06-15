import { Base } from './Base';
import { Pipe } from './Pipe';
import { Sprite } from './Sprite';
import { velocity } from './velocity';

type ConstructorProps = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

export class Bird extends Sprite {
  private score = 0;
  private x: number = 40;
  private y: number;
  private vy = 0;
  private rotation = 0;
  public isDead = false;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(params: ConstructorProps) {
    super(`bird.png`);
    this.canvas = params.canvas;
    this.ctx = params.ctx;
    this.y = this.canvas.height / 2;
  }

  checkCollision(pipes: Pipe[]) {
    if (this.isDead) return;

    // Check if we hit the ground
    if (this.canvas.height - this.y + this.vy <= Base.BASE_SIZE) {
      this.isDead = true;
      this.y = this.canvas.height - Base.BASE_SIZE;
      return;
    }

    // Check if we hit the sky
    if (this.y <= 0) {
      this.isDead = true;
      this.y = 0;
      return;
    }

    // Check pipe collision
    for (const pipe of pipes) {
      if (this.x >= pipe.x && this.x <= pipe.x + pipe.width) {
        if (this.y <= pipe.height || this.y >= pipe.height + Pipe.PIPE_DISTANCE) {
          this.isDead = true;
          return;
        }
      }
    }
  }

  jump() {
    if (this.isDead) return;

    this.vy = -15;
    this.rotation = -55;
  }

  update() {
    if (this.isDead) {
      this.x -= velocity;
      return;
    }

    this.score++;
    this.vy += 1;
    this.y += this.vy;
    this.rotation += 5;
    if (this.rotation > 90) this.rotation = 90;
  }

  draw() {
    this.ctx.save();

    const rotation = this.rotation * (Math.PI / 180);
    const x = this.x + this.sprite.width / 2;

    this.ctx.setTransform(1, 0, 0, 1, x, this.y);
    this.ctx.rotate(rotation);
    this.ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2);

    this.ctx.restore();
  }
}
