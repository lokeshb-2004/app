import { logout } from '../services/auth'
import { cartCount, cartTotal } from '../services/cart'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const count = cartCount()
  const total = cartTotal()

  return (
    <header className="navbar">
      <div className="logo">Chittoor Mango</div>
      <nav className="links">
        <a href="#contact">Contact</a>
        <a href="#about">About</a>
        <a href="#profile">Profile</a>
        <button onClick={() => { logout(); navigate('/login') }}>Logout</button>
        <span>Cart <span className="cart-badge">{count}</span> ₹{total}</span>
      </nav>
    </header>
  )
}
