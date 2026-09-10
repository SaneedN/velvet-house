import React from 'react'
import { useCredits } from '../context/CreditsContext.jsx'

export default function Sidebar() {
  const { resetCredits } = useCredits()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">VH</div>

      <nav className="sidebar-nav">
        <button className="sidebar-icon active" aria-label="Home" title="Home">
          <svg viewBox="0 0 24 24" fill="none"><path d="M4 11.5 12 4l8 7.5M6 10v9h12v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button className="sidebar-icon" aria-label="Saved" title="Saved">
          <svg viewBox="0 0 24 24" fill="none"><path d="M6 4h12v16l-6-4-6 4V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button className="sidebar-icon" aria-label="Messages" title="Messages">
          <svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16v11H8l-4 4V5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button className="sidebar-icon" aria-label="Profile" title="Profile">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.8" /><path d="M5 20c1.6-3.6 4.4-5.4 7-5.4s5.4 1.8 7 5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
      </nav>

      <button className="sidebar-icon sidebar-icon-bottom" aria-label="Reset balance" title="Reset balance" onClick={resetCredits}>
        <svg viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 1 1 2.6 5.9M4 12V6m0 6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </aside>
  )
}