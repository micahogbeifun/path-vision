import React, { Component, Fragment } from "react";

import Top from "./Menu/Top/Top";
import Side from "./Menu/Side/Side";
import "./App.css";
import Node from "./Node";
import {
  dijkstra,
  getOrderVisited,
} from "../src/pathfindingAlgorithms/Dijkstra";

class App extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  state = {
    algorithm: "",
    maze: "",
    speed: "fast",
    sideMenu: false,
    envision: false,
    obstacle: false,
    clearBoard: false,
    clearWAW: false,
    clearPath: false,
    nodeInfo: [
      { text: "start node", icon: "chevron-forward-circle" },
      { text: "target node", icon: "stop-circle" },
      { text: "obstacle node", icon: "nuclear" },
      { text: "weighted node", icon: "cube" },
      { text: "untouched node", icon: "ellipse-outline", color: ["#7ce7ab"] },
      { text: "touched nodes", icon: "ellipse", color: ["#009842", "#FF6239"] },
      { text: "shortest-path node", icon: "ellipse", color: ["#C5F637"] },
      { text: "wall node", icon: "ellipse", color: ["#A02100"] },
    ],
    algorithmInfo: {
      "dijkstra's algorithms": { weighted: true, shortest: true },
      // "a* search": { weighted: true, shortest: true },
      // "greedy best-first search": { weighted: true, shortest: false },
      // "swarm algorithm": { weighted: true, shortest: false },
      // "convergent swarm algorithm": { weighted: true, shortest: false },
      // "bio-directional swarm algorithm": { weighted: true, shortest: false },
      // "breath-first search": { weighted: false, shortest: true },
      // "depth-first search": { weighted: false, shortest: false }
    },
    grid: { rows: 20, columns: 50 },
    startCell: { row: 15, col: 10 },
    endCell: { row: 4, col: 40 },
    obstacleCell: { row: null, col: null },
    startCellDefault: { row: 15, col: 10 },
    endCellDefault: { row: 4, col: 40 },
    movingStart: false,
    movingTarget: false,
    movingObstacle: false,
    mouseDown: false,
    currentNode: {},
    addingWall: false,
    target: {},
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.showingPath && !this.state.showingPath) {
      this.setState({ envision: false });
    }
    if (this.state.algoNodes) {
      this.visualiseMultple();
    }
  };

  componentDidMount = () => {
    this.initialiseGrid();
    document.addEventListener("keydown", this._handleKeyDown);
    document.addEventListener("keyup", this._handleKeyUp);
    document.addEventListener("mouseup", () => {
      if (this.state.mouseDown) this.setState({ mouseDown: false });
    });
  };
  componentWillUnmount = () => {
    document.removeEventListener("keydown", this._handleKeyDown);
    document.removeEventListener("keyup", this._handleKeyUp);
    this.myRef.current.removeEventListener("mousedown", this._handleMouseDown);
    this.myRef.current.removeEventListener("mouseup", this._handleMouseUp);
  };

  dragStart = (e) => {
    console.log(e, "e");
    if (e.target.className.split(" ").includes("grid-cell")) {
      console.log(e.target);
    }
  };
  _handleKeyDown = (event) => {
    if (event.keyCode === 87 && !this.state.weightKey) {
      this.setState({ weightKey: true });
    }
  };
  _handleKeyUp = (event) => {
    if (event.keyCode === 87 && this.state.weightKey) {
      this.setState({ weightKey: false });
    }
  };
  _handleMouseDown = (event) => {
    event.preventDefault();
    if (!this.state.mouseDown) {
      this.setState({ mouseDown: true });
    }
  };
  _handleMouseUp = (event) => {
    event.preventDefault();
    if (this.state.mouseDown) {
      this.setState({ mouseDown: false });
    }
    this.nothingMoving();
  };

  setAlgorithmHandler = (algorithm) => {
    this.setState({ algorithm });
  };
  setMazeHandler = (maze) => {
    this.setState({ maze });
  };
  setSpeedHandler = (speed) => {
    this.setState({ speed });
  };

  setEnvisionHandler = (envision) => {
    this.setState((prevState) => {
      return { envision: !prevState.envision };
    });
    this.showEnvisionHandler();
  };

  showSideMenuHandler = () => {
    this.setState((prevState) => {
      return { sideMenu: !prevState.sideMenu };
    });
  };

  editBoard = (item) => {
    switch (item) {
      case "obstacle":
        this.obstacleHandler();
        break;
      case "clearWAW":
        this.clearBoardHandler();
        break;
      case "clearBoard":
        this.clearBoardHandler("all");
        break;
      case "clearPath":
        this.clearPathHandler("all");
        break;
      default:
        this.setState({ item: true });
    }
  };
  obstacleHandler = () => {
    const { obstacleCell, gridTable } = this.state;
    let notOccupied =
      !(
        this.state.startCell.row === obstacleCell.row &&
        this.state.startCell.col === obstacleCell.col
      ) &&
      !(
        this.state.endCell.row === obstacleCell.row &&
        this.state.endCell.col === obstacleCell.col
      );
    let initial =
      !this.state.obstacle &&
      ((this.state.startCell.row === 10 && this.state.startCell.col === 25) ||
        (this.state.endCell.row === 10 && this.state.endCell.col === 25));
    if (notOccupied && !initial) {
      gridTable[10][25].isObstacle = true;
      this.setState((prevState) => {
        if (prevState.obstacle)
          gridTable.forEach((row) =>
            row.forEach((node) => (node.isObstacle = false))
          );
        return {
          gridTable,
          obstacle: !prevState.obstacle,
          obstacleCell: { row: 10, col: 25 },
        };
      });
    }
  };
  info = this.state.nodeInfo.map((item, i) => {
    return (
      <li key={i} className="info-item">
        {!item.color ? (
          <span className="info-icon regular">
            <ion-icon name={item.icon}></ion-icon>
          </span>
        ) : (
          item.color.map((itemColor, j) => {
            return (
              <Fragment key={j}>
                <span className="info-icon">
                  <ion-icon
                    style={{ color: itemColor }}
                    name={item.icon}
                  ></ion-icon>
                </span>
              </Fragment>
            );
          })
        )}
        <span className="info-text">{item.text}</span>
      </li>
    );
  });
  setRef = (node) => {
    const { gridTable } = this.state;
    if (!gridTable[node.row][node.col].ref) {
      gridTable[node.row][node.col].ref = node.ref;
      this.setState({ gridTable });
    }
  };
  showEnvisionHandler = () => {
    let gridTable = [...this.state.gridTable.map((row) => row.slice(0))];

    this.setState({ ordered: null });
    gridTable.forEach((row) =>
      row.forEach((node) => {
        node.ref.current.classList.remove("visited", "animating", "multiple");
        node.previousNode = null;
        node.distance = Infinity;
      })
    );
    let startNode, targetNode, obstacleNode;
    gridTable.forEach((row) =>
      row.forEach((node) => {
        if (node.isStart) startNode = node;
        if (node.isTarget) targetNode = node;
        if (node.isObstacle) obstacleNode = node;
      })
    );
    if (obstacleNode) {
      let nodes = [startNode, obstacleNode, targetNode];
      this.setState({ algoNodes: nodes, algoIndex: 0, multiple: true });
    } else {
      this.handleAlgorithm(gridTable, startNode, targetNode);
    }
  };
  visualiseMultple = () => {
    let gridTable = this.state.gridTable;

    let nodes = this.state.algoNodes,
      index = this.state.algoIndex;

    if (index === nodes.length - 1) {
      if (this.state.finalNode)
        this.setState({ finalNode: false, algoNodes: null });
      if (this.state.multiple) {
        const { endCell } = this.state;
        gridTable.forEach((row) =>
          row.forEach((node) => {
            if (node.row === endCell.row && node.col === endCell.col)
              node.isTarget = true;
            else node.isTarget = false;
          })
        );
        this.setState({ gridTable, multiple: false });
      }
      return;
    }
    if (index === nodes.length - 2 && !this.state.finalNode) {
      this.setState({ finalNode: true });
    }

    if (!this.state.searching) {
      let first = nodes[index],
        second = nodes[index + 1];
      gridTable.forEach((row) =>
        row.forEach((node) => {
          if (node.row === second.row && node.col === second.col) {
            node.isTarget = true;
          } else {
            node.isTarget = false;
          }
        })
      );
      this.setState({ gridTable });
      this.handleAlgorithm(gridTable, first, second);
      gridTable = this.state.gridTable;
      gridTable.forEach((row) =>
        row.forEach((node) => {
          //node.ref.current.classList.remove("visited", "multiple");
          node.previousNode = null;
          node.distance = Infinity;
        })
      );

      this.setState({ gridTable, algoIndex: index + 1 });
    }
  };
  handleAlgorithm = (gridTable, startNode, targetNode) => {
    let dijkstraArray = dijkstra(gridTable, startNode, targetNode);
    let ordered = getOrderVisited(targetNode);
    gridTable.forEach((row) => row.forEach((node) => (node.visited = false)));
    this.setState({ gridTable, ordered });

    this.animate(dijkstraArray, ordered);
  };

  animate = (algoArray, ordered) => {
    const newGrid = [...this.state.gridTable];

    this.setState({ searching: true });
    const { finalNode } = this.state;
    // if (counter < algoArray.length && !found) {
    //   setTimeout(() => {
    //     newGrid[algoArray[counter].row][algoArray[counter].col].visited = true;
    //     this.setState(() => ({ gridTable: newGrid }));
    //     counter++;
    //     this.animate(counter, algoArray);
    //   }, 0.5);
    // } else {
    //   this.setState({
    //     searching: false
    //   });
    //   this.animatePath(0);
    // }
    let target = algoArray.findIndex((item) => item.isTarget);
    const { speed } = this.state;
    let timeout = speed === "fast" ? 10 : speed === "average" ? 50 : 100;
    for (let i = 0; i <= algoArray.length; i++) {
      const node = algoArray[i];

      if (!node) {
        this.setState({ envision: false });
        break;
      }

      setTimeout(() => {
        let path =
          newGrid[node.row][node.col].ref.current.classList[1] === "animating";
        if (!path) {
          if (finalNode || !this.state.multiple) {
            newGrid[node.row][node.col].ref.current.classList.remove(
              "multiple"
            );
            newGrid[node.row][node.col].ref.current.classList.add("visited");
          } else {
            newGrid[node.row][node.col].ref.current.classList.add("multiple");
          }
        }
        if (i === target - 1) {
          this.animatePath(0, ordered);
        }
      }, timeout * i);
      if (i === target - 1) break;
    }

    return;
  };

  animatePath = (counter, ordered) => {
    const newGrid = [...this.state.gridTable];
    if (!this.state.showingPath) this.setState({ showingPath: true });

    if (ordered && counter < ordered.length) {
      setTimeout(() => {
        newGrid[ordered[counter].row][
          ordered[counter].col
        ].ref.current.classList.remove("visited", "multiple");
        newGrid[ordered[counter].row][
          ordered[counter].col
        ].ref.current.classList.add("animating");

        counter++;
        this.animatePath(counter, ordered);
      }, 50);
    } else {
      this.setState({ showingPath: false, searching: false });
    }
  };

  initialiseGrid = () => {
    const { grid, startCellDefault, endCellDefault } = this.state;
    let gridTable = [];
    for (let i = 0; i < grid.rows; i++) {
      let column = [];
      for (let j = 0; j < grid.columns; j++) {
        column.push({
          col: j,
          row: i,
          isWall: false,
          isObstacle: false,
          isWeight: false,
          distance: Infinity,
          visited: false,
          previousNode: null,
          isStart:
            i === startCellDefault.row && j === startCellDefault.col
              ? true
              : false,
          isTarget:
            i === endCellDefault.row && j === endCellDefault.col ? true : false,
        });
      }

      gridTable.push(column);
    }
    this.setState({ gridTable, gridTableOriginal: gridTable });
  };

  clearBoardHandler = (type) => {
    let { startCell, endCell, startCellDefault, endCellDefault, obstacleCell } =
      this.state;
    let gridTable = this.state.gridTable.slice(0);
    if (type === "all") {
      //this.initialiseGrid();

      obstacleCell = { row: null, col: null };
      startCell = { ...startCellDefault };
      endCell = { ...endCellDefault };
      if (this.state.obstacle) this.editBoard("obstacle");
    }

    gridTable.forEach((row) =>
      row.forEach((node) => {
        if (type === "all") {
          const control = ["col", "row", "isStart", "isTarget", "ref"];
          for (let key in node) {
            node[key] = control.includes(key) ? node[key] : false;
          }
          node.ref.current.classList.remove("visited", "animating", "multiple");
          node.isStart =
            node.row === startCellDefault.row &&
            node.col === startCellDefault.col
              ? true
              : false;
          node.isTarget =
            node.row === endCellDefault.row && node.col === endCellDefault.col
              ? true
              : false;
        } else {
          node.isWall = false;
          node.isWeight = false;
          node.ref.current.classList.remove("visited", "animating", "multiple");
        }
      })
    );

    this.setState({
      gridTable,
      startCell,
      endCell,
      obstacleCell,
    });
  };
  clearPathHandler = () => {
    const { gridTable } = this.state;
    gridTable.forEach((row) =>
      row.forEach((node) =>
        node.ref.current.classList.remove("visited", "animating", "multiple")
      )
    );
    this.setState({ gridTable });
  };
  startMoving = () => {
    if (!this.state.movingStart) {
      this.setState({ movingStart: true });
    }
  };

  targetMoving = () => {
    if (!this.state.movingTarget) {
      this.setState({ movingTarget: true });
    }
  };

  obstacleMoving = () => {
    if (!this.state.movingObstacle) {
      this.setState({ movingObstacle: true });
    }
  };

  startWall = () => {
    if (!this.state.addingWall) {
      this.setState({ addingWall: true });
    }
  };
  startWeight = () => {
    if (!this.state.addingWeight) {
      this.setState({ addingWeight: true });
    }
  };
  nothingMoving = () => {
    if (this.state.movingStart) this.setState({ movingStart: false });
    if (this.state.movingTarget) this.setState({ movingTarget: false });
    if (this.state.movingObstacle) this.setState({ movingObstacle: false });
    if (this.state.addingWall) this.setState({ addingWall: false });
    if (this.state.addingWall) this.setState({ addingWall: false });
    if (this.state.addingWeight) this.setState({ addingWeight: false });
  };
  setStartCell = (row, col) => {
    let gridTable = this.state.gridTable.slice(0);
    if (!gridTable[row][col].isObstacle && !gridTable[row][col].isTarget) {
      gridTable = this.clearKey("isStart");
      gridTable[row][col].isStart = true;

      this.setState({ startCell: { row, col }, gridTable });
    }
  };

  clearKey = (key) => {
    let gridTable = this.state.gridTable.slice(0);
    gridTable.forEach((row) => row.forEach((col) => (col[key] = false)));
    return gridTable;
  };

  setEndCell = (row, col) => {
    let gridTable = this.state.gridTable.slice(0);
    if (!gridTable[row][col].isObstacle && !gridTable[row][col].isStart) {
      gridTable = this.clearKey("isTarget");
      gridTable[row][col].isTarget = true;
      this.setState({ endCell: { row, col }, gridTable });
    }
  };

  setObstacleCell = (row, col) => {
    let gridTable = this.state.gridTable.slice(0);
    if (!gridTable[row][col].isStart && !gridTable[row][col].isTarget) {
      gridTable = this.clearKey("isObstacle");
      gridTable[row][col].isObstacle = true;
      this.setState({ obstacleCell: { row, col }, gridTable });
    }
  };

  toggleWall = (row, col) => {
    const gridTable = this.state.gridTable.slice(0);
    gridTable[row][col].isWall = !gridTable[row][col].isWall;
    gridTable[row][col].isWeight = false;
    this.setState({ gridTable, addingWall: true });
  };

  toggleWeight = (row, col) => {
    if (this.state.weightKey) {
      const gridTable = this.state.gridTable.slice(0);
      gridTable[row][col].isWeight = !gridTable[row][col].isWeight;
      gridTable[row][col].isWall = false;
      this.setState({ gridTable, addingWeight: true });
    }
  };

  setAdding = ({ row, col, turnOff }) => {
    // console.log("this.setAdding", row, col);
    if (turnOff) {
      // console.log("this.setAdding return");
      return this.setState({
        addingWall: false,
        mouseDown: false,
        weightKey: false,
        movingTarget: false,
        movingObstacle: false,
        movingStart: false,
      });
    }
    let gridTable = this.state.gridTable.slice(0);
    if (gridTable[row][col].isTarget) {
      this.setState({
        movingTarget: true,
        target: { col, row },
        mouseDown: true,
      });
      // console.log("movingTarget");
      return;
    }
    if (gridTable[row][col].isObstacle) {
      this.setState({
        movingObstacle: true,
        obstacleCell: { col, row },
        mouseDown: true,
      });
      // console.log("movingObstacle");
      return;
    }
    if (gridTable[row][col].isStart) {
      this.setState({
        movingStart: true,
        startCell: { col, row },
        mouseDown: true,
      });
      // console.log("movingStart");
      return;
    }
    let addingWall =
      !gridTable[row][col][this.state.weightKey ? "isWeight" : "isWall"];
    gridTable[row][col][this.state.weightKey ? "isWeight" : "isWall"] =
      addingWall;
    this.setState({ addingWall, gridTable, mouseDown: true });
    // console.log(this.state.addingWall, "aw");
  };

  setWall = ({ row, col }) => {
    if (!this.state.mouseDown) return;
    const gridTable = this.state.gridTable.slice(0),
      target = { ...this.state.target },
      startCell = { ...this.state.startCell },
      obstacleCell = this.state.obstacleCell;
    if (
      !(
        this.state.mouseDown &&
        (target.col || obstacleCell.col || startCell.col)
      )
    ) {
      // console.log("return");
      return;
    }

    const clearCell = (r, c) => {
      ["isStart", "isWall", "isWeight", "isTarget", "isObstacle"].forEach(
        (t) => (gridTable[r][c][t] = false)
      );
    };
    if (
      this.state.movingTarget &&
      !(target.row === row && target.col === col)
    ) {
      // console.log("movingt");
      clearCell(target.row, target.col);
      gridTable[row][col].isTarget = true;
      return this.setState({ gridTable, target: { col, row } });
    }
    if (
      this.state.movingObstacle &&
      !(obstacleCell.row === row && obstacleCell.col === col)
    ) {
      clearCell(obstacleCell.row, obstacleCell.col);
      gridTable[row][col].isObstacle = true;
      return this.setState({ gridTable, obstacleCell: { col, row } });
    }
    if (
      this.state.movingStart &&
      !(startCell.row === row && startCell.col === col)
    ) {
      // console.log("movingstart");
      clearCell(startCell.row, startCell.col);
      gridTable[row][col].isStart = true;
      // // console.log("mo");
      return this.setState({ gridTable, startCell: { col, row } });
    }
    gridTable[row][col][this.state.weightKey ? "isWeight" : "isWall"] =
      this.state.addingWall;
    if (this.state.weightKey) gridTable[row][col].isWall = false;
    if (gridTable[row][col].isWall) gridTable[row][col].isWeight = false;
    if (gridTable[row][col].isWeight) gridTable[row][col].isWall = false;
    // console.log("aw", row, col, gridTable[row][col]);
    this.setState({ gridTable });
    // }
  };

  render() {
    const {
      algorithm,
      algorithmInfo,
      speed,
      envision,
      obstacle,
      gridTable,
      startCell,
      obstacleCell,
      endCell,
      movingStart,
      movingTarget,
      movingObstacle,
      weightKey,
      mouseDown,
      addingWall,
      addingWeight,
    } = this.state;

    let infoHeader;
    if (!algorithm)
      infoHeader = (
        <h1 className="algorithm-info">pick an algorithm to begin</h1>
      );
    if (algorithm) {
      infoHeader = (
        <h1 className="algorithm-info">
          {algorithm} is{" "}
          <span>
            {algorithmInfo[algorithm].weighted ? "weighted" : "unweighted"}
          </span>{" "}
          and{" "}
          <span>
            {algorithmInfo[algorithm].shortest
              ? "guarantees"
              : "does not guarantee"}
          </span>{" "}
          the shortest path
        </h1>
      );
    }

    let table;
    if (gridTable) {
      table = (
        <table className="grid">
          <tbody>
            {gridTable.map((row, rowIndex) => {
              const rowClass = `grid-row ${rowIndex}`;
              return (
                <tr key={rowClass} className={rowClass}>
                  {row.map((node, nodeIndex) => {
                    const key = `${rowIndex} ${node.col}`;

                    let start =
                      startCell.row === rowIndex && startCell.col === node.col;
                    let end =
                      endCell.row === rowIndex && endCell.col === node.col;
                    let addObstacle =
                      obstacleCell.row === rowIndex &&
                      obstacleCell.col === node.col;

                    let wall = !start && !end && mouseDown && !weightKey;
                    let weight = !start && !end && mouseDown && weightKey;

                    // const columnClass = `grid-cell${
                    //   obstacle && node.isObstacle ? " obstacle" : ""
                    // } ${start ? " start" : ""} ${
                    //   node.isTarget ? " target" : ""
                    // } ${node.isWall ? " wall" : ""} ${
                    //   node.isWeight ? " weight" : ""
                    // }`;
                    const columnClass = `grid-cell${
                      obstacle && node.isObstacle
                        ? " obstacle"
                        : node.isStart
                        ? " start"
                        : node.isTarget
                        ? " target"
                        : node.isWall
                        ? " wall"
                        : node.isWeight
                        ? " weight"
                        : ""
                    }`;

                    return (
                      <Node
                        key={key}
                        uniqueRef={gridTable[rowIndex][nodeIndex].ref}
                        row={node.row}
                        col={node.col}
                        class={columnClass}
                        setRef={this.setRef}
                        start={start}
                        startMoving={this.startMoving}
                        end={end}
                        targetMoving={this.targetMoving}
                        addObstacle={addObstacle}
                        obstacleMoving={this.obstacleMoving}
                        wall={wall}
                        toggleWall={this.toggleWall}
                        weight={weight}
                        toggleWeight={this.toggleWeight}
                        movingStart={movingStart}
                        setStartCell={this.setStartCell}
                        movingTarget={movingTarget}
                        setEndCell={this.setEndCell}
                        movingObstacle={movingObstacle}
                        setObstacleCell={this.setObstacleCell}
                        addingWall={addingWall}
                        addingWeight={addingWeight}
                        setAdding={this.setAdding}
                        setWall={this.setWall}
                      ></Node>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    return (
      <div ref={this.myRef} className="App">
        <Top
          setAlgorithmHandler={this.setAlgorithmHandler}
          setMazeHandler={this.setMazeHandler}
          setSpeedHandler={this.setSpeedHandler}
          showSideMenuHandler={this.showSideMenuHandler}
          setEnvisionHandler={this.setEnvisionHandler}
          speed={speed}
          algorithm={algorithm}
          editBoard={this.editBoard}
          envision={envision}
          obstacle={obstacle}
        />
        <Side
          sideMenu={this.state.sideMenu}
          setAlgorithmHandler={this.setAlgorithmHandler}
          setMazeHandler={this.setMazeHandler}
          setSpeedHandler={this.setSpeedHandler}
          setEnvisionHandler={this.setEnvisionHandler}
          showSideMenuHandler={this.showSideMenuHandler}
          speed={speed}
          algorithm={algorithm}
          editBoard={this.editBoard}
          envision={envision}
          obstacle={obstacle}
        />
        <ul className="info-section">{this.info}</ul>
        {infoHeader}
        <ul className="tut-list">
          <li className="tut">click 'Envision' at the top to visualize</li>{" "}
          <li className="tut">
            <span>.</span>click and drag on nodes to add walls
          </li>{" "}
          <li className="tut">
            <span>.</span>hold W, then click and drag on nodes to add weights
          </li>{" "}
          <li className="tut">
            <span>.</span>click and drag on start an target nodes to re-locate
          </li>{" "}
          <li className="tut">
            <span>.</span>click '+ obstacle' to add an obstacle
          </li>{" "}
        </ul>
        {table}
      </div>
    );
  }
}

export default App;
