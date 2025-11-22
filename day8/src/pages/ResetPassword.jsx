import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { setPassword, clearOtp } from '../services/auth'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [password, setPasswordState] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const e = localStorage.getItem('resetEmail') || ''
    setEmail(e)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email) return setError('No email to reset. Start again.')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    if (password !== confirm) return setError('Passwords do not match')
    setPassword(email, password)
    clearOtp(email)
    localStorage.removeItem('resetEmail')
    alert('Password reset successful. Please login.')
    navigate('/login')
  }

  return (
    <div className="center-screen">
      <div className="card">
        <h2>Set new password</h2>
        {email ? <p>For account: <strong>{email}</strong></p> : <p>No email found. <Link to="/forgot">Start again</Link></p>}
        <form onSubmit={onSubmit} className="form">
          <label>
            New password
            <input type="password" value={password} onChange={(e) => setPasswordState(e.target.value)} />
          </label>
          <label>
            Re-type password
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit">Update password</button>
        </form>
      </div>
    </div>
  )
}
