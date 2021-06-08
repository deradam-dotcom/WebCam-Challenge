import "./App.css";
import React, { useState, useEffect, useRef } from "react";

function App() {
  let [cities, setCities] = useState([]);
  let [cam, setCam] = useState("");
  let [showControl, setShowControl] = useState(false);
  // every timne updating the pos with the new position //
  let [pos, setPos] = useState("0px 0px");
  let [isMouseDown, setIsMouseDown] = useState(false);
  let [startingPos, setStartingPos] = useState({ x: 0, y: 0 });
  let [endingPos, setEndingPos] = useState({ x: 0, y: 0 });
  let [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [pictureWidth, setPictureWidth] = useState(0);
  const [pictureHeight, setPictureHeight] = useState(0);
  const [cameraViewWidth, setCameraViewWidth] = useState(0);
  const [cameraViewHeight, setCameraViewHeight] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    //"cameViewWith & Height" are necessary to keep the selected camera picture inside the "cameraView" div during the moving
    setCameraViewWidth(ref.current ? ref.current.offsetWidth : 0);
    setCameraViewHeight(ref.current ? ref.current.offsetHeight : 0);
    const img = new Image();
    img.onload = function () {
      //  "pictureWidth & Height" are necessary to keep the selected camera view inside the div
      setPictureWidth(this.width);
      setPictureHeight(this.height);
    };
    img.src = cam;
  }, [cam]);

  let showCam = (indx) => {
    let newCam = cam;
    cities.map((citie, indexC) => {
      if (indexC === indx) {
        newCam = citie.source;
      }
    });
    setCam(newCam);
    // setting the starting position of the new selected camera's view //
  };

  let getControl = (camera) => {
    setCam(camera);
    setShowControl(true);
  };
  let getCameras = (camera) => {
    setCam(camera);
    setShowControl(false);
    let newPos = endingPos;
    newPos = { x: 0, y: 0 };
    setEndingPos(newPos);
  };

  let setPositionDown = (e) => {
    let strPos = startingPos;
    strPos = { x: e.clientX, y: e.clientY };
    setStartingPos(strPos);
    setIsMouseDown(true);
  };

  let setPosition = (e) => {
    let distanceX = e.clientX - startingPos.x + endingPos.x;
    let distanceY = e.clientY - startingPos.y + endingPos.y;
    let newDistance = currentPos;
    newDistance = { x: distanceX, y: distanceY };
    if (
      isMouseDown &&
      newDistance.x <= 0 &&
      newDistance.y <= 0 &&
      Math.abs(newDistance.x) + cameraViewWidth <= pictureWidth &&
      Math.abs(newDistance.y) + cameraViewHeight <= pictureHeight
    ) {
      // get the newPos coordinates of the camera//
      let newPos =
        newDistance.x.toString() + "px " + newDistance.y.toString() + "px";
      setCurrentPos(newDistance);
      setPos(newPos);
    }
  };
  let setPositionUp = (e) => {
    let endPos = endingPos;
    endPos = { x: currentPos.x, y: currentPos.y };
    setEndingPos(endPos);
    setIsMouseDown(false);
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
        {console.log("**POS/CAM**", pos, cam)}
        <div
          className="cam-container"
          ref={ref}
          style={{
            backgroundImage: `url(${cam})`,
            backgroundPosition: `${pos}`,
            backgroundRepeat: "no-repeat",
          }}
        />
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
                onMouseDown={(e) => setPositionDown(e)}
                onMouseMove={(e) => setPosition(e)}
                onMouseUp={(e) => setPositionUp(e)}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
