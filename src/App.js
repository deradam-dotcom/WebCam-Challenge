import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  let [cities, setCities] = useState([]);
  let [cam, setCam] = useState("");
  let [showControl, setShowControl] = useState(false);
  let [position, setPosition] = useState({ x: 0, y: 0 });
  console.log("****", position);
  let showCam = (indx) => {
    let newCam = cam;
    cities.map((citie, indexC) => {
      if (indexC === indx) {
        newCam = citie.source;
      }
    });
    setCam(newCam);
  };

  let getControl = (camera) => {
    setCam(camera);
    setShowControl(true);
  };
  let getCameras = (camera) => {
    setCam(camera);
    setShowControl(false);
  };

  let startingPoint = (e) => {
    //console.log(e.movementX, e.movementY);
    position = { x: 0, y: 0 };
    let xAxis = e.movementX;
    let yAxis = e.movementY;
    let newPosition = position;
    newPosition = { x: xAxis, y: yAxis };
    setPosition(newPosition);
  };

  useEffect(() => {
    fetch("http://runningios.com/screamingbox/cameras.json")
      .then((res) => res.json())
      .then((data) =>
        data.map(
          (citie) => (
            citie.id === "delhi" && setCam(citie.source), setCities(data)
          )
        )
      );
  }, []);
  return (
    <div className="App">
      <div className="panel-container">
        <div
          className="cam-container"
          style={{ backgroundImage: `url(${cam})` }}
        ></div>
        <div className="cities-container">
          <div className="btn-container">
            <button
              style={{
                backgroundColor: !showControl ? "white" : "grey",
                color: !showControl ? "grey" : "white",
              }}
              onClick={() => getControl(cam)}
            >
              CONTROL
            </button>
            <button
              style={{
                backgroundColor: !showControl ? "grey" : "white",
                color: !showControl ? "white" : "grey",
              }}
              onClick={() => getCameras(cam)}
            >
              CAMERAS
            </button>
          </div>

          {!showControl ? (
            <div className="citie-container">
              {cities.map((citie, indexC) => (
                <div
                  className="citie-name"
                  key={indexC}
                  onClick={() => showCam(indexC)}
                >
                  {citie.name}
                </div>
              ))}
            </div>
          ) : (
            <div className="control-container">
              <h3>Click in the circle & Drag</h3>
              <div
                className="drag-circle"
                onMouseMove={(e) => startingPoint(e)}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
