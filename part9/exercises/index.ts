// const express = require('express');  // typing does not work 
import express from 'express'; // luckily it can be imported as a module
var bodyParser = require('body-parser')

import calculateBmi from "./bmiCalculator"
import calculateExercises from "./exerciseCalculator"

const app = express();
app.use(bodyParser());


app.get('/hello', (_request, response) => {
  response.send('Hello Full Stack!');
});

app.get('/bmi', (request, response) => {
  let height: number = Number(request.query.height)
  let mass: number = Number(request.query.mass)
  if (!height || !mass || height === NaN || mass === NaN) {
    response.json({error: "invalid data"})
  }
  
  console.log("height", height)
  console.log("mass", mass)
  response.json(calculateBmi(height, mass));
});


app.post("/exercises", (request, response) => {
  if (!request.body) {
    return response.status(401).json({error: "Request body missing"})
  }
  let hours: Array<number> = Array<number>(request.body.daily_exercises)
  let target: number = Number(request.body.target)

  if (!hours || !target) {
    return response.status(401).json({error: "Parameters missing", args: request.body})
  }

  try {
    if ( !hours.every(day => day !== NaN) || target === NaN) {
      throw new Error("blörg")
    }
    let assessment = calculateExercises(hours, target)
    return response.json(assessment)
  } catch (err) {
    return response.status(401).json({error: "Invalid data", args: request.body})
  }  
})

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});