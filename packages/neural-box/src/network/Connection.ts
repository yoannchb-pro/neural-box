import { randomUniform } from '../utils/randomUniform';
import type { NeuralNode } from './NeuralNode';

type ConstructorProps = {
  from: NeuralNode;
  to: NeuralNode;
  weight?: number;
  weightRange?: [number, number];
};

export class Connection {
  public from: NeuralNode;
  public to: NeuralNode;
  public weight: number;

  constructor(params: ConstructorProps) {
    this.from = params.from;
    this.to = params.to;
    this.weight =
      params.weight ??
      randomUniform(params.weightRange?.[0] ?? -0.5, params.weightRange?.[1] ?? 0.5);
  }

  clone() {
    const copy = new Connection({
      from: this.from,
      to: this.to,
      weight: this.weight
    });
    return copy;
  }
}
