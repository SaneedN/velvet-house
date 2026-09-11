import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function AuthPage() {
  const { login, register, resetPassword } = useAuth()
  const [mode, setMode] = useState('login') // login | register | forgot
  const [form, setForm] = useState({ name: '', email: '', password: '', repeatPassword: '', newPassword: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function switchMode(next) {
    setMode(next)
    setError('')
    setNotice('')
  }

  function handleLogin(e) {
    e.preventDefault()
    setError('')
    const res = login(form)
    if (!res.ok) setError(res.error)
  }

  function handleRegister(e) {
    e.preventDefault()
    setError('')
    const res = register(form)
    if (!res.ok) setError(res.error)
  }

  function handleForgot(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    const res = resetPassword({ email: form.email, newPassword: form.newPassword })
    if (!res.ok) {
      setError(res.error)
      return
    }
    setNotice('Password updated — you can log in now.')
    setMode('login')
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="sidebar-logo">VH</div>
          <span>Velvet House</span>
        </div>

        {mode !== 'forgot' && (
          <div className="auth-tabs">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>
              Log in
            </button>
            <button className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>
              Register
            </button>
          </div>
        )}

        {notice && <div className="auth-notice">{notice}</div>}
        {error && <div className="auth-error">{error}</div>}

        {mode === 'login' && (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="field">
              <label>Name</label>
              <input className="auth-input" type="text" value={form.name} onChange={(e) => update('name', e.target.value)} />
            </div>
            <div className="field">
              <label>Email</label>
              <input className="auth-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="auth-input" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} />
            </div>
            <div className="field">
              <label>Repeat password</label>
              <input className="auth-input" type="password" value={form.repeatPassword} onChange={(e) => update('repeatPassword', e.target.value)} />
            </div>
            <button className="auth-forgot-link" type="button" onClick={() => switchMode('forgot')}>
              Forgot password?
            </button>
            <button className="primary-btn auth-submit" type="submit">
              Log in
            </button>
          </form>
        )}

        {mode === 'register' && (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="field">
              <label>Name</label>
              <input className="auth-input" type="text" value={form.name} onChange={(e) => update('name', e.target.value)} />
            </div>
            <div className="field">
              <label>Email</label>
              <input className="auth-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="auth-input" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} />
            </div>
            <button className="primary-btn auth-submit" type="submit">
              Sign up
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form className="auth-form" onSubmit={handleForgot}>
            <p className="subtitle" style={{ margin: '0 0 18px' }}>
              This demo has no email service — enter the email on the account and set a new password directly.
            </p>
            <div className="field">
              <label>Email</label>
              <input className="auth-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div className="field">
              <label>New password</label>
              <input className="auth-input" type="password" value={form.newPassword} onChange={(e) => update('newPassword', e.target.value)} />
            </div>
            <button className="primary-btn auth-submit" type="submit">
              Update password
            </button>
            <button className="auth-forgot-link" type="button" onClick={() => switchMode('login')}>
              Back to log in
            </button>
          </form>
        )}

        <p className="auth-fineprint">Demo accounts only — stored in this browser, not a real authentication service.</p>
      </div>
    </div>
  )
}