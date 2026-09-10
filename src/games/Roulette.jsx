import React, { useState } from 'react'
import { useCredits } from '../context/CreditsContext.jsx'

const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36])
const BETS = [10, 25, 50, 100]

function colorOf(n) {
  if (n === 0) return 'green'
  return RED_NUMBERS.has(n) ? 'red' : 'black'
}

export default function Roulette() {
  const { credits, adjustCredits } = useCredits()
  const [bet, setBet] = useState(25)
  const [betType, setBetType] = useState('red') // red | black | odd | even | straight
  const [straightNumber, setStraightNumber] = useState(17)
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [landed, setLanded] = useState(null)
  const [result, setResult] = useState(null)

  function spin() {
    if (spinning || credits < bet) return
    setSpinning(true)
    setResult(null)
    adjustCredits(-bet)

    const winningNumber = Math.floor(Math.random() * 37) // 0..36
    const extraSpins = 4 + Math.floor(Math.random() * 3)
    const targetAngle = extraSpins * 360 + (winningNumber / 37) * 360
    setRotation((r) => r + targetAngle)

    setTimeout(() => {
      setSpinning(false)
      setLanded(winningNumber)
      const color = colorOf(winningNumber)
      let won = false
      let mult = 0

      if (betType === 'straight' && winningNumber === straightNumber) {
        won = true
        mult = 36
      } else if (betType === 'red' && color === 'red') {
        won = true
        mult = 2
      } else if (betType === 'black' && color === 'black') {
        won = true
        mult = 2
      } else if (betType === 'odd' && winningNumber !== 0 && winningNumber % 2 === 1) {
        won = true
        mult = 2
      } else if (betType === 'even' && winningNumber !== 0 && winningNumber % 2 === 0) {
        won = true
        mult = 2
      }

      if (won) {
        const winnings = bet * mult
        adjustCredits(winnings)
        setResult({ win: true, text: `Ball lands on ${winningNumber} (${color}). You win ${winnings.toLocaleString()} credits.` })
      } else {
        setResult({ win: false, text: `Ball lands on ${winningNumber} (${color}). No win.` })
      }
    }, 3200)
  }

  return (
    <div className={`panel${result?.win ? ' win-flash' : ''}`}>
      <h2>Roulette</h2>
      <p className="subtitle">A single-zero wheel. Bet on a color, odd or even, or chase the 36× payout on one exact number.</p>

      <div className="roulette-layout">
        <div className="wheel-wrap">
          <div className="wheel-pointer" />
          <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
            <div className="wheel-result">
              {landed !== null && !spinning && (
                <span className="num" style={{ color: colorOf(landed) === 'red' ? 'var(--red)' : colorOf(landed) === 'green' ? '#4a8f6b' : 'var(--text)' }}>
                  {landed}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bet-options">
          <div className="field">
            <label>Bet on</label>
            <div className="bet-type-grid">
              <button
                className={`bet-choice red-choice${betType === 'red' ? ' selected' : ''}`}
                onClick={() => setBetType('red')}
                disabled={spinning}
              >
                Red (2×)
              </button>
              <button
                className={`bet-choice${betType === 'black' ? ' selected' : ''}`}
                onClick={() => setBetType('black')}
                disabled={spinning}
              >
                Black (2×)
              </button>
              <button
                className={`bet-choice${betType === 'odd' ? ' selected' : ''}`}
                onClick={() => setBetType('odd')}
                disabled={spinning}
              >
                Odd (2×)
              </button>
              <button
                className={`bet-choice${betType === 'even' ? ' selected' : ''}`}
                onClick={() => setBetType('even')}
                disabled={spinning}
              >
                Even (2×)
              </button>
            </div>
            <div style={{ marginTop: 8 }}>
              <button
                className={`bet-choice${betType === 'straight' ? ' selected' : ''}`}
                style={{ width: '100%' }}
                onClick={() => setBetType('straight')}
                disabled={spinning}
              >
                Exact number (36×)
              </button>
              {betType === 'straight' && (
                <input
                  type="number"
                  min={0}
                  max={36}
                  className="number-input"
                  style={{ marginTop: 8 }}
                  value={straightNumber}
                  disabled={spinning}
                  onChange={(e) => {
                    const v = Math.max(0, Math.min(36, Number(e.target.value)))
                    setStraightNumber(v)
                  }}
                />
              )}
            </div>
          </div>

          <div className="field">
            <label>Bet amount</label>
            <div className="chip-row">
              {BETS.map((b) => (
                <button
                  key={b}
                  className={`chip${bet === b ? ' selected' : ''}`}
                  onClick={() => setBet(b)}
                  disabled={spinning}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <button className="primary-btn" onClick={spin} disabled={spinning || credits < bet} style={{ alignSelf: 'flex-start' }}>
            {spinning ? 'Spinning…' : `Place bet of ${bet}`}
          </button>
        </div>
      </div>

      <div className="result-line">
        {result ? <span className={result.win ? 'win' : 'lose'}>{result.text}</span> : '\u00A0'}
      </div>
    </div>
  )
}
