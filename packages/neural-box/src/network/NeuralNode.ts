export enum NodeType {
  HIDDEN,
  INPUT,
  OUTPUT,
  BIAS
}

export type NeuralNodeJson = {
  id: number;
  nodeType: NodeType;
};

type ConstructorProps = {
  id: number;
  nodeType: NodeType;
};

export class NeuralNode {
  public id: number;
  public output = 0;
  public nodeType: NodeType;

  constructor(params: ConstructorProps) {
    this.id = params.id;
    this.nodeType = params.nodeType;
    if (this.nodeType === NodeType.BIAS) this.output = 1;
  }

  toJson(): NeuralNodeJson {
    return {
      id: this.id,
      nodeType: this.nodeType
    };
  }

  clone() {
    const copy = new NeuralNode({
      id: this.id,
      nodeType: this.nodeType
    });
    return copy;
  }
}
