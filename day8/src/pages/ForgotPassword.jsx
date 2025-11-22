import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getUser, generateOtp } from '../services/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email) return setError('Enter your email')
    const user = getUser(email)
    if (!user) return setError('No account found for this email')
    const code = generateOtp(email)
    localStorage.setItem('resetEmail', email)
    alert(`OTP sent to email (demo): ${code}`)
    navigate('/verify-otp')
  }

  return (
    <div className="center-screen">
      <div className="card">
        <h2>Forgot password</h2>
        <form onSubmit={onSubmit} className="form">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit">Send OTP</button>
        </form>
        <p>
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  )
}
