/**
 * Sigmoid function to turn any number into the range from 0 to 1
 * Usefull for probability
 * @param x
 * @returns
 */
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}
