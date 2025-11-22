import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { verifyOtp } from '../services/auth'

export default function VerifyOtp() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const e = localStorage.getItem('resetEmail') || ''
    setEmail(e)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email) return setError('No email to verify. Start again.')
    if (!code) return setError('Enter the OTP code')
    if (verifyOtp(email, code)) {
      navigate('/reset-password')
    } else {
      setError('Invalid or expired OTP')
    }
  }

  return (
    <div className="center-screen">
      <div className="card">
        <h2>Verify OTP</h2>
        {email ? <p>OTP sent to: <strong>{email}</strong></p> : <p>No email found. <Link to="/forgot">Start again</Link></p>}
        <form onSubmit={onSubmit} className="form">
          <label>
            Enter OTP
            <input value={code} onChange={(e) => setCode(e.target.value)} />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit">Verify</button>
        </form>
      </div>
    </div>
  )
}
