import React, { useState } from 'react'
import { useCredits } from '../context/CreditsContext.jsx'

const BETS = [10, 25, 50, 100]
const DICE_FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

export default function DiceCoinflip() {
  const { credits, adjustCredits } = useCredits()
  const [mode, setMode] = useState('coin') // coin | dice
  const [bet, setBet] = useState(25)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)

  // coin state
  const [coinChoice, setCoinChoice] = useState('heads')
  const [coinFace, setCoinFace] = useState('heads')
  const [coinSpin, setCoinSpin] = useState(0)

  // dice state
  const [diceChoice, setDiceChoice] = useState(1)
  const [diceFace, setDiceFace] = useState(1)

  function flipCoin() {
    if (busy || credits < bet) return
    setBusy(true)
    setResult(null)
    adjustCredits(-bet)

    const outcome = Math.random() < 0.5 ? 'heads' : 'tails'
    setCoinSpin((s) => s + 720 + (outcome === 'heads' ? 0 : 180))

    setTimeout(() => {
      setCoinFace(outcome)
      setBusy(false)
      if (outcome === coinChoice) {
        const winnings = bet * 2
        adjustCredits(winnings)
        setResult({ win: true, text: `The coin lands on ${outcome}. You win ${winnings.toLocaleString()} credits.` })
      } else {
        setResult({ win: false, text: `The coin lands on ${outcome}. No win.` })
      }
    }, 1100)
  }

  function rollDice() {
    if (busy || credits < bet) return
    setBusy(true)
    setResult(null)
    adjustCredits(-bet)

    const outcome = 1 + Math.floor(Math.random() * 6)

    let ticks = 0
    const spin = setInterval(() => {
      setDiceFace(1 + Math.floor(Math.random() * 6))
      ticks += 1
      if (ticks > 8) {
        clearInterval(spin)
        setDiceFace(outcome)
        setBusy(false)
        if (outcome === diceChoice) {
          const winnings = bet * 6
          adjustCredits(winnings)
          setResult({ win: true, text: `The die shows ${outcome}. You win ${winnings.toLocaleString()} credits.` })
        } else {
          setResult({ win: false, text: `The die shows ${outcome}. No win.` })
        }
      }
    }, 70)
  }

  return (
    <div className={`panel${result?.win ? ' win-flash' : ''}`}>
      <h2>Dice &amp; coin</h2>
      <p className="subtitle">Two quick calls: pick a side of the coin for an even-money win, or call the exact die face for a 6× payout.</p>

      <div className="segmented" style={{ marginBottom: 26 }}>
        <button className={mode === 'coin' ? 'active' : ''} onClick={() => { setMode('coin'); setResult(null) }} disabled={busy}>
          Coin flip
        </button>
        <button className={mode === 'dice' ? 'active' : ''} onClick={() => { setMode('dice'); setResult(null) }} disabled={busy}>
          Dice roll
        </button>
      </div>

      {mode === 'coin' ? (
        <>
          <div className="coin-wrap">
            <div className="coin" style={{ transform: `rotateY(${coinSpin}deg)` }}>
              {coinFace === 'heads' ? 'H' : 'T'}
            </div>
          </div>

          <div className="bet-row" style={{ justifyContent: 'center' }}>
            <div className="field">
              <label>Call it</label>
              <div className="segmented">
                <button className={coinChoice === 'heads' ? 'active' : ''} onClick={() => setCoinChoice('heads')} disabled={busy}>
                  Heads
                </button>
                <button className={coinChoice === 'tails' ? 'active' : ''} onClick={() => setCoinChoice('tails')} disabled={busy}>
                  Tails
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="dice-face">{DICE_FACES[diceFace]}</div>

          <div className="field" style={{ marginBottom: 20 }}>
            <label>Call the face</label>
            <div className="pick-grid">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  className={`chip${diceChoice === n ? ' selected' : ''}`}
                  onClick={() => setDiceChoice(n)}
                  disabled={busy}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

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
                disabled={busy}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
        <button
          className="primary-btn"
          onClick={mode === 'coin' ? flipCoin : rollDice}
          disabled={busy || credits < bet}
        >
          {busy ? 'Rolling…' : `Play for ${bet}`}
        </button>
      </div>

      <div className="result-line">
        {result ? <span className={result.win ? 'win' : 'lose'}>{result.text}</span> : '\u00A0'}
      </div>
    </div>
  )
}
