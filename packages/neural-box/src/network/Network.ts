import { sigmoid } from '../utils/sigmoid';
import { Connection } from './Connection';
import { Biais, NeuralNode, NodeType } from './NeuralNode';

type ConstructorProps = {
  inputLength: number;
  outputLength: number;
  hiddenLength: number[] | number;
  hiddenLayers: number;

  biais?: Biais;
  weightRange?: [number, number];
  skipNetworkGeneration?: boolean;
};

export class Network {
  private inputLength: number;
  private outputLength: number;
  private hiddenLength: number[] | number;
  private hiddenLayers: number;

  private biais: ConstructorProps['biais'];
  private weightRange: ConstructorProps['weightRange'];

  private connections: Connection[] = [];
  private nodes: NeuralNode[] = [];

  constructor(params: ConstructorProps) {
    this.inputLength = params.inputLength;
    this.outputLength = params.outputLength;

    this.biais = params.biais;
    this.weightRange = params.weightRange;

    if (Array.isArray(params.hiddenLength) && params.hiddenLength.length !== params.hiddenLayers) {
      throw new Error(
        `Invalide parameter "hiddenLength" (should be an array of the same size as "hiddenLayers").`
      );
    }

    this.hiddenLayers = params.hiddenLayers;
    this.hiddenLength = params.hiddenLength;

    if (!params.skipNetworkGeneration) this.generateNetwork();
  }

  generateNetwork() {
    let nodesOfPrecedentLayer: NeuralNode[] = [];

    for (let i = 0; i < this.inputLength; ++i) {
      const input = new NeuralNode({
        nodeType: NodeType.INPUT,
        biais: 0
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
          biais: this.biais
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
        biais: this.biais
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

    // Set input values to input nodes
    this.nodes
      .filter(node => node.nodeType === NodeType.INPUT)
      .forEach((node, index) => {
        node.value = inputs[index];
      });

    // Process each layer
    let currentLayerNodes = this.nodes.filter(node => node.nodeType === NodeType.INPUT);
    for (let i = 0; i < this.hiddenLayers + 1; i++) {
      // +1 to include output layer
      const nextLayerNodes = this.nodes.filter(
        node => node.nodeType === (i < this.hiddenLayers ? NodeType.HIDDEN : NodeType.OUTPUT)
      );

      nextLayerNodes.forEach(node => {
        node.value = 0; // Reset value
        this.connections
          .filter(connection => connection.to === node)
          .forEach(connection => {
            node.value += connection.from.value * connection.weight;
          });
        node.value = sigmoid(node.value + node.biais); // Apply activation function and bias
      });

      currentLayerNodes = nextLayerNodes;
    }

    return this.nodes.filter(node => node.nodeType === NodeType.OUTPUT).map(node => node.value);
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
      hiddenLength: this.hiddenLength,
      skipNetworkGeneration: true // So we don't make useless calcul
    });

    const connectionsCopy = [...this.getConnections().map(connection => connection.clone())];
    copy.setConnections(connectionsCopy);

    const nodesCopy = [...this.getNodes().map(node => node.clone())];
    copy.setNodes(nodesCopy);

    return copy;
  }
}
