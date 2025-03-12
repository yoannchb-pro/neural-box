import { randomUniform } from '../utils/randomUniform';
import type { NeuralNode } from './NeuralNode';

type ConstructorProps = {
  from: NeuralNode;
  to: NeuralNode;
  weight?: number;
  weightRange?: [number, number];
};

export type ConenctionJson = {
  innovationNumber: number;
  fromId: number;
  toId: number;
  weight: number;
  enabled: boolean;
};

class InnovationNumberManager {
  private static currentInnovationNumber = 0;
  private static innovationHistory: Map<string, number> = new Map();

  static getInnovationNumber(fromNodeId: number, toNodeId: number): number {
    const key = `${fromNodeId}-${toNodeId}`;

    if (this.innovationHistory.has(key)) {
      return this.innovationHistory.get(key)!;
    }

    const newInnovationNumber = this.currentInnovationNumber++;
    this.innovationHistory.set(key, newInnovationNumber);
    return newInnovationNumber;
  }
}

export class Connection {
  public innovationNumber: number;

  public from: NeuralNode;
  public to: NeuralNode;
  public weight: number;
  public enabled = true;

  public static DEFAULT_WEIGHT_RANGE = [-0.5, 0.5];

  constructor(params: ConstructorProps) {
    this.innovationNumber = InnovationNumberManager.getInnovationNumber(
      params.from.id,
      params.to.id
    );
    this.from = params.from;
    this.to = params.to;
    this.weight =
      params.weight ??
      randomUniform(
        params.weightRange?.[0] ?? Connection.DEFAULT_WEIGHT_RANGE[0],
        params.weightRange?.[1] ?? Connection.DEFAULT_WEIGHT_RANGE[1]
      );
  }

  toJson(): ConenctionJson {
    return {
      innovationNumber: this.innovationNumber,
      enabled: this.enabled,
      fromId: this.from.id,
      toId: this.to.id,
      weight: this.weight
    };
  }

  clone() {
    const copy = new Connection({
      from: this.from,
      to: this.to,
      weight: this.weight
    });
    copy.enabled = this.enabled;
    return copy;
  }
}
