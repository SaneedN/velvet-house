import React from 'react'
import { useHistory } from '../context/HistoryContext.jsx'

function formatTime(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function SavedPage() {
  const { history, clearHistory } = useHistory()

  return (
    <div className="panel">
      <h2>Saved — your play history</h2>
      <p className="subtitle">Every round you finish across all three games lands here, most recent first.</p>

      {history.length === 0 ? (
        <div className="empty-state">No games played yet — jump into a table from Home.</div>
      ) : (
        <div className="history-list">
          {history.map((h) => (
            <div key={h.id} className={`history-row${h.outcome === 'win' ? ' win' : h.outcome === 'lose' ? ' lose' : ''}`}>
              <div className="history-main">
                <span className="history-game">{h.game}</span>
                <span className="history-note">{h.note}</span>
              </div>
              <div className="history-side">
                <span className={`history-amount${h.delta > 0 ? ' positive' : h.delta < 0 ? ' negative' : ''}`}>
                  {h.delta > 0 ? '+' : ''}
                  {h.delta}
                </span>
                <span className="history-time">{formatTime(h.at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <button className="reset-link" style={{ marginTop: 18 }} onClick={clearHistory}>
          Clear history
        </button>
      )}
    </div>
  )
}