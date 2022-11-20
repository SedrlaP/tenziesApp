import { nanoid } from 'nanoid'
import { useState, useEffect } from 'react'
import Die from './Die.jsx'
import Confetti from 'react-confetti'

function App() {
  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [count, setCount] = useState(0)
  const [record, setRecord] = useState(
    JSON.parse(localStorage.getItem("record")) || [] 
    )

  useEffect(()  => {
    // map over dice array to check if all of them are held and same value
    const allHeld_allSameValue = dice.every(die => die.isHeld === true && die.value === dice[0].value)
    
    if (allHeld_allSameValue) {
      setTenzies(true)
    }
  }, [dice])

  useEffect(() => {
    if (tenzies) {
      if (record === null || record.length === 0) {
        localStorage.setItem("record", JSON.stringify(count))
      }
      if (record > count) {
        localStorage.setItem("record", JSON.stringify(count))
      }
    }
  }, [tenzies])


  // generates new die 
  function generateNewDie() {
    const rndNum = Math.ceil(Math.random() * 6)
    return {
      value: rndNum,
      isHeld: false,
      id: nanoid()
    }
  }
  
  // generates all new dice 
  function allNewDice() {
    const rndNums = []
    for (let i = 0; i < 10; i++) {
      rndNums.push(generateNewDie())
    }
    return rndNums
  }

  // rolls new dice where isHeld !== true
  function rollDie() {
    if (tenzies) {
      newGame()
    } else {
      setDice(prevDice => prevDice.map(die => {
        return die.isHeld ? die : generateNewDie()
      }))
      setCount(prevCount => prevCount + 1)
    }
  }

  // resets all values to default
  function newGame() {
    setTenzies(false)
    setDice(allNewDice())
    setRecord(JSON.parse(localStorage.getItem("record")))
    setCount(0)
  }

  // sets isHeld to true on clicked die
  function holdDie(id) {
    setDice(prevDice => prevDice.map(die => {
      return die.id === id ? {...die, isHeld: !die.isHeld} : die
    }))
  }

  const dieElements = dice.map(die => (
        <Die 
          value = {die.value} 
          key = {die.id} 
          holdDie = {() => holdDie(die.id)}
          isHeld = {die.isHeld}
        />
      ))

  return (
    <main>
      {tenzies && <Confetti />}
      <div className="tenzies-text">
        <h1 className='title'>Tenzies</h1>
        <p className='description'>Roll untill all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      </div>
      <div className="die-grid">
        {dieElements}
      </div>
      <button className="btn" onClick={rollDie}>{tenzies ? "New Game" : "Roll"}</button>
      <div className='roll-count'>Rolls: {count}</div>
      <div className='highest-score'>Best: {record}</div>
    </main>
    )  
}

export default App
