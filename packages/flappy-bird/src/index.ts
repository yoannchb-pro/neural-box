import { Background } from './core/Background';
import { Base } from './core/Base';
import { Bird } from './core/Bird';
import { Pipe } from './core/Pipe';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const bird = new Bird({
  canvas,
  ctx
});
const background = new Background({
  canvas,
  ctx
});
const base = new Base({
  canvas,
  ctx
});
const pipe = new Pipe({
  canvas,
  ctx
});

function game() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  background.draw();

  pipe.update();
  pipe.draw();

  base.update();
  base.draw();

  bird.update();
  bird.draw();
}

document.addEventListener('keydown', event => {
  if (event.key === ' ') bird.jump();
});
setInterval(game, 1000 / 30);
