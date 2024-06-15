import { Base } from './Base';
import { Pipe } from './Pipe';
import { Sprite } from './Sprite';
import { velocity } from './velocity';
import Network from '../../../neural-box/src';

type ConstructorProps = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

const BIRD_SPRITE = new Sprite('bird.png').sprite;

export class Bird {
  private score = 0;
  private x: number = Bird.BIRD_START_POSITION;
  private y: number;
  private vy = 0;
  private rotation = 0;
  public isDead = false;

  public brain = new Network({
    inputLength: 3,
    outputLength: 1,
    hiddenLayers: 0,
    hiddenLength: 0
  });

  public static BIRD_START_POSITION = 40;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(params: ConstructorProps) {
    this.canvas = params.canvas;
    this.ctx = params.ctx;
    this.y = this.canvas.height / 2;

    this.brain.generateNetwork();
  }

  checkCollision(pipes: Pipe[]) {
    if (this.isDead) return;

    // Check if we hit the ground
    if (this.canvas.height - this.y <= Base.BASE_SIZE) {
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

  getFitness() {
    return this.score;
  }

  getY() {
    return this.y;
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
    const x = this.x + BIRD_SPRITE.width / 2;

    this.ctx.setTransform(1, 0, 0, 1, x, this.y);
    this.ctx.rotate(rotation);
    this.ctx.drawImage(BIRD_SPRITE, -BIRD_SPRITE.width / 2, -BIRD_SPRITE.height / 2);

    this.ctx.restore();
  }
}
