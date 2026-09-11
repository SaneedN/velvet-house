import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext.jsx'

const HistoryContext = createContext(null)

function keyFor(email) {
  return `velvet-house-history:${email || 'guest'}`
}

export function HistoryProvider({ children }) {
  const { user } = useAuth()
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (!user) {
      setHistory([])
      return
    }
    try {
      const raw = window.localStorage.getItem(keyFor(user.email))
      setHistory(raw ? JSON.parse(raw) : [])
    } catch {
      setHistory([])
    }
  }, [user])

  const addEntry = useCallback(
    (entry) => {
      if (!user) return
      setHistory((prev) => {
        const next = [
          { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now() },
          ...prev,
        ].slice(0, 100)
        try {
          window.localStorage.setItem(keyFor(user.email), JSON.stringify(next))
        } catch {
          // best effort only
        }
        return next
      })
    },
    [user]
  )

  const clearHistory = useCallback(() => {
    if (!user) return
    setHistory([])
    try {
      window.localStorage.setItem(keyFor(user.email), JSON.stringify([]))
    } catch {
      // best effort only
    }
  }, [user])

  return (
    <HistoryContext.Provider value={{ history, addEntry, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider')
  return ctx
}