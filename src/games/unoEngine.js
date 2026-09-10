export const COLORS = ['red', 'yellow', 'green', 'blue']

export const COLOR_HEX = {
  red: '#8a2332',
  yellow: '#c9a24b',
  green: '#3f6b4a',
  blue: '#33506e',
}

let uid = 0
function nextId() {
  uid += 1
  return `c${uid}`
}

export function buildDeck() {
  const deck = []

  COLORS.forEach((color) => {
    deck.push({ id: nextId(), color, value: '0' })
    for (let n = 1; n <= 9; n += 1) {
      deck.push({ id: nextId(), color, value: String(n) })
      deck.push({ id: nextId(), color, value: String(n) })
    }
    ;['skip', 'reverse', 'draw2'].forEach((v) => {
      deck.push({ id: nextId(), color, value: v })
      deck.push({ id: nextId(), color, value: v })
    })
  })

  for (let i = 0; i < 4; i += 1) {
    deck.push({ id: nextId(), color: 'wild', value: 'wild' })
    deck.push({ id: nextId(), color: 'wild', value: 'wild4' })
  }

  return deck
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function isValidPlay(card, topCard, activeColor) {
  if (card.color === 'wild') return true
  if (card.color === activeColor) return true
  if (card.value === topCard.value) return true
  return false
}

export function cardLabel(card) {
  switch (card.value) {
    case 'skip':
      return 'Skip'
    case 'reverse':
      return 'Back'
    case 'draw2':
      return '+2'
    case 'wild':
      return 'Wild'
    case 'wild4':
      return '+4'
    default:
      return card.value
  }
}

// Draws `count` cards from drawPile, reshuffling the discard pile
// (minus its top card) back into the draw pile if it runs out.
export function drawCards(count, drawPile, discardPile) {
  let pile = [...drawPile]
  let discard = [...discardPile]
  const drawn = []

  for (let i = 0; i < count; i += 1) {
    if (pile.length === 0) {
      if (discard.length <= 1) break // nothing left to reshuffle
      const top = discard[discard.length - 1]
      const rest = discard.slice(0, -1)
      pile = shuffle(rest)
      discard = [top]
    }
    const card = pile.pop()
    if (card) drawn.push(card)
  }

  return { drawn, drawPile: pile, discardPile: discard }
}

export function mostCommonColor(hand) {
  const counts = { red: 0, yellow: 0, green: 0, blue: 0 }
  hand.forEach((c) => {
    if (counts[c.color] !== undefined) counts[c.color] += 1
  })
  let best = COLORS[0]
  COLORS.forEach((c) => {
    if (counts[c] > counts[best]) best = c
  })
  if (counts[best] === 0) return COLORS[Math.floor(Math.random() * COLORS.length)]
  return best
}