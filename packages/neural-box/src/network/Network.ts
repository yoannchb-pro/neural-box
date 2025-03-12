import { randomUniform } from '../utils/randomUniform';
import { sigmoid } from '../utils/sigmoid';
import { ConenctionJson, Connection } from './Connection';
import { NeuralNode, NeuralNodeJson, NodeType } from './NeuralNode';

export type NetworkJson = {
  inputLength: number;
  outputLength: number;
  hiddenLength: number[];
  hiddenLayers: number;
  weightRange?: [number, number];

  connections: ConenctionJson[];
  nodes: NeuralNodeJson[];
};

type ConstructorProps = {
  inputLength: number;
  outputLength: number;
  hiddenLength?: number[];
  hiddenLayers?: number;

  weightRange?: [number, number];
};

export class Network {
  private currentNodeId = 0;

  public fitness: number = 0;

  private inputLength: number;
  private outputLength: number;
  private hiddenLength: number[];
  private hiddenLayers: number;

  private weightRange: ConstructorProps['weightRange'];

  public connections: Connection[] = [];
  public nodes: NeuralNode[] = [];

  constructor(params: ConstructorProps) {
    this.inputLength = params.inputLength;
    this.outputLength = params.outputLength;

    this.weightRange = params.weightRange;

    if (params.hiddenLength && params.hiddenLength.length !== params.hiddenLayers) {
      throw new Error(
        `Invalide parameter "hiddenLength": ${params.hiddenLength.length} (should be an array of the same size as "hiddenLayers": ${params.hiddenLayers}).`
      );
    }

    this.hiddenLayers = params.hiddenLayers ?? 0;
    this.hiddenLength = params.hiddenLength ?? [];
  }

  static fromJson(json: NetworkJson): Network {
    const network = new Network({
      inputLength: json.inputLength,
      outputLength: json.outputLength,
      hiddenLayers: json.hiddenLayers,
      hiddenLength: json.hiddenLength,
      weightRange: json.weightRange
    });

    for (const node of json.nodes) {
      network.nodes.push(
        new NeuralNode({
          id: node.id,
          layer: node.layer,
          nodeType: node.nodeType
        })
      );
    }

    for (const connection of json.connections) {
      const from = network.nodes.find(n => n.id === connection.fromId)!;
      const to = network.nodes.find(n => n.id === connection.toId)!;
      const con = new Connection({
        from,
        to,
        weight: connection.weight,
        weightRange: json.weightRange
      });
      network.connections.push(con);
    }

    return network;
  }

  toJson(): NetworkJson {
    return {
      connections: this.connections.map(c => c.toJson()),
      hiddenLayers: this.hiddenLayers,
      hiddenLength: this.hiddenLength,
      inputLength: this.inputLength,
      nodes: this.nodes.map(n => n.toJson()),
      outputLength: this.outputLength,
      weightRange: this.weightRange
    };
  }

  /**
   * Generate the full network with all connections and all nodes
   */
  generateFullNetwork() {
    let nodesOfPrecedentLayer: NeuralNode[] = [];

    // Input bias
    const bias = new NeuralNode({
      id: ++this.currentNodeId,
      layer: 0,
      nodeType: NodeType.BIAS
    });
    nodesOfPrecedentLayer.push(bias);
    this.nodes.push(bias);

    // Inputs
    for (let i = 0; i < this.inputLength; ++i) {
      const input = new NeuralNode({
        id: ++this.currentNodeId,
        layer: 0,
        nodeType: NodeType.INPUT
      });
      nodesOfPrecedentLayer.push(input);
      this.nodes.push(input);
    }

    for (let i = 0; i < this.hiddenLayers; ++i) {
      const layer = i + 1;

      const hiddenLength = this.hiddenLength[i];
      // Hidden bias
      const bias = new NeuralNode({
        id: ++this.currentNodeId,
        layer,
        nodeType: NodeType.BIAS
      });
      const hiddenCreatedNodes: NeuralNode[] = [bias];

      for (let j = 0; j < hiddenLength; ++j) {
        const hidden = new NeuralNode({
          id: ++this.currentNodeId,
          layer,
          nodeType: NodeType.HIDDEN
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
        layer: this.hiddenLayers + 1,
        nodeType: NodeType.OUTPUT
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
   * @param inputs
   * @returns
   */
  input(inputs: number[]): number[] {
    if (inputs.length !== this.inputLength) {
      throw new Error('Number of inputs must match the number of "inputLength".');
    }

    const inputNodes = this.nodes.filter(node => node.nodeType === NodeType.INPUT);
    const outputNodes = this.nodes.filter(node => node.nodeType === NodeType.OUTPUT);

    const inputsToReset = this.nodes.filter(
      node => node.nodeType !== NodeType.INPUT && node.nodeType !== NodeType.BIAS
    );
    const noneInputNodes = this.nodes.filter(node => node.nodeType !== NodeType.INPUT);

    // We reset the hiddens/output nodes
    for (const inputToReset of inputsToReset) {
      inputToReset.output = 0;
    }

    // We set the inputs node with the correct input value
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
      layer: connection.from.layer + 1,
      nodeType: NodeType.HIDDEN
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
      const fromIndex = Math.floor(randomUniform(0, this.nodes.length));
      const toIndex = Math.floor(randomUniform(0, this.nodes.length));

      if (fromIndex === toIndex) {
        attemptCount++;
        continue;
      }

      const from = this.nodes[fromIndex];
      const to = this.nodes[toIndex];

      const connectionExist = this.connections.some(con => con.from === from && con.to === con.to);

      if (from.layer === to.layer || connectionExist) {
        attemptCount++;
        continue;
      }

      const randomConnection = new Connection({
        from,
        to,
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
      hiddenLength: this.hiddenLength,
      weightRange: this.weightRange
    });

    const nodesCopy = [...this.getNodes().map(node => node.clone())];
    copy.setNodes(nodesCopy);

    const connectionsCopy = [
      ...this.getConnections().map(connection => {
        const clone = connection.clone();
        clone.from = nodesCopy.find(n => n.id === clone.from.id)!;
        clone.to = nodesCopy.find(n => n.id === clone.to.id)!;
        return clone;
      })
    ];
    copy.setConnections(connectionsCopy);

    return copy;
  }
}
