import { sigmoid } from '../utils/sigmoid';
import { Connection } from './Connection';
import { Bias, NeuralNode, NodeType } from './NeuralNode';

type ConstructorProps = {
  inputLength: number;
  outputLength: number;
  hiddenLength?: number[] | number;
  hiddenLayers?: number;

  bias?: Bias;
  weightRange?: [number, number];
};

export class Network {
  private inputLength: number;
  private outputLength: number;
  private hiddenLength: number[] | number;
  private hiddenLayers: number;

  private bias: ConstructorProps['bias'];
  private weightRange: ConstructorProps['weightRange'];

  private connections: Connection[] = [];
  private nodes: NeuralNode[] = [];

  constructor(params: ConstructorProps) {
    this.inputLength = params.inputLength;
    this.outputLength = params.outputLength;

    this.bias = params.bias;
    this.weightRange = params.weightRange;

    if (Array.isArray(params.hiddenLength) && params.hiddenLength.length !== params.hiddenLayers) {
      throw new Error(
        `Invalide parameter "hiddenLength" (should be an array of the same size as "hiddenLayers").`
      );
    }

    this.hiddenLayers = params.hiddenLayers ?? 0;
    this.hiddenLength = params.hiddenLength ?? 0;
  }

  generateFullNetwork() {
    let nodesOfPrecedentLayer: NeuralNode[] = [];

    for (let i = 0; i < this.inputLength; ++i) {
      const input = new NeuralNode({
        nodeType: NodeType.INPUT,
        bias: 0
      });
      nodesOfPrecedentLayer.push(input);
      this.nodes.push(input);
    }

    for (let i = 0; i < this.hiddenLayers; ++i) {
      const hiddenLength = Array.isArray(this.hiddenLength)
        ? this.hiddenLength[i]
        : this.hiddenLength;

      const hiddenCreatedNodes: NeuralNode[] = [];
      for (let j = 0; j < hiddenLength; ++j) {
        const hidden = new NeuralNode({
          nodeType: NodeType.HIDDEN,
          bias: this.bias
        });

        // We create the connection with the precedents nodes
        for (const precedentLayerNode of nodesOfPrecedentLayer) {
          const connection = new Connection({
            from: precedentLayerNode,
            to: hidden,
            weightRange: this.weightRange
          });
          this.connections.push(connection);
        }

        hiddenCreatedNodes.push(hidden);
        this.nodes.push(hidden);
      }

      nodesOfPrecedentLayer = hiddenCreatedNodes;
    }

    for (let i = 0; i < this.outputLength; ++i) {
      const output = new NeuralNode({
        nodeType: NodeType.OUTPUT,
        bias: this.bias
      });

      // We create the connection with the precedents nodes
      for (const precedentLayerNode of nodesOfPrecedentLayer) {
        const connection = new Connection({
          from: precedentLayerNode,
          to: output,
          weightRange: this.weightRange
        });
        this.connections.push(connection);
      }

      this.nodes.push(output);
    }
  }

  /**
   * Calculate the output for a specific input
   */
  input(inputs: number[]): number[] {
    if (inputs.length !== this.inputLength) {
      throw new Error('Number of inputs must match the number of "inputLength".');
    }

    const inputNodes = this.nodes.slice(0, this.inputLength);
    const outputNodes = this.nodes.slice(this.nodes.length - this.outputLength);
    const noneInputNodes = this.nodes.slice(this.inputLength); // Hiddens and Outputs nodes

    // We reset every output
    for (const noneInputNode of noneInputNodes) {
      noneInputNode.output = 0;
    }

    // We set the inputs node zith the correct input value
    for (let i = 0; i < inputNodes.length; ++i) {
      inputNodes[i].output = inputs[i];
    }

    // For each connection we accumulate their contribution to the neuron
    // A neuron can have multiple entry connection this is why its an addition
    for (const connection of this.connections) {
      const nodeDest = connection.to;
      const contribution = connection.from.output * connection.weight;
      nodeDest.output += contribution;
    }

    // After we have accumulate the connection contribution to the neuron we add the bias
    // Then we apply the transformation function (expl: sigmoid)
    for (const noneInputNode of noneInputNodes) {
      noneInputNode.output += noneInputNode.bias;
      noneInputNode.output = sigmoid(noneInputNode.output);
    }

    return outputNodes.map(node => node.output);
  }

  getConnections() {
    return this.connections;
  }

  getNodes() {
    return this.nodes;
  }

  setConnections(connections: Connection[]) {
    this.connections = connections;
  }

  setNodes(nodes: NeuralNode[]) {
    this.nodes = nodes;
  }

  clone() {
    const copy = new Network({
      inputLength: this.inputLength,
      outputLength: this.outputLength,
      hiddenLayers: this.hiddenLayers,
      hiddenLength: this.hiddenLength
    });

    const connectionsCopy = [...this.getConnections().map(connection => connection.clone())];
    copy.setConnections(connectionsCopy);

    const nodesCopy = [...this.getNodes().map(node => node.clone())];
    copy.setNodes(nodesCopy);

    return copy;
  }
}
