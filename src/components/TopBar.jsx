import React, { useEffect, useState } from 'react'
import { useCredits } from '../context/CreditsContext.jsx'
import { useCountUp } from '../hooks/useCountUp.js'

export default function TopBar({ name = 'Saneed' }) {
  const { credits } = useCredits()
  const displayCredits = useCountUp(credits)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    setFlash(true)
    const t = setTimeout(() => setFlash(false), 450)
    return () => clearTimeout(t)
  }, [credits])

  const initial = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <header className="topbar">
      <div className="greeting">
        <h1>Hi {name}</h1>
        <p>Welcome back — the tables are open.</p>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" aria-label="Search" title="Search">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" /><path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
        <button className="icon-btn" aria-label="Notifications" title="Notifications">
          <svg viewBox="0 0 24 24" fill="none"><path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>

        <div className="credit-pill">
          <span className="credit-pill-label">Credits</span>
          <span className={`credit-pill-value${flash ? ' flash' : ''}`}>{displayCredits.toLocaleString()}</span>
        </div>

        <div className="avatar" aria-hidden="true">{initial}</div>
      </div>
    </header>
  )
}