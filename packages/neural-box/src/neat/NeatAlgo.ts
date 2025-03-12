import { Network } from '../network/Network';
import { NodeType } from '../network/NeuralNode';
import { randomUniform } from '../utils/randomUniform';

type ConstructorParams = {
  mutationsChances?: {
    newConnection?: number;
    newNode?: number;
    weightModification?: number;
    removeNode?: number;
    disableConnection?: number;
    enableConnection?: number;
  };
};

const defaultMutationsChances: Required<ConstructorParams['mutationsChances']> = {
  disableConnection: 0.1,
  enableConnection: 0.1,
  newConnection: 0.1,
  newNode: 0.1,
  removeNode: 0.1,
  weightModification: 0.9
};

export class NeatAlgo {
  private mutationsChances: Required<Required<ConstructorParams>['mutationsChances']>;

  constructor(params: ConstructorParams = {}) {
    this.mutationsChances = Object.assign({}, defaultMutationsChances, params.mutationsChances);
  }

  crossover() {}

  mutate(network: Network) {
    const connections = network.getConnections();
    const nodes = network.getNodes();

    // Weight modification
    if (Math.random() <= this.mutationsChances.weightModification && connections.length > 0) {
      const rndConnection = Math.floor(randomUniform(0, connections.length));
      const [minWeight, maxWeight] = network.getWeightRange();
      const newWeight = randomUniform(minWeight, maxWeight);
      connections[rndConnection].weight = newWeight;
    }

    // New connection
    if (Math.random() <= this.mutationsChances.newConnection) {
      network.addRandomConnection();
    }

    // New hidden node
    if (Math.random() <= this.mutationsChances.newNode && connections.length > 0) {
      const rndConnection = Math.floor(randomUniform(0, connections.length));
      network.addNodeInConnection(connections[rndConnection]);
    }

    // Remove hidden node
    if (Math.random() <= this.mutationsChances.removeNode && nodes.length > 0) {
      const removableNodes = nodes.filter(node => node.nodeType === NodeType.HIDDEN);
      if (removableNodes.length > 0) {
        const rndNode = Math.floor(randomUniform(0, removableNodes.length));
        network.removeNode(removableNodes[rndNode]);
      }
    }

    // Disable connection
    if (Math.random() <= this.mutationsChances.disableConnection && connections.length > 0) {
      const noBiasConnections = connections.filter(
        con => con.from.nodeType !== NodeType.BIAS && con.to.nodeType !== NodeType.BIAS
      );

      if (noBiasConnections.length > 0) {
        const rndConnection = Math.floor(randomUniform(0, noBiasConnections.length));
        noBiasConnections[rndConnection].enabled = false;
      }
    }

    // Enable connection
    if (Math.random() <= this.mutationsChances.enableConnection) {
      const disabledConnections = connections.filter(connection => !connection.enabled);

      const noBiasDisabledConnections = disabledConnections.filter(
        con => con.from.nodeType !== NodeType.BIAS && con.to.nodeType !== NodeType.BIAS
      );

      if (noBiasDisabledConnections.length > 0) {
        const rndConnection = Math.floor(randomUniform(0, noBiasDisabledConnections.length));
        noBiasDisabledConnections[rndConnection].enabled = true;
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
