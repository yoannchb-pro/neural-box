import { randomGaussian } from '../utils/randomGaussian';

export enum NodeType {
  HIDDEN,
  INPUT,
  OUTPUT
}

export type Biais = {
  mean?: number;
  stdDev?: number;
  min?: number;
  max?: number;
};

type ConstructorProps = {
  biais?: number | Biais;
  nodeType: NodeType;
};

export class NeuralNode {
  public value: number = 0;
  public biais: number;
  public nodeType: NodeType;

  constructor(params: ConstructorProps) {
    this.biais =
      typeof params.biais === 'object' && !!params.biais
        ? randomGaussian(params.biais.mean, params.biais.stdDev, params.biais.min, params.biais.max)
        : params.biais ?? 0;
    this.nodeType = params.nodeType;
  }

  clone() {
    const copy = new NeuralNode({
      biais: this.biais,
      nodeType: this.nodeType
    });
    copy.value = this.value;
    return copy;
  }
}
