import React, { useEffect, useState } from 'react'
import { useCredits } from '../context/CreditsContext.jsx'
import { useCountUp } from '../hooks/useCountUp.js'

export default function Header() {
  const { credits, resetCredits } = useCredits()
  const displayCredits = useCountUp(credits)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    setFlash(true)
    const t = setTimeout(() => setFlash(false), 450)
    return () => clearTimeout(t)
  }, [credits])

  return (
    <header className="header">
      <div className="brand">
        <span className="brand-mark">Velvet House</span>
        <span className="brand-sub">play-money tables</span>
      </div>
      <div className="credit-meter">
        <div className="label">Your credits</div>
        <div className={`value${flash ? ' flash' : ''}`}>{displayCredits.toLocaleString()}</div>
        <button className="reset-link" onClick={resetCredits}>
          Reset balance
        </button>
      </div>
    </header>
  )
}
