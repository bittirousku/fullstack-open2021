import React, { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
    <h2>Give Feedback plz</h2>
    <table>
      <tbody>
      <tr>
        <td><Button handleClick={() => setGood(good+1)} type="good"/></td>
        <td><Button handleClick={() => setNeutral(neutral+1)} type="neutral"/></td>
        <td><Button handleClick={() => setBad(bad+1)} type="bad"/></td>
      </tr>
      </tbody>
    </table>

    <h2>Statistics</h2>
    <Statistics good={good} neutral={neutral} bad={bad}/>

    </div>
  )
}

const Button = ({handleClick, type}) => {
  return (
    <>
      <button onClick={handleClick}>{type}</button>
    </>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positivePercent = (good / all) * 100

  if ([good, neutral, bad].every((value) => value === 0)) {
    return (
      <>
      No feedback given.
      </>
    )
  }
  return (
    <>
    <table>
      <tbody>
        <StatisticLine text="good" value={good}/>
        <StatisticLine text="neutral" value={neutral}/>
        <StatisticLine text="bad" value={bad}/>
        <StatisticLine text="all" value={all}/>
        <StatisticLine text="average" value={average}/>
        <StatisticLine text="positive" value={positivePercent + "%"}/>
      </tbody>
    </table>
    </>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <>
    <tr>
      <td>
        {text}
      </td>
      <td>
        {value}
      </td>
    </tr>
    </>
  )
}

export default App