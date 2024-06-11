/**
 * Generates a random number following a standard normal distribution (mean 0, standard deviation 1).
 * Uses the Box-Muller transform.
 * @returns A random number following a standard normal distribution.
 */
export function randomGaussianStandard(): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // Convert [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Generates a random number following a normal distribution with a specified mean and standard deviation,
 * then transforms it to fit within the specified range [min, max] if provided.
 * @param mean - The mean of the distribution.
 * @param stdDev - The standard deviation of the distribution.
 * @param min - The lower bound of the range. Default is -Infinity.
 * @param max - The upper bound of the range. Default is Infinity.
 * @returns A random number following a normal distribution transformed to fit within the specified range.
 */
export function randomGaussian(
  mean: number = 0,
  stdDev: number = 1,
  min: number = -Infinity,
  max: number = Infinity
): number {
  let gaussian;
  do {
    gaussian = randomGaussianStandard() * stdDev + mean;
  } while (gaussian < min || gaussian > max);
  return gaussian;
}
