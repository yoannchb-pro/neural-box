import { Sprite } from './Sprite';

type ConstructorProps = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

const SCORES_SPRITES: HTMLImageElement[] = [];

for (let i = 0; i < 10; ++i) {
  const sprite = new Sprite(`${i}.png`);
  SCORES_SPRITES.push(sprite.sprite);
}

export class Score {
  private score = 0;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(params: ConstructorProps) {
    this.canvas = params.canvas;
    this.ctx = params.ctx;
  }

  reset() {
    this.score = 0;
  }

  increase() {
    this.score++;
  }

  draw() {
    const strScore = this.score.toString();
    const scoreNumbers = strScore.split('');

    for (let i = 0; i < scoreNumbers.length; ++i) {
      const number = Number(scoreNumbers[i]);
      const numberSprite = SCORES_SPRITES[number];
      this.ctx.drawImage(
        numberSprite,
        this.canvas.width / 2 -
          (numberSprite.width / 2) * scoreNumbers.length +
          i * numberSprite.width,
        20
      );
    }
  }
}
