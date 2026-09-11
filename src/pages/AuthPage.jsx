import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const EMPTY_LOGIN = { name: '', email: '', password: '', repeatPassword: '' }
const EMPTY_REGISTER = { name: '', email: '', password: '' }
const EMPTY_FORGOT = { email: '', newPassword: '' }

export default function AuthPage() {
  const { login, register, resetPassword } = useAuth()
  const [mode, setMode] = useState('login') // login | register | forgot

  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN)
  const [registerForm, setRegisterForm] = useState(EMPTY_REGISTER)
  const [forgotForm, setForgotForm] = useState(EMPTY_FORGOT)

  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  function switchMode(next) {
    setMode(next)
    setError('')
    setNotice('')
  }

  function updateLogin(field, value) {
    setLoginForm((f) => ({ ...f, [field]: value }))
  }
  function updateRegister(field, value) {
    setRegisterForm((f) => ({ ...f, [field]: value }))
  }
  function updateForgot(field, value) {
    setForgotForm((f) => ({ ...f, [field]: value }))
  }

  function handleLogin(e) {
    e.preventDefault()
    setError('')
    const res = login(loginForm)
    if (!res.ok) setError(res.error)
  }

  function handleRegister(e) {
    e.preventDefault()
    setError('')
    const res = register(registerForm)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setLoginForm({ ...EMPTY_LOGIN, email: registerForm.email })
    setRegisterForm(EMPTY_REGISTER)
    setNotice('Account created — log in to continue.')
    setMode('login')
  }

  function handleForgot(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    const res = resetPassword({ email: forgotForm.email, newPassword: forgotForm.newPassword })
    if (!res.ok) {
      setError(res.error)
      return
    }
    setForgotForm(EMPTY_FORGOT)
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
              <input className="auth-input" type="text" value={loginForm.name} onChange={(e) => updateLogin('name', e.target.value)} />
            </div>
            <div className="field">
              <label>Email</label>
              <input className="auth-input" type="email" value={loginForm.email} onChange={(e) => updateLogin('email', e.target.value)} />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="auth-input" type="password" value={loginForm.password} onChange={(e) => updateLogin('password', e.target.value)} />
            </div>
            <div className="field">
              <label>Repeat password</label>
              <input className="auth-input" type="password" value={loginForm.repeatPassword} onChange={(e) => updateLogin('repeatPassword', e.target.value)} />
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
              <input className="auth-input" type="text" value={registerForm.name} onChange={(e) => updateRegister('name', e.target.value)} />
            </div>
            <div className="field">
              <label>Email</label>
              <input className="auth-input" type="email" value={registerForm.email} onChange={(e) => updateRegister('email', e.target.value)} />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="auth-input" type="password" value={registerForm.password} onChange={(e) => updateRegister('password', e.target.value)} />
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
              <input className="auth-input" type="email" value={forgotForm.email} onChange={(e) => updateForgot('email', e.target.value)} />
            </div>
            <div className="field">
              <label>New password</label>
              <input className="auth-input" type="password" value={forgotForm.newPassword} onChange={(e) => updateForgot('newPassword', e.target.value)} />
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