import "./App.css";
import { createMap } from "genetic-travelling-salesman-problem/App/Genetics/map";
import React, { useEffect, useState } from "react";
import Sketch from "react-p5";
import * as R from "ramda";
import { createPop } from "genetic-travelling-salesman-problem/App/Genetics/population";
import nextGeneration from "genetic-travelling-salesman-problem/App/Genetics/next-gen";

const App = () => {
  const parameters = {
    maxCities: 100,
    maxPopulation: 50,
    maxDistance: undefined,
    maxIterations: 100,
    width: window.screen.width,
    height: window.screen.height,
  };

  const [map, setMap] = useState({});
  const [population, setPopulation] = useState([]);
  const [AllGeneration, setGeneration] = useState([]);

  const repeatNextGeneration = ({ maxIterations }) =>
    R.times(changePopulation, maxIterations);

  useEffect(() => {
    setMap(createMap(parameters));
    setPopulation(createPop(parameters));
    setGeneration(repeatNextGeneration(parameters));
  }, [window.screen]);

  const { width, height } = window.screen;

  const setPoint =
    (p5) =>
    ({ x, y, value }) => {
      p5.fill(255);
      p5.ellipse(x, y, 10, 10);
      p5.fill(255, 0, 0);
      p5.text(value, x, y);
    };
  const setLine = (p5) => (city1, city2) => {
    p5.stroke(255, 0, 0);
    p5.line(city1.x, city1.y, city2.x, city2.y);
  };
  const setAllPointsFromMap = (p5, map) => {
    p5.noStroke();
    R.pipe(R.values, R.map(setPoint(p5)))(map);
  };

  const changePopulation = () => {
    return nextGeneration(map, parameters, population);
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(width, height).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.background(0);
    setAllPointsFromMap(p5, map);
    for (let [c1, c2] in R.aperture(2)(population)) {
      if (c2 === undefined) continue;
      setLine(p5)(map[c1], map[c2]);
    }
  };

  return (
    <>
      <Sketch setup={setup} draw={draw} />
    </>
  );
};

export default App;
