import { randomGaussian } from '../utils/randomGaussian';

export enum NodeType {
  HIDDEN,
  INPUT,
  OUTPUT
}

export type Bias = {
  mean?: number;
  stdDev?: number;
  min?: number;
  max?: number;
};

type ConstructorProps = {
  bias?: number | Bias;
  nodeType: NodeType;
};

export class NeuralNode {
  public output = 0;
  public bias: number;
  public nodeType: NodeType;

  constructor(params: ConstructorProps) {
    this.bias =
      typeof params.bias === 'object' && !!params.bias
        ? randomGaussian(params.bias.mean, params.bias.stdDev, params.bias.min, params.bias.max)
        : params.bias ?? 0;
    this.nodeType = params.nodeType;
  }

  clone() {
    const copy = new NeuralNode({
      bias: this.bias,
      nodeType: this.nodeType
    });
    copy.output = this.output;
    return copy;
  }
}
