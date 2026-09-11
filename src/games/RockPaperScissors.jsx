import React, { useState } from 'react'
import { useCredits } from '../context/CreditsContext.jsx'
import { useHistory } from '../context/HistoryContext.jsx'

const BETS = [10, 25, 50, 100]
const MOVES = [
  { id: 'rock', label: 'Rock' },
  { id: 'paper', label: 'Paper' },
  { id: 'scissors', label: 'Scissors' },
]

function beats(a, b) {
  return (
    (a === 'rock' && b === 'scissors') ||
    (a === 'paper' && b === 'rock') ||
    (a === 'scissors' && b === 'paper')
  )
}

export default function RockPaperScissors() {
  const { credits, adjustCredits } = useCredits()
  const { addEntry } = useHistory()
  const [bet, setBet] = useState(25)
  const [busy, setBusy] = useState(false)
  const [playerMove, setPlayerMove] = useState(null)
  const [houseMove, setHouseMove] = useState(null)
  const [result, setResult] = useState(null)

  function play(move) {
    if (busy || credits < bet) return
    setBusy(true)
    setResult(null)
    setPlayerMove(move)
    setHouseMove(null)
    adjustCredits(-bet)

    setTimeout(() => {
      const house = MOVES[Math.floor(Math.random() * MOVES.length)].id
      setHouseMove(house)
      setBusy(false)
      const moveLabel = MOVES.find((m) => m.id === move).label
      const houseLabel = MOVES.find((m) => m.id === house).label

      if (move === house) {
        adjustCredits(bet)
        setResult({ win: null, text: `Both play ${moveLabel.toLowerCase()}. Bet returned.` })
        addEntry({ game: 'Rock, Paper, Scissors', outcome: 'push', delta: 0, note: `Tied on ${moveLabel.toLowerCase()}` })
      } else if (beats(move, house)) {
        const winnings = bet * 2
        adjustCredits(winnings)
        setResult({ win: true, text: `${moveLabel} beats ${houseLabel.toLowerCase()}. You win ${winnings.toLocaleString()} credits.` })
        addEntry({ game: 'Rock, Paper, Scissors', outcome: 'win', delta: bet, note: `${moveLabel} beat ${houseLabel.toLowerCase()}` })
      } else {
        setResult({ win: false, text: `${houseLabel} beats your ${moveLabel.toLowerCase()}. No win.` })
        addEntry({ game: 'Rock, Paper, Scissors', outcome: 'lose', delta: -bet, note: `${houseLabel} beat your ${moveLabel.toLowerCase()}` })
      }
    }, 700)
  }

  return (
    <div className={`panel${result?.win ? ' win-flash' : ''}`}>
      <h2>Rock, paper, scissors</h2>
      <p className="subtitle">One quick call against the house. A win pays even money; a tie returns your bet.</p>

      <div className="rps-board">
        <div className="rps-side">
          <div className="rps-slot">
            {playerMove ? MOVES.find((m) => m.id === playerMove)?.label : '—'}
          </div>
          <div className="rps-side-label">You</div>
        </div>
        <div className="rps-vs">vs</div>
        <div className="rps-side">
          <div className="rps-slot">
            {busy ? '…' : houseMove ? MOVES.find((m) => m.id === houseMove)?.label : '—'}
          </div>
          <div className="rps-side-label">House</div>
        </div>
      </div>

      <div className="result-line" style={{ textAlign: 'center' }}>
        {result ? (
          <span className={result.win === true ? 'win' : result.win === false ? 'lose' : ''}>{result.text}</span>
        ) : (
          '\u00A0'
        )}
      </div>

      <hr className="divider" />

      <div className="field" style={{ marginBottom: 20 }}>
        <label>Your move</label>
        <div className="bet-type-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {MOVES.map((m) => (
            <button
              key={m.id}
              className={`bet-choice${playerMove === m.id && busy ? ' selected' : ''}`}
              onClick={() => play(m.id)}
              disabled={busy || credits < bet}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bet-row">
        <div className="field">
          <label>Bet amount</label>
          <div className="chip-row">
            {BETS.map((b) => (
              <button
                key={b}
                className={`chip${bet === b ? ' selected' : ''}`}
                onClick={() => setBet(b)}
                disabled={busy}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
