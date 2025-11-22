import express from 'express'
import cors from 'cors'
import { pool } from './db.js'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

dotenv.config()

const app = express()
const RZP_KEY_ID = process.env.RAZORPAY_KEY_ID
const RZP_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET
app.use(cors({ origin: ['http://localhost:5173'], credentials: false }))
app.use(express.json())

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Customers
app.post('/api/customers/upsert', async (req, res) => {
  const u = req.body || {}
  if (!u.phone) return res.status(400).json({ error: 'missing_phone' })
  try {
    await pool.query('INSERT INTO customers(phone, name, email, address, city, state, pincode) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email), address=VALUES(address), city=VALUES(city), state=VALUES(state), pincode=VALUES(pincode)', [u.phone, u.name||'', u.email||'', u.address||'', u.city||'', u.state||'', u.pincode||''])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error' })
  }
})

// Ratings
app.get('/api/ratings/:productId', async (req, res) => {
  const productId = Number(req.params.productId)
  try {
    const [rows] = await pool.query('SELECT rating, comment, created_at FROM ratings WHERE product_id=? ORDER BY created_at DESC LIMIT 100', [productId])
    const ratings = rows.map(r => Number(r.rating))
    const comments = rows.filter(r=>r.comment).map(r => ({ text: r.comment, at: r.created_at }))
    res.json({ ratings, comments })
  } catch (e) {
    res.status(500).json({ error: 'db_error' })
  }
})

app.post('/api/ratings', async (req, res) => {
  const { productId, rating, comment } = req.body || {}
  if (!productId || !rating || Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({ error: 'invalid_input' })
  }
  try {
    await pool.query('INSERT INTO ratings(product_id, rating, comment) VALUES (?,?,?)', [productId, Number(rating), comment || null])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'db_error' })
  }
})

// Orders
app.post('/api/orders', async (req, res) => {
  const { cart, user, amount, paymentMethod } = req.body || {}
  const id = uuidv4()
  try {
    await pool.query('INSERT INTO orders(id, cart_json, user_json, amount, payment_method, status) VALUES (?,?,?,?,?,?)', [id, JSON.stringify(cart||[]), JSON.stringify(user||{}), amount||0, paymentMethod||'cod', 'PENDING'])
    // upsert customer
    if (user && user.phone) {
      await pool.query('INSERT INTO customers(phone, name, email, address, city, state, pincode) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email), address=VALUES(address), city=VALUES(city), state=VALUES(state), pincode=VALUES(pincode)', [user.phone, user.name||'', user.email||'', user.address||'', user.city||'', user.state||'', user.pincode||''])
    }
    res.json({ orderId: id, status: 'PENDING' })
  } catch (e) {
    res.status(500).json({ error: 'db_error' })
  }
})

app.get('/api/orders/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, cart_json, user_json, amount, payment_method, status, created_at FROM orders WHERE id=?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'not_found' })
    const r = rows[0]
    res.json({
      id: r.id,
      cart: JSON.parse(r.cart_json),
      user: JSON.parse(r.user_json),
      amount: r.amount,
      paymentMethod: r.payment_method,
      status: r.status,
      createdAt: r.created_at,
    })
  } catch (e) {
    res.status(500).json({ error: 'db_error' })
  }
})

app.post('/api/payments/verify', async (req, res) => {
  const { orderId } = req.body || {}
  if (!orderId) return res.status(400).json({ error: 'missing_orderId' })
  try {
    await pool.query('UPDATE orders SET status=? WHERE id=?', ['PAID', orderId])
    res.json({ orderId, status: 'PAID' })
  } catch (e) {
    res.status(500).json({ error: 'db_error' })
  }
})

// Razorpay - create order
app.post('/api/pg/razorpay/order', async (req, res) => {
  try {
    if (!RZP_KEY_ID || !RZP_KEY_SECRET) return res.status(500).json({ error: 'no_keys' })
    const { amount, orderId } = req.body || {}
    const payload = { amount: Number(amount) * 100, currency: 'INR', receipt: orderId || uuidv4() }
    const auth = Buffer.from(`${RZP_KEY_ID}:${RZP_KEY_SECRET}`).toString('base64')
    const resp = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
      body: JSON.stringify(payload),
    })
    const data = await resp.json()
    if (!resp.ok) return res.status(500).json({ error: 'pg_error', detail: data })
    res.json({ key: RZP_KEY_ID, ...data })
  } catch (e) {
    res.status(500).json({ error: 'pg_error' })
  }
})

const port = Number(process.env.PORT || 5174)
app.listen(port, () => console.log(`API listening on http://localhost:${port}`))
