import React, { useState } from 'react'
import { useCredits } from '../context/CreditsContext.jsx'

const SYMBOLS = [
  { id: 'star', glyph: '★', weight: 2 },
  { id: 'seven', glyph: '7', weight: 4 },
  { id: 'diamond', glyph: '♦', weight: 8, red: true },
  { id: 'heart', glyph: '♥', weight: 8, red: true },
  { id: 'club', glyph: '♣', weight: 10 },
  { id: 'spade', glyph: '♠', weight: 10 },
]

const BETS = [10, 25, 50, 100]

function weightedSymbol() {
  const total = SYMBOLS.reduce((s, sym) => s + sym.weight, 0)
  let r = Math.random() * total
  for (const sym of SYMBOLS) {
    if (r < sym.weight) return sym
    r -= sym.weight
  }
  return SYMBOLS[SYMBOLS.length - 1]
}

function payoutMultiplier(reels) {
  const [a, b, c] = reels
  if (a.id === b.id && b.id === c.id) {
    if (a.id === 'star') return 25
    if (a.id === 'seven') return 10
    return 5
  }
  const ids = [a.id, b.id, c.id]
  const hasStarOrSeven = ids.filter((id) => id === 'star' || id === 'seven').length
  if (hasStarOrSeven >= 2) return 2
  return 0
}

export default function SlotMachine() {
  const { credits, adjustCredits } = useCredits()
  const [bet, setBet] = useState(25)
  const [reels, setReels] = useState([SYMBOLS[4], SYMBOLS[5], SYMBOLS[2]])
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)

  function spin() {
    if (spinning || credits < bet) return
    setSpinning(true)
    setResult(null)
    adjustCredits(-bet)

    const finalReels = [weightedSymbol(), weightedSymbol(), weightedSymbol()]

    setTimeout(() => {
      setReels(finalReels)
      const mult = payoutMultiplier(finalReels)
      setSpinning(false)
      if (mult > 0) {
        const winnings = bet * mult
        adjustCredits(winnings)
        setResult({ win: true, text: `Three across pays ${mult}×. You win ${winnings.toLocaleString()} credits.` })
      } else {
        setResult({ win: false, text: 'No match this time.' })
      }
    }, 900)
  }

  return (
    <div className={`panel${result?.win ? ' win-flash' : ''}`}>
      <h2>Slots</h2>
      <p className="subtitle">Line up three symbols. Stars and sevens pay the richest; any pair of them still returns a small win.</p>

      <div className="reels">
        {reels.map((sym, i) => (
          <div key={i} className={`reel-window${spinning ? ' spinning' : ''}`}>
            <span className="reel-symbol" style={sym.red ? { color: 'var(--red)' } : undefined}>
              {sym.glyph}
            </span>
          </div>
        ))}
      </div>

      <div className="result-line" style={{ textAlign: 'center' }}>
        {result ? <span className={result.win ? 'win' : 'lose'}>{result.text}</span> : '\u00A0'}
      </div>

      <hr className="divider" />

      <div className="bet-row">
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
        <button className="primary-btn" onClick={spin} disabled={spinning || credits < bet}>
          {spinning ? 'Spinning…' : `Spin for ${bet}`}
        </button>
      </div>

      <div className="payout-table">
        <div><span>★ ★ ★</span> — 25× bet</div>
        <div><span>7 7 7</span> — 10× bet</div>
        <div><span>any matching suit</span> — 5× bet</div>
        <div><span>two ★ or 7</span> — 2× bet</div>
      </div>
    </div>
  )
}
