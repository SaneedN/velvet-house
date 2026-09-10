import React from 'react'

export default function GameGrid({ games, activeId, onSelect }) {
  return (
    <section className="games-section">
      <div className="games-section-head">
        <h2>Games</h2>
      </div>
      <div className="game-card-grid">
        {games.map((g) => (
          <button
            key={g.id}
            className={`game-card${activeId === g.id ? ' active' : ''}`}
            style={{ background: g.gradient }}
            onClick={() => onSelect(g.id)}
          >
            <div className="game-card-top">
              <span className="game-card-icon">{g.icon}</span>
              <span className="game-card-play" aria-hidden="true">▶</span>
            </div>
            <div className="game-card-bottom">
              <span className="game-card-title">{g.title}</span>
              <span className="game-card-tag">{g.tag}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}