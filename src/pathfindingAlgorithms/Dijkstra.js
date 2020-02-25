const testGrid = [];
for (let i = 0; i < 20; i++) {
  const col = [];
  for (let j = 0; j < 50; j++) {
    col.push({
      row: i,
      col: j,
      isWall: false,
      isObstacle: false,
      isWeight: false,
      distance: Infinity,
      visited: false,
      previousNode: null
    });
  }
  testGrid.push(col);
}

export const dijkstra = (grid, startNode, targetNode) => {
  let visitedNodes = [],
    closestNode;

  grid[startNode.row][startNode.col].distance = 0;
  let unvisitedNodes = getNodes(grid);
  while (unvisitedNodes.length) {
    sortDistances(unvisitedNodes);
    closestNode = unvisitedNodes.shift();

    if (closestNode.distance === Infinity) {
      return visitedNodes;
    }

    if (
      getUnvisitedNodes(grid, targetNode).includes(
        item => item.row === closestNode.row && item.col === closestNode.col
      )
    ) {
      return visitedNodes;
    }
    closestNode.visited = true;
    visitedNodes.push(closestNode);
    grid[closestNode.row][closestNode.col].visited = true;
    updateUnvisitedNodes(grid, closestNode, unvisitedNodes);
  }
  return visitedNodes;
};

const sortDistances = array => {
  array.sort((a, b) => a.distance - b.distance);
};

const updateUnvisitedNodes = (grid, node, unvisitedNodes) => {
  let nodes = getUnvisitedNodes(grid, node);

  nodes.forEach(item => {
    unvisitedNodes = unvisitedNodes.map(arrayNode => {
      if (
        arrayNode.row === item.row &&
        arrayNode.col === item.col &&
        !arrayNode.isWall
      ) {
        arrayNode.distance =
          Math.abs(node.row - arrayNode.row) +
          Math.abs(node.col - arrayNode.col);
        if (arrayNode.isWeight) arrayNode.distance += 10;
        arrayNode.previousNode = { ...node };
        return arrayNode;
      }

      return arrayNode;
    });
  });
  unvisitedNodes = unvisitedNodes.map(item => {
    if (item.row === node.row && item.col === node.col) {
      item.visited = true;
      //return item;
    }

    return item;
  });
  grid[node.row][node.col].visited = true;
};

const getDistance = (grid, startNode) => {
  grid.forEach((row, i) =>
    row.forEach(node => {
      if (!node.isWall) {
        node.distance =
          Math.abs(node.row - startNode.row) +
          Math.abs(node.col - startNode.col);
        if (node.isWeight) node.distance += 10;
      }
    })
  );
};

const getUnvisitedNodes = (grid, startNode) => {
  let arr = [];
  if (startNode.row > 0) arr.push(grid[startNode.row - 1][startNode.col]);
  if (startNode.row < grid.length - 1)
    arr.push(grid[startNode.row + 1][startNode.col]);
  if (startNode.col < grid[0].length - 1)
    arr.push(grid[startNode.row][startNode.col + 1]);
  if (startNode.col > 0) arr.push(grid[startNode.row][startNode.col - 1]);
  return arr.filter(item => !item.visited);
};

export const getOrderVisited = node => {
  const final = [];
  while (node) {
    final.unshift(node);
    node = node.previousNode;
  }
  return final;
};

const getNodes = grid => {
  const nodes = [];
  grid.forEach(row => row.forEach(node => nodes.push(node)));
  return nodes;
};

const testArr = getNodes(testGrid);

let startNode = testGrid[4][3],
  targetNode = testGrid[18][43];
startNode.isStart = true;

//testGrid[3][3].isWall = true;
//testGrid[5][3].isWall = true;
//testGrid[4][2].isWall = true;
//testGrid[4][4].isWall = true;
//const unvisitedNodes = getUnvisitedNodes(testGrid, startNode);
//
let finalGrid = dijkstra(testGrid, startNode, targetNode);
const orderedNodes = getOrderVisited(targetNode);
