export enum NodeType {
  HIDDEN,
  INPUT,
  OUTPUT,
  BIAS
}

export type NeuralNodeJson = {
  id: number;
  layer: number;
  nodeType: NodeType;
};

type ConstructorProps = {
  id: number;
  layer: number;
  nodeType: NodeType;
};

export class NeuralNode {
  public id: number;
  public output = 0;
  public nodeType: NodeType;
  public layer: number;

  constructor(params: ConstructorProps) {
    this.id = params.id;
    this.nodeType = params.nodeType;
    this.layer = params.layer;
    if (this.nodeType === NodeType.BIAS) this.output = 1;
  }

  toJson(): NeuralNodeJson {
    return {
      id: this.id,
      layer: this.layer,
      nodeType: this.nodeType
    };
  }

  clone() {
    const copy = new NeuralNode({
      id: this.id,
      layer: this.layer,
      nodeType: this.nodeType
    });
    return copy;
  }
}
