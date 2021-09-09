import React, { useState } from "react";

import "./Options.css";

const Options = props => {
  const [selected, setSelected] = useState(false);
  const [envisonText, setEnvisonText] = useState("envision");

  const options = [
    {
      text: "algorithms",
      dropdown: [
        "dijkstra's algorithms"
        // "a* search",
        // "greedy best-first search",
        // "swarm algorithm",
        // "convergent swarm algorithm",
        // "bio-directional swarm algorithm",
        // "breath-first search",
        // "depth-first search"
      ]
    },
    // {
    //   text: "mazes and patterns",
    //   dropdown: [
    //     "recursive division",
    //     "recursive division (vertical skew)",
    //     "recursive division (horizontal skew)",
    //     "basic random maze",
    //     "basic weight maze",
    //     "simple stair pattern"
    //   ]
    // },
    { text: "+ obstacle" },
    { text: "envision" },
    { text: "clear board" },
    { text: "clear walls and weights" },
    { text: "clear path" },
    { text: "speed", dropdown: ["fast", "average", "slow"] }
  ];
  const {
    algorithm,
    speed,
    setAlgorithmHandler,
    setEnvisionHandler,
    setMazeHandler,
    setSpeedHandler,
    showSideMenuHandler,
    editBoard,
    envision,
    obstacle: propObstacle,
    envision: propEnvision
  } = props;
  return (
    <div className={props.class}>
      <span
        className="toggle-icon"
        onClick={() => {
          showSideMenuHandler();
        }}
      >
        <ion-icon name="menu"></ion-icon>
      </span>
      <span className="toggle-icon-close" onClick={() => showSideMenuHandler()}>
        <ion-icon name="close"></ion-icon>
      </span>
      <h1 className="top-header">path vision</h1>
      {options.map((item, itemIndex) => {
        let text = item.text;
        const envision = text === "envision";
        const obstacle = text === "+ obstacle";
        const clearBoard = text === "clear board";
        const clearWAW = text === "clear walls and weights";
        const clearPath = text === "clear path";
        let textClass = `menu-option${
          selected === itemIndex && !envision
            ? " selected"
            : selected === itemIndex && !propEnvision
            ? " selected"
            : envision && propEnvision
            ? " envisioning"
            : ""
        }`;
        return (
          <div
            key={itemIndex}
            className={textClass}
            onClick={() => {
              setSelected(selected === itemIndex ? null : itemIndex);
              if (envision && !algorithm) setEnvisonText("pick an algorith");
              if (envision && algorithm && !propEnvision) {
                setEnvisionHandler();
              }
              if (obstacle && !propEnvision) editBoard("obstacle");
              if (clearBoard && !propEnvision) editBoard("clearBoard");
              if (clearWAW && !propEnvision) editBoard("clearWAW");
              if (clearPath && !propEnvision) editBoard("clearPath");
            }}
          >
            <p className="option-text">
              <span>
                {`${
                  obstacle && propObstacle
                    ? "- obstacle"
                    : obstacle && !propObstacle
                    ? "+ obstacle"
                    : !envision
                    ? text
                    : envision && algorithm
                    ? envisonText + " " + algorithm
                    : envisonText
                }${text === "speed" ? ": " + speed : ""}`}
              </span>
              {item.dropdown ? <ion-icon name="caret-down"></ion-icon> : null}
            </p>
            {item.dropdown ? (
              <div
                className="menu-dropdown"
                style={{
                  display: `${selected === itemIndex ? "block" : "none"}`
                }}
              >
                {item.dropdown.map((option, optionIndex) => (
                  <p
                    key={optionIndex}
                    className="dropdown-option"
                    onClick={
                      item.text === "algorithms"
                        ? () => {
                            if (!propEnvision) {
                              setEnvisonText("envision");
                              setAlgorithmHandler(option);
                            }
                            setSelected(null);
                          }
                        : item.text === "mazes and patterns"
                        ? () => {
                            if (!propEnvision) {
                              setMazeHandler(option);
                            }
                            setSelected(null);
                          }
                        : item.text === "speed"
                        ? () => {
                            if (!propEnvision) {
                              setSpeedHandler(option);
                            }
                            setSelected(null);
                          }
                        : null
                    }
                  >
                    {option}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default Options;
