import React from 'react'

const TABS = [
  { id: 'slots', label: 'Slots' },
  { id: 'roulette', label: 'Roulette' },
  { id: 'dice', label: 'Dice & coin' },
]

export default function GameTabs({ active, onChange }) {
  return (
    <nav className="tabs" role="tablist" aria-label="Choose a game">
      {TABS.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          className={`tab${active === t.id ? ' active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
