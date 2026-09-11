import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

const AuthContext = createContext(null)
const USERS_KEY = 'velvet-house-users'
const SESSION_KEY = 'velvet-house-session'

function loadUsers() {
  try {
    const raw = window.localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveUsers(users) {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch {
    // storage unavailable — session still works for this tab
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const sessionEmail = window.localStorage.getItem(SESSION_KEY)
      if (sessionEmail) {
        const users = loadUsers()
        const found = users[sessionEmail]
        if (found) setUser({ name: found.name, email: found.email })
      }
    } catch {
      // no stored session
    }
    setReady(true)
  }, [])

  const register = useCallback(({ name, email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    if (!name?.trim() || !cleanEmail || !password) {
      return { ok: false, error: 'Fill in every field.' }
    }
    const users = loadUsers()
    if (users[cleanEmail]) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    users[cleanEmail] = { name: name.trim(), email: cleanEmail, password }
    saveUsers(users)
    window.localStorage.setItem(SESSION_KEY, cleanEmail)
    setUser({ name: name.trim(), email: cleanEmail })
    return { ok: true }
  }, [])

  const login = useCallback(({ name, email, password, repeatPassword }) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    if (!name?.trim() || !cleanEmail || !password || !repeatPassword) {
      return { ok: false, error: 'Fill in every field.' }
    }
    if (password !== repeatPassword) {
      return { ok: false, error: 'Passwords do not match.' }
    }
    const users = loadUsers()
    const found = users[cleanEmail]
    if (!found || found.password !== password) {
      return { ok: false, error: 'Incorrect email or password.' }
    }
    window.localStorage.setItem(SESSION_KEY, cleanEmail)
    setUser({ name: found.name, email: found.email })
    return { ok: true }
  }, [])

  const resetPassword = useCallback(({ email, newPassword }) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    if (!cleanEmail || !newPassword) {
      return { ok: false, error: 'Enter your email and a new password.' }
    }
    const users = loadUsers()
    const found = users[cleanEmail]
    if (!found) {
      return { ok: false, error: 'No account found with that email.' }
    }
    users[cleanEmail] = { ...found, password: newPassword }
    saveUsers(users)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, ready, register, login, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}