import { drawNeuralNetwork, NeatAlgo } from '../../neural-box/src';
import { Network } from '../../neural-box/src';
import { Background } from './game/Background';
import { Base } from './game/Base';
import { Bird } from './game/Bird';
import { Pipe } from './game/Pipe';
import { Score } from './game/Score';

let BIRDS_COUNT = 50;
const FPS = 60;
let SPEED = 1;
let GAME_CLOCK: NodeJS.Timeout;

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;
const speedSettings = document.querySelector('#speed-container')!;
const birdsCountSettings = document.querySelector('#birds-count-container')!;
const generation = document.querySelector('#generation')!;
const bestScore = document.querySelector('#best-score')!;
const model = document.querySelector('#model') as HTMLTextAreaElement;
const loadModelBtn = document.querySelector('#load-btn')!;
const loadModelTextarea = document.querySelector('#model-to-load') as HTMLTextAreaElement;
const drawing = document.querySelector('#drawing') as HTMLCanvasElement;

const neat = new NeatAlgo();
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
function initGame(bestBirdBrain?: Network) {
  pipes.length = 0;
  birds.length = 0;
  score.reset();

  // Set the generation and best score
  generation.textContent = String(Number(generation.textContent) + 1);
  bestScore.textContent = String(Math.max(Number(bestScore.textContent), score.getScore()));

  // Init pipes
  for (let i = 0; i < canvas.height; i += Pipe.PIPE_RANGE) {
    const pipe = new Pipe({
      canvas,
      ctx,
      x: canvas.width + i
    });
    pipes.push(pipe);
  }

  const createBird = (brain?: Network) =>
    new Bird({
      canvas,
      ctx,
      brain
    });

  // Init birds
  let numberOfBirds = BIRDS_COUNT;
  if (bestBirdBrain) {
    const bird = createBird(bestBirdBrain.clone());
    birds.push(bird);
    numberOfBirds -= 1;
  }
  for (let i = 0; i < numberOfBirds; ++i) {
    let brain: Network | undefined = undefined;
    // we want to generate some random birds too
    if (bestBirdBrain && i % 10 !== 0) {
      brain = bestBirdBrain.clone();
      neat.mutate(brain);
    }
    const bird = createBird(brain);
    birds.push(bird);
  }
}

/**
 * Get the best network
 */
function getBestNetwork() {
  birds.sort((a, b) => b.getFitness() - a.getFitness());
  const bestBird = birds[0];
  return bestBird.brain;
}

/**
 * Update the best model
 */
function updateBestModel() {
  const network = getBestNetwork().toJson();
  model.value = JSON.stringify(network);
  drawNeuralNetwork(network, drawing);
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

  // Handle birds
  let notAllBirdsDead = false;
  const closerPipe = pipes.find(pipe => pipe.x + pipe.width > Bird.BIRD_START_POSITION)!;
  for (const bird of birds) {
    const pipeXDistance = closerPipe.x - Bird.BIRD_START_POSITION;
    const pipeUpY = closerPipe.height;
    const pipeBottomY = closerPipe.height + Pipe.PIPE_DISTANCE;

    const output = bird.brain.input([bird.getY(), pipeXDistance, pipeUpY, pipeBottomY])[0];
    const shouldJump = output > 0.5;
    if (shouldJump) bird.jump();

    bird.update();

    bird.checkCollision(pipes);
    if (!bird.isDead) notAllBirdsDead = true;

    bird.draw();
  }

  updateBestModel();

  // When all birds are dead we reset the game
  if (!notAllBirdsDead) {
    const bestNetwork = getBestNetwork();
    initGame(bestNetwork);
  }
}

// Settings
birdsCountSettings.addEventListener('click', () => {
  const selectedBtn = birdsCountSettings.querySelector('input:checked') as HTMLInputElement;
  BIRDS_COUNT = Number(selectedBtn.value);
});

speedSettings.addEventListener('click', () => {
  const selectedBtn = speedSettings.querySelector('input:checked') as HTMLInputElement;
  SPEED = Number(selectedBtn.value);
  clearInterval(GAME_CLOCK);
  GAME_CLOCK = setInterval(game, 1000 / FPS / SPEED);
});

// Update model
loadModelBtn.addEventListener('click', () => {
  try {
    const networkJson = JSON.parse(loadModelTextarea.value?.trim());
    loadModelTextarea.value = '';

    const network = Network.fromJson(networkJson);
    initGame(network);
  } catch (e: any) {
    console.error(e);
    loadModelTextarea.value = e;
  }
});

// Init and start game
initGame();

GAME_CLOCK = setInterval(game, 1000 / FPS / SPEED);
