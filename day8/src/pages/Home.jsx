import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { addToCart } from '../services/cart'
import { MANGOES } from '../data/mangoes'
import MangoCard from '../components/MangoCard'
import { getSession, getUser } from '../services/auth'

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const email = getSession()
    if (!email) return
    const u = getUser(email)
    setUser(u)
  }, [])

  const handleAdd = (item) => {
    addToCart({ id: item.id, name: item.name, pricePerKg: item.pricePerKg, qty: item.qty })
    alert(`${item.name} (${item.qty} kg) added. Total: ₹${item.qty * item.pricePerKg}`)
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '12px 16px' }}>
        <h2 style={{ margin: 0 }}>Welcome {user ? user.username : 'User'}!</h2>
      </div>
      <div className="grid">
        {MANGOES.map((m) => (
          <MangoCard key={m.id} product={m} onAdd={handleAdd} />
        ))}
      </div>
    </div>
  )
}
