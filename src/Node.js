import React, { useRef } from "react";

const Node = props => {
  const {
    start,
    end,
    addObstacle,
    wall,
    weight,
    startMoving,
    targetMoving,
    obstacleMoving,
    toggleWall,
    toggleWeight,
    row,
    col,
    uniqueRef,
    movingStart,
    movingTarget,
    movingObstacle,
    addingWall,
    addingWeight,
    setStartCell,
    setEndCell,
    setObstacleCell,
    setAdding,
    setWall,
    
  } = props;
  const nodeRef = useRef(null);
  if (!uniqueRef) {
    props.setRef({ ref: nodeRef, row, col });
  }
  return (
    <td
      className={props.class}
      ref={nodeRef}
      // onMouseDown={
      //   start
      //     ? startMoving
      //     : end
      //     ? targetMoving
      //     : addObstacle
      //     ? obstacleMoving
      //     : wall
      //     ? () => toggleWall(row, col)
      //     : weight
      //     ? () => toggleWeight(row, col)
      //     : null
      // }
      onMouseDown={() => setAdding({row, col})}
      onMouseOver={(e) => {
        // console.log(e.target, 'onDragOver')
        setWall({row, col})
      }}
      onMouseUp={() => setAdding({row, col, turnOff: true})}
      // onMouseOver={() => {
      //   if (movingStart) {
      //     setStartCell(row, col);
      //   }
      //   if (movingTarget) {
      //     setEndCell(row, col);
      //   }
      //   if (movingObstacle) {
      //     setObstacleCell(row, col);
      //   }
      //   if (addingWall) {
      //     toggleWall(row, col);
      //   }
      //   if (addingWeight) {
      //     toggleWeight(row, col);
      //   }
      // }}
    ></td>
  );
};

export default Node;
