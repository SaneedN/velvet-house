import React from 'react'

const TABS = [
  { id: 'dice', label: 'Dice & coin' },
  { id: 'rps', label: 'Rock, paper, scissors' },
  { id: 'uno', label: 'Wild Switch' },
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
