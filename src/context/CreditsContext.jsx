import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext.jsx'

const CreditsContext = createContext(null)
const STARTING_CREDITS = 1000

function keyFor(email) {
  return `velvet-house-credits:${email || 'guest'}`
}

export function CreditsProvider({ children }) {
  const { user } = useAuth()
  const [credits, setCredits] = useState(STARTING_CREDITS)

  useEffect(() => {
    if (!user) return
    try {
      const saved = window.localStorage.getItem(keyFor(user.email))
      setCredits(saved !== null ? JSON.parse(saved) : STARTING_CREDITS)
    } catch {
      setCredits(STARTING_CREDITS)
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    try {
      window.localStorage.setItem(keyFor(user.email), JSON.stringify(credits))
    } catch {
      // storage unavailable — game still works for the session
    }
  }, [credits, user])

  const adjustCredits = useCallback((delta) => {
    setCredits((c) => Math.max(0, c + delta))
  }, [])

  const resetCredits = useCallback(() => {
    setCredits(STARTING_CREDITS)
  }, [])

  return (
    <CreditsContext.Provider value={{ credits, adjustCredits, resetCredits }}>
      {children}
    </CreditsContext.Provider>
  )
}

export function useCredits() {
  const ctx = useContext(CreditsContext)
  if (!ctx) throw new Error('useCredits must be used within CreditsProvider')
  return ctx
}