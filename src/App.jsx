import "./App.css";
import { createMap } from "genetic-travelling-salesman-problem/App/Genetics/map";
import React, { useEffect, useState } from "react";
import Sketch from "react-p5";
import * as R from "ramda";
import { createPop } from "genetic-travelling-salesman-problem/App/Genetics/population";
import nextGeneration from "genetic-travelling-salesman-problem/App/Genetics/next-gen";

const MAX_CITIES = 100;
const MAX_POPULATION = 50;
const MAX_DISTANCE = 10000000000;
const MAX_ITERATIONS = 100;

const App = () => {
  const scale = 10;

  const [map, setMap] = useState({});
  const [population, setPopulation] = useState([]);
  const [AllGeneration, setGeneration] = useState([]);

  useEffect(() => {
    setMap(createMap(MAX_CITIES));
    setPopulation(createPop(MAX_POPULATION)(MAX_CITIES));
    setGeneration(R.times(changePopulation, MAX_ITERATIONS));
  }, [window.screen]);

  const { width, height } = window.screen;

  const setPoint =
    (p5) =>
    ({ x, y, value }) => {
      p5.fill(255);
      p5.ellipse(x * scale, y * scale, 10, 10);
      p5.fill(255, 0, 0);
      p5.text(value, x * scale, y * scale);
    };
  const setLine = (p5) => (city1, city2) => {
    p5.stroke(255, 0, 0);
    const x1 = city1.x;
    const y1 = city1.y;
    const x2 = city2.x;
    const y2 = city2.y;
    p5.line(x1 * scale, y1 * scale, x2 * scale, y2 * scale);
  };
  const setAllPointsFromMap = (p5, map) => {
    p5.noStroke();
    R.pipe(R.values, R.map(setPoint(p5)))(map);
  };

  const changePopulation = () => {
    return nextGeneration(map)(MAX_DISTANCE)(population);
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
