import React from "react";

import "./Top.css";
import Options from "../Options/Options";

const Top = props => {
  return (
    <Options
      class="Top"
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

export default Top;
