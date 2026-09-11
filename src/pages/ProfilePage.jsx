import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useCredits } from '../context/CreditsContext.jsx'
import { useHistory } from '../context/HistoryContext.jsx'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { credits, resetCredits } = useCredits()
  const { history } = useHistory()

  const wins = history.filter((h) => h.outcome === 'win').length
  const losses = history.filter((h) => h.outcome === 'lose').length

  return (
    <div className="panel">
      <h2>Profile</h2>
      <p className="subtitle">Your account, stored on this browser only.</p>

      <div className="profile-card">
        <div className="avatar profile-avatar">{user?.name?.charAt(0).toUpperCase() || '?'}</div>
        <div>
          <div className="profile-name">{user?.name}</div>
          <div className="profile-email">{user?.email}</div>
        </div>
      </div>

      <div className="payout-table" style={{ margin: '24px 0' }}>
        <div>
          <span>{credits.toLocaleString()}</span> current credits
        </div>
        <div>
          <span>{wins}</span> rounds won
        </div>
        <div>
          <span>{losses}</span> rounds lost
        </div>
      </div>

      <div className="bet-row">
        <button className="primary-btn" onClick={resetCredits}>
          Reset balance to 1,000
        </button>
        <button className="reset-link" onClick={logout}>
          Log out
        </button>
      </div>
    </div>
  )
}