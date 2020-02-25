import React from "react";

import "./Side.css";
import Options from "../Options/Options";

const Side = props => {
  return (
    <Options
      class={props.sideMenu ? "Side opened" : "Side closed"}
      showSideMenuHandler={props.showSideMenuHandler}
      setAlgorithmHandler={props.setAlgorithmHandler}
      setMazeHandler={props.setMazeHandler}
      setSpeedHandler={props.setSpeedHandler}
      setEnvisionHandler={props.setEnvisionHandler}
      speed={props.speed}
      algorithm={props.algorithm}
      editBoard={props.editBoard}
      envision={props.envision}
      obstacle={props.obstacle}
    />
  );
};

export default Side;
