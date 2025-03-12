import { NetworkJson } from '../network/Network';
import { NodeType } from '../network/NeuralNode';

export function drawNeuralNetwork(json: NetworkJson, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const nodePositions: Record<number, { x: number; y: number }> = {};

  const inputNodes = json.nodes.filter(n => n.nodeType === NodeType.INPUT);
  const biasNodes = json.nodes.filter(n => n.nodeType === NodeType.BIAS);
  const hiddenNodes = json.nodes.filter(n => n.nodeType === NodeType.HIDDEN);
  const outputNodes = json.nodes.filter(n => n.nodeType === NodeType.OUTPUT);

  const layers: number[][] = [];
  layers.push([...inputNodes.map(n => n.id), ...biasNodes.map(n => n.id)]);
  if (hiddenNodes.length > 0) layers.push(hiddenNodes.map(n => n.id));
  layers.push(outputNodes.map(n => n.id));

  const paddingX = canvas.width * 0.1;
  const paddingY = canvas.height * 0.1;
  const usableWidth = canvas.width - 2 * paddingX;
  const usableHeight = canvas.height - 2 * paddingY;

  const spacingX = usableWidth / (layers.length - 1);
  const maxNodes = Math.max(...layers.map(layer => layer.length));
  const spacingY = maxNodes > 1 ? usableHeight / (maxNodes - 1) : 0;

  const nodeRadius = Math.max(5, Math.min(15, canvas.width / 50));
  const minLineWidth = 1;
  const maxLineWidth = Math.max(3, canvas.width / 100);

  layers.forEach((layer, layerIndex) => {
    const x = paddingX + layerIndex * spacingX;
    layer.forEach((nodeId, i) => {
      const y = paddingY + i * spacingY;
      nodePositions[nodeId] = { x, y };
    });
  });

  json.connections.forEach(conn => {
    if (!conn.enabled) return;
    const from = nodePositions[conn.fromId];
    const to = nodePositions[conn.toId];
    if (!from || !to) return;

    const weight = Math.abs(conn.weight);
    ctx.strokeStyle = conn.weight > 0 ? 'blue' : 'red';
    ctx.lineWidth = minLineWidth + weight * (maxLineWidth - minLineWidth);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });

  json.nodes.forEach(node => {
    const pos = nodePositions[node.id];
    if (!pos) return;

    ctx.fillStyle =
      node.nodeType === NodeType.BIAS
        ? 'grey'
        : node.nodeType === NodeType.HIDDEN
          ? 'orange'
          : node.nodeType === NodeType.INPUT
            ? 'cyan'
            : 'yellow';

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
  });
}
