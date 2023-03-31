import "./App.css";
import { createMap } from "genetic-travelling-salesman-problem/App/Genetics/map";
import React from "react";
import Sketch from "react-p5";
import * as R from "ramda";

const MAX_CITIES = 50;

let x = 50;
let y = 50;

const App = () => {
  const map = createMap(MAX_CITIES);
  const { width, height } = window.screen;

  const setPoint =
    (p5) =>
    ({ x, y }) =>
      p5.ellipse(x * 15, y * 15, 10, 10);

  const setAllPointsFromMap = (p5, map) =>
    R.pipe(R.values, R.map(setPoint(p5)))(map);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(width, height).parent(canvasParentRef);
  };
  const draw = (p5) => {
    p5.background(0);
    setAllPointsFromMap(p5, map);
  };

  return (
    <>
      <Sketch setup={setup} draw={draw} /> {JSON.stringify(R.values(map))}
    </>
  );
};

export default App;
