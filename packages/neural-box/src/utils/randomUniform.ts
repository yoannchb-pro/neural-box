/**
 * Uniform distribution of a random number in a range
 * @param min
 * @param max
 * @returns
 */
export function randomUniform(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
