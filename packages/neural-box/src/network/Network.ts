import { randomUniform } from '../utils/randomUniform';
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
  private currentNodeId = 0;

  public fitness: number = 0;

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

  /**
   * Generate the full network with all connections and all nodes
   */
  generateFullNetwork() {
    let nodesOfPrecedentLayer: NeuralNode[] = [];

    for (let i = 0; i < this.inputLength; ++i) {
      const input = new NeuralNode({
        id: ++this.currentNodeId,
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
          id: ++this.currentNodeId,
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
        id: ++this.currentNodeId,
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
   * Only generate the nodes
   */
  generateNodes() {
    for (let i = 0; i < this.inputLength; ++i) {
      const input = new NeuralNode({
        id: ++this.currentNodeId,
        nodeType: NodeType.INPUT,
        bias: 0
      });
      this.nodes.push(input);
    }

    for (let i = 0; i < this.hiddenLayers; ++i) {
      const hiddenLength = Array.isArray(this.hiddenLength)
        ? this.hiddenLength[i]
        : this.hiddenLength;

      for (let j = 0; j < hiddenLength; ++j) {
        const hidden = new NeuralNode({
          id: ++this.currentNodeId,
          nodeType: NodeType.HIDDEN,
          bias: this.bias
        });
        this.nodes.push(hidden);
      }
    }

    for (let i = 0; i < this.outputLength; ++i) {
      const output = new NeuralNode({
        id: ++this.currentNodeId,
        nodeType: NodeType.OUTPUT,
        bias: this.bias
      });
      this.nodes.push(output);
    }
  }

  /**
   * Calculate the output for a specific input
   * @param inputs
   * @returns
   */
  input(inputs: number[]): number[] {
    if (inputs.length !== this.inputLength) {
      throw new Error('Number of inputs must match the number of "inputLength".');
    }

    const inputNodes = this.nodes.filter(node => node.nodeType === NodeType.INPUT);
    const outputNodes = this.nodes.filter(node => node.nodeType === NodeType.OUTPUT);
    const noneInputNodes = this.nodes.filter(node => node.nodeType !== NodeType.INPUT); // Hiddens and Outputs nodes

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

  /**
   * Remove a specific connection
   * @param connection
   */
  removeConnection(connection: Connection) {
    const index = this.connections.findIndex(co => connection === co);
    if (index !== -1) this.connections.splice(index, 1);
  }

  /**
   * Remove a node
   * @param node
   */
  removeNode(node: NeuralNode) {
    this.nodes = this.nodes.filter(n => n !== node);
    this.connections = this.connections.filter(conn => conn.from !== node && conn.to !== node);
  }

  /**
   * Add a node in between a connection
   * @param connection
   */
  addNodeInConnection(connection: Connection) {
    this.removeConnection(connection);

    const newNode = new NeuralNode({
      id: ++this.currentNodeId,
      nodeType: NodeType.HIDDEN,
      bias: this.bias ?? 0
    });

    this.nodes.push(newNode);

    const connectionToNewNode = new Connection({
      from: connection.from,
      to: newNode,
      weightRange: this.weightRange
    });

    const connectionFromNewNode = new Connection({
      from: newNode,
      to: connection.to,
      weightRange: this.weightRange
    });

    this.connections.push(connectionToNewNode, connectionFromNewNode);
  }

  /**
   * Add a random connection
   * @returns
   */
  addRandomConnection() {
    let attemptCount = 0;
    const maxAttempts = this.nodes.length * this.nodes.length; // A simple upper limit based on the number of possible connections

    while (attemptCount < maxAttempts) {
      const fromIndex = randomUniform(0, this.nodes.length);
      const toIndex = randomUniform(0, this.nodes.length);

      if (fromIndex === toIndex) {
        attemptCount++;
        continue;
      }

      const randomConnection = new Connection({
        from: this.nodes[fromIndex],
        to: this.nodes[toIndex],
        weightRange: this.weightRange
      });

      const exists = this.connections.some(
        connection =>
          connection.from === randomConnection.from && connection.to === randomConnection.to
      );

      if (!exists) {
        this.connections.push(randomConnection); // Assuming this.connections is the array holding all connections
        return randomConnection;
      }

      attemptCount++;
    }

    throw new Error('Failed to add a new connection: too many attempts.');
  }

  getWeightRange() {
    return this.weightRange ?? Connection.DEFAULT_WEIGHT_RANGE;
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

  /**
   * Clone the current network
   * @returns
   */
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
