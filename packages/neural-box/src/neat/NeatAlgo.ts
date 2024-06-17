import { Network } from '../network/Network';
import { randomUniform } from '../utils/randomUniform';

type ConstructorParams = {
  mutationsChances?: {
    newConnection?: number;
    newNode?: number;
    weightModification?: number;
    removeNode?: number;
    removeConnection?: number;
    disableConnection?: number;
    enableConnection?: number;
  };
};

const defaultMutationsChances: Required<ConstructorParams['mutationsChances']> = {
  disableConnection: 0.1,
  enableConnection: 0.1,
  newConnection: 0.1,
  newNode: 0.1,
  removeConnection: 0.1,
  removeNode: 0.1,
  weightModification: 0.9
};

export class NeatAlgo {
  private mutationsChances: Required<Required<ConstructorParams>['mutationsChances']>;

  constructor(params: ConstructorParams) {
    this.mutationsChances = Object.assign({}, defaultMutationsChances, params.mutationsChances);
  }

  crossover() {}

  mutate(network: Network) {
    const connections = network.getConnections();
    const nodes = network.getNodes();

    // Weight modification
    if (Math.random() <= this.mutationsChances.weightModification && connections.length > 0) {
      const rndConnection = randomUniform(0, connections.length);
      const [minWeight, maxWeight] = network.getWeightRange();
      const newWeight = randomUniform(minWeight, maxWeight);
      connections[rndConnection].weight = newWeight;
    }

    // New connection
    if (Math.random() <= this.mutationsChances.newConnection) {
      network.addRandomConnection();
    }

    // Remove connection
    if (Math.random() <= this.mutationsChances.removeConnection && connections.length > 0) {
      const rndConnection = randomUniform(0, connections.length);
      network.removeConnection(connections[rndConnection]);
    }

    // New node
    if (Math.random() <= this.mutationsChances.newNode && connections.length > 0) {
      const rndConnection = randomUniform(0, connections.length);
      network.addNodeInConnection(connections[rndConnection]);
    }

    // Remove node
    if (Math.random() <= this.mutationsChances.removeNode && nodes.length > 0) {
      const rndNode = randomUniform(0, nodes.length);
      network.removeNode(nodes[rndNode]);
    }

    // Disable connection
    if (Math.random() <= this.mutationsChances.disableConnection && connections.length > 0) {
      const rndConnection = randomUniform(0, connections.length);
      connections[rndConnection].enbaled = false;
    }

    // Enable connection
    if (Math.random() <= this.mutationsChances.enableConnection) {
      const disabledConnections = connections.filter(connection => !connection.enbaled);
      if (disabledConnections.length > 0) {
        const rndConnection = randomUniform(0, disabledConnections.length);
        disabledConnections[rndConnection].enbaled = true;
      }
    }
  }

  generateChildrens(networks: Network[], numberOfChildrens: number): Network[] {
    const childrens: Network[] = [];

    for (let i = 0; i < numberOfChildrens; ++i) {
      // TODO
    }

    return childrens;
  }
}
