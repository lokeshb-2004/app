import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { saveUser, getUser } from '../services/auth'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  function validate() {
    if (!form.username || !form.email || !form.password || !form.confirm) {
      return 'Please fill all fields'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return 'Invalid email'
    }
    if (form.password.length < 6) return 'Password must be at least 6 characters'
    if (form.password !== form.confirm) return 'Passwords do not match'
    if (getUser(form.email)) return 'Email already registered'
    return ''
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const msg = validate()
    if (msg) return setError(msg)
    saveUser({ username: form.username, email: form.email, password: form.password })
    alert('Registered! Please login.')
    navigate('/login')
  }

  return (
    <div className="center-screen">
      <div className="card">
        <h2>Register</h2>
        <form onSubmit={onSubmit} className="form">
          <label>
            Username
            <input name="username" value={form.username} onChange={onChange} />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={onChange} />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={onChange} />
          </label>
          <label>
            Re-type Password
            <input name="confirm" type="password" value={form.confirm} onChange={onChange} />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit">Create account</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}
