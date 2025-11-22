import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { login, getUser } from '../services/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) return setError('Enter email and password')
    if (!getUser(email)) return setError('No account for this email')
    if (login(email, password)) {
      const from = location.state?.from?.pathname || '/home'
      navigate(from, { replace: true })
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="center-screen">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={onSubmit} className="form">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit">Login</button>
        </form>
        <div className="row">
          <span>New user? <Link to="/">Register</Link></span>
          <Link to="/forgot">Forgot password?</Link>
        </div>
      </div>
    </div>
  )
}
