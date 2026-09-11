import { useState } from 'react';
import { addUser, findUser } from './authStore';

// RegisterPage owns its own form state — separate from LoginPage entirely.
// On success it does NOT log the user in; it saves the account and hands
// control back to the parent, which sends the person to the login page.
export default function RegisterPage({ onRegistered, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email.';
    if (password.length < 4) e.password = 'At least 4 characters.';
    if (!e.email && findUser(email)) e.email = 'An account with that email already exists.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;

    addUser({ name: name.trim(), email: email.trim(), password });
    onRegistered(email.trim()); // parent switches the view to Login + shows a success banner
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="mark">VH</div>
          <div className="name">Velvet House</div>
        </div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Play-money tables — no real money involved.</p>

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

          <button className="primary-btn" type="submit" style={{ marginTop: 4 }}>Sign up</button>
        </form>

        <div className="auth-switch">
          Already have an account? <button className="link-btn" onClick={onSwitchToLogin}>Log in</button>
        </div>
      </div>
    </div>
  );
}