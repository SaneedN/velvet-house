import React, { useState } from 'react'
import { useCredits } from '../context/CreditsContext.jsx'
import { useHistory } from '../context/HistoryContext.jsx'
import {
  COLORS,
  COLOR_HEX,
  buildDeck,
  shuffle,
  isValidPlay,
  cardLabel,
  drawCards,
  mostCommonColor,
} from './unoEngine.js'

const STAKES = [10, 25, 50, 100]
const TURN_DELAY = 750

function Card({ card, onClick, disabled, small }) {
  const bg = card.color === 'wild' ? '#2a2420' : COLOR_HEX[card.color]
  return (
    <button
      className={`uno-card${small ? ' uno-card-small' : ''}`}
      style={{
        background: card.color === 'wild'
          ? 'conic-gradient(from 45deg, #8a2332, #c9a24b, #3f6b4a, #33506e, #8a2332)'
          : bg,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="uno-card-label">{cardLabel(card)}</span>
    </button>
  )
}

export default function WildSwitch() {
  const { credits, adjustCredits } = useCredits()
  const { addEntry } = useHistory()
  const [stage, setStage] = useState('setup') // setup | playing
  const [stake, setStake] = useState(25)

  const [playerHand, setPlayerHand] = useState([])
  const [computerHand, setComputerHand] = useState([])
  const [drawPile, setDrawPile] = useState([])
  const [discardPile, setDiscardPile] = useState([])
  const [activeColor, setActiveColor] = useState(null)
  const [turn, setTurn] = useState('player')
  const [pendingWild, setPendingWild] = useState(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState(null)

  function startGame() {
    if (credits < stake) return
    adjustCredits(-stake)

    let deck = shuffle(buildDeck())
    const pHand = deck.slice(0, 7)
    const cHand = deck.slice(7, 14)
    let rest = deck.slice(14)

    const startIdx = rest.findIndex((c) => c.color !== 'wild' && !['skip', 'reverse', 'draw2'].includes(c.value))
    const starter = startIdx >= 0 ? rest[startIdx] : rest[0]
    rest = rest.filter((c) => c.id !== starter.id)

    setPlayerHand(pHand)
    setComputerHand(cHand)
    setDrawPile(rest)
    setDiscardPile([starter])
    setActiveColor(starter.color)
    setTurn('player')
    setPendingWild(null)
    setMessage('Your move — match the color or number.')
    setBusy(false)
    setGameOver(false)
    setWinner(null)
    setStage('playing')
  }

  function playAgain() {
    setStage('setup')
  }

  function runComputerTurn(compHand, draw, discard, color) {
    const topCard = discard[discard.length - 1]
    const valid = compHand.filter((c) => isValidPlay(c, topCard, color))
    const choice = valid.find((c) => c.color !== 'wild') || valid[0]

    if (!choice) {
      const { drawn, drawPile: newDraw, discardPile: newDiscard } = drawCards(1, draw, discard)
      const newHand = [...compHand, ...drawn]
      setComputerHand(newHand)
      setDrawPile(newDraw)
      setDiscardPile(newDiscard)
      setMessage('Computer draws a card. Your move.')
      setTurn('player')
      setBusy(false)
      return
    }

    const newCompHand = compHand.filter((c) => c.id !== choice.id)
    let newDiscard = [...discard, choice]
    const newColor = choice.color === 'wild' ? mostCommonColor(newCompHand) : choice.color

    setComputerHand(newCompHand)
    setDiscardPile(newDiscard)
    setActiveColor(newColor)

    if (newCompHand.length === 0) {
      setGameOver(true)
      setWinner('computer')
      setMessage('Computer plays its last card. This round goes to the house.')
      setBusy(false)
      addEntry({ game: 'Wild Switch', outcome: 'lose', delta: -stake, note: 'Computer emptied its hand first' })
      return
    }

    if (choice.value === 'skip' || choice.value === 'reverse') {
      setMessage(`Computer plays ${cardLabel(choice)} — your turn is skipped.`)
      setTimeout(() => runComputerTurn(newCompHand, draw, newDiscard, newColor), TURN_DELAY)
      return
    }

    if (choice.value === 'draw2' || choice.value === 'wild4') {
      const n = choice.value === 'draw2' ? 2 : 4
      const { drawn, drawPile: newDraw, discardPile: reshuffled } = drawCards(n, draw, newDiscard)
      const newPlayerHand = [...playerHand, ...drawn]
      setPlayerHand(newPlayerHand)
      setDrawPile(newDraw)
      setDiscardPile(reshuffled)
      setMessage(`Computer plays ${cardLabel(choice)} — you draw ${n} and your turn is skipped.`)
      setTimeout(() => runComputerTurn(newCompHand, newDraw, reshuffled, newColor), TURN_DELAY)
      return
    }

    setMessage('Computer plays. Your move.')
    setTurn('player')
    setBusy(false)
  }

  function finishPlayerCard(card, chosenColor) {
    const newPlayerHand = playerHand.filter((c) => c.id !== card.id)
    const newDiscard = [...discardPile, card]
    const newColor = card.color === 'wild' ? chosenColor : card.color

    setPlayerHand(newPlayerHand)
    setDiscardPile(newDiscard)
    setActiveColor(newColor)
    setPendingWild(null)

    if (newPlayerHand.length === 0) {
      const winnings = stake * 2
      adjustCredits(winnings)
      setGameOver(true)
      setWinner('player')
      setMessage(`You play your last card. You win ${winnings.toLocaleString()} credits.`)
      addEntry({ game: 'Wild Switch', outcome: 'win', delta: stake, note: 'Emptied your hand first' })
      return
    }

    if (card.value === 'skip' || card.value === 'reverse') {
      setMessage(`You play ${cardLabel(card)} — computer's turn is skipped. Your move again.`)
      return
    }

    if (card.value === 'draw2' || card.value === 'wild4') {
      const n = card.value === 'draw2' ? 2 : 4
      const { drawn, drawPile: newDraw, discardPile: reshuffled } = drawCards(n, drawPile, newDiscard)
      const newCompHand = [...computerHand, ...drawn]
      setComputerHand(newCompHand)
      setDrawPile(newDraw)
      setDiscardPile(reshuffled)
      setMessage(`Computer draws ${n} and its turn is skipped. Your move again.`)
      return
    }

    setMessage('Computer is thinking…')
    setTurn('computer')
    setBusy(true)
    setTimeout(() => runComputerTurn(computerHand, drawPile, newDiscard, newColor), TURN_DELAY)
  }

  function handlePlayerCardClick(card) {
    if (busy || turn !== 'player' || gameOver) return
    const topCard = discardPile[discardPile.length - 1]
    if (!isValidPlay(card, topCard, activeColor)) return

    if (card.color === 'wild') {
      setPendingWild(card)
      return
    }
    finishPlayerCard(card, null)
  }

  function handlePlayerDraw() {
    if (busy || turn !== 'player' || gameOver) return
    const { drawn, drawPile: newDraw, discardPile: reshuffled } = drawCards(1, drawPile, discardPile)
    const newHand = [...playerHand, ...drawn]
    setPlayerHand(newHand)
    setDrawPile(newDraw)
    setDiscardPile(reshuffled)
    setMessage('You draw a card. Computer is thinking…')
    setTurn('computer')
    setBusy(true)
    setTimeout(() => runComputerTurn(computerHand, newDraw, reshuffled, activeColor), TURN_DELAY)
  }

  if (stage === 'setup') {
    return (
      <div className="panel">
        <h2>Wild Switch</h2>
        <p className="subtitle">An Uno-inspired color-and-number card game, one hand against the house. Empty your hand first to win double your stake.</p>
        <div className="bet-row">
          <div className="field">
            <label>Stake</label>
            <div className="chip-row">
              {STAKES.map((s) => (
                <button key={s} className={`chip${stake === s ? ' selected' : ''}`} onClick={() => setStake(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button className="primary-btn" onClick={startGame} disabled={credits < stake}>
            Deal hand for {stake}
          </button>
        </div>
        <hr className="divider" />
        <div className="payout-table">
          <div><span>Empty your hand first</span> — win 2× your stake</div>
          <div><span>Skip / Back</span> — opponent loses their turn</div>
          <div><span>+2 / +4</span> — opponent draws and loses their turn</div>
          <div><span>Wild / +4</span> — choose the next color</div>
        </div>
      </div>
    )
  }

  const topCard = discardPile[discardPile.length - 1]

  return (
    <div className={`panel${gameOver && winner === 'player' ? ' win-flash' : ''}`}>
      <h2>Wild Switch</h2>

      <div className="uno-opponent-row">
        <span className="uno-side-label">Computer — {computerHand.length} card{computerHand.length === 1 ? '' : 's'}</span>
        <div className="uno-back-strip">
          {Array.from({ length: Math.min(computerHand.length, 10) }).map((_, i) => (
            <div className="uno-card-back" key={i} />
          ))}
        </div>
      </div>

      <div className="uno-table">
        <div className="uno-pile-group">
          <button className="uno-draw-pile" onClick={handlePlayerDraw} disabled={busy || turn !== 'player' || gameOver}>
            Draw
            <span className="uno-pile-count">{drawPile.length}</span>
          </button>
          {topCard && <Card card={topCard} disabled />}
        </div>
        <div className="uno-color-indicator">
          Color in play
          <span className="uno-color-dot" style={{ background: activeColor === 'wild' ? '#fff' : COLOR_HEX[activeColor] }} />
        </div>
      </div>

      {pendingWild && (
        <div className="uno-color-picker">
          <span>Choose a color:</span>
          <div className="uno-color-options">
            {COLORS.map((c) => (
              <button
                key={c}
                className="uno-color-swatch"
                style={{ background: COLOR_HEX[c] }}
                onClick={() => finishPlayerCard(pendingWild, c)}
                aria-label={c}
              />
            ))}
          </div>
        </div>
      )}

      <div className="result-line" style={{ textAlign: 'center' }}>
        <span className={gameOver ? (winner === 'player' ? 'win' : 'lose') : ''}>{message}</span>
      </div>

      <hr className="divider" />

      <div className="uno-hand-row">
        <span className="uno-side-label">Your hand — {playerHand.length} card{playerHand.length === 1 ? '' : 's'}</span>
        <div className="uno-hand">
          {playerHand.map((card) => (
            <Card
              key={card.id}
              card={card}
              small
              onClick={() => handlePlayerCardClick(card)}
              disabled={busy || turn !== 'player' || gameOver || !isValidPlay(card, topCard, activeColor)}
            />
          ))}
        </div>
      </div>

      {gameOver && (
        <div className="bet-row" style={{ marginTop: 20 }}>
          <button className="primary-btn" onClick={playAgain}>
            Play again
          </button>
        </div>
      )}
    </div>
  )
}