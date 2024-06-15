import { Background } from './core/Background';
import { Base } from './core/Base';
import { Bird } from './core/Bird';
import { Pipe } from './core/Pipe';
import { Score } from './core/Score';

const BIRDS_COUNT = 50;
const FPS = 30;

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const background = new Background({
  canvas,
  ctx
});
const base = new Base({
  canvas,
  ctx
});
const score = new Score({
  canvas,
  ctx
});
const pipes: Pipe[] = [];
const birds: Bird[] = [];

/**
 * Init / Reset the game
 */
function initGame() {
  // Init pipes
  for (let i = 0; i < canvas.height; i += Pipe.PIPE_RANGE) {
    const pipe = new Pipe({
      canvas,
      ctx,
      x: canvas.width + i
    });
    pipes.push(pipe);
  }

  // Init birds
  for (let i = 0; i < BIRDS_COUNT; ++i) {
    birds.push(
      new Bird({
        canvas,
        ctx
      })
    );
  }

  score.reset();
}

/**
 * Handle the game
 */
function game() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Backgrou drawing
  background.draw();

  // Handle pipes
  let removePipe = false;
  for (const pipe of pipes) {
    pipe.update();
    pipe.draw();

    if (!pipe.passed && pipe.x + pipe.width < Bird.BIRD_START_POSITION) {
      pipe.passed = true;
      score.increase();
    }

    if (pipe.x + pipe.width < 0) {
      removePipe = true;
      pipes.push(
        new Pipe({
          canvas,
          ctx,
          x: pipes[pipes.length - 1].x + Pipe.PIPE_RANGE
        })
      );
    }
  }
  if (removePipe) pipes.shift();

  // Draw moving base
  base.update();
  base.draw();

  // Draw score
  score.draw();

  // handle birds
  let notAllBirdsDead = false;
  for (const bird of birds) {
    const rndJump = Math.random() > 0.95;
    if (rndJump) bird.jump();

    bird.update();

    bird.checkCollision(pipes);
    if (!bird.isDead) notAllBirdsDead = true;

    bird.draw();
  }

  // When all birds are dead we reset the game
  if (!notAllBirdsDead) {
    pipes.length = 0;
    birds.length = 0;
    initGame();
  }
}

setInterval(game, 1000 / FPS);
