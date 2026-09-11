import { useState } from 'react';
import { findUser } from './authStore';

// LoginPage owns its own form state — nothing here is shared with RegisterPage,
// so typing in one can never bleed into the other.
export default function LoginPage({ banner, prefillEmail, onLogin, onSwitchToRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(prefillEmail || '');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [errors, setErrors] = useState({});
  const [resetMsg, setResetMsg] = useState(false);
  const [authError, setAuthError] = useState('');

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email.';
    if (password.length < 4) e.password = 'At least 4 characters.';
    if (password !== repeat) e.repeat = "Passwords don't match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev) {
    ev.preventDefault();
    setAuthError('');
    if (!validate()) return;

    const record = findUser(email);
    if (!record || record.password !== password) {
      setAuthError('No account matches that email and password. Check your details or sign up.');
      return;
    }
    onLogin({ name: name.trim(), email: record.email });
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="mark">VH</div>
          <div className="name">Velvet House</div>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Log in to reach your tables.</p>

        {banner && <div className="notice-inline success">{banner}</div>}
        {authError && <div className="notice-inline error">{authError}</div>}
        {resetMsg && (
          <div className="notice-inline">
            If that email has an account, reset instructions would be sent (demo only — nothing is actually emailed).
          </div>
        )}

        <form onSubmit={submit} noValidate>
          <div className={'field' + (errors.name ? ' err' : '')}>
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            {errors.name && <div className="field-err">{errors.name}</div>}
          </div>
          <div className={'field' + (errors.email ? ' err' : '')}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            {errors.email && <div className="field-err">{errors.email}</div>}
          </div>
          <div className={'field' + (errors.password ? ' err' : '')}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            {errors.password && <div className="field-err">{errors.password}</div>}
          </div>
          <div className={'field' + (errors.repeat ? ' err' : '')}>
            <label>Repeat password</label>
            <input type="password" value={repeat} onChange={(e) => setRepeat(e.target.value)} placeholder="••••••••" />
            {errors.repeat && <div className="field-err">{errors.repeat}</div>}
          </div>

          <div className="row-between">
            <span></span>
            <button type="button" className="link-btn" onClick={() => setResetMsg(true)}>
              Forgot password?
            </button>
          </div>

          <button className="primary-btn" type="submit">Log in</button>
        </form>

        <div className="auth-switch">
          New here? <button className="link-btn" onClick={onSwitchToRegister}>Create an account</button>
        </div>
      </div>
    </div>
  );
}