import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

const CreditsContext = createContext(null)
const STORAGE_KEY = 'velvet-house-credits'
const STARTING_CREDITS = 1000

export function CreditsProvider({ children }) {
  const [credits, setCredits] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      return saved !== null ? JSON.parse(saved) : STARTING_CREDITS
    } catch {
      return STARTING_CREDITS
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(credits))
    } catch {
      // storage unavailable — game still works for the session
    }
  }, [credits])

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
