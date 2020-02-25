import {
  getNodes,
  getDistance,
  getOrderVisited,
  getUnvisitedNodes
} from "./Dijkstra";

export const Astar = (grid, startNode, targetNode) => {
  let openNodes = [],
    closedNodes = [],
    currentNode = startNode;
  let nodeList = getNodes(grid);
  startNode.hueDist = heuristic(startNode, targetNode);
  openNodes.push(startNode);

  currentNode.g = heuristic(currentNode, startNode);
  currentNode.f = currentNode.hueDist + currentNode.g;
};

export const heuristic = (startNode, targetNode) => {
  return (
    abs(startNode.row - targetNode.row) + abs(startNode.col - targetNode.col)
  );
};

export const surrounded = (grid, target) => {
  let neighbours = getUnvisitedNodes(grid, target);
  let value = false;
  neighbours.forEach(item => {
    if (item.isWall) value = true;
  });
  return value;
};
