import { useEffect, useMemo, useState } from 'react'

function ratingsKey(id) {
  return `ratings:${id}`
}

function readRatings(id) {
  try {
    return JSON.parse(localStorage.getItem(ratingsKey(id)) || '{"ratings":[],"comments":[]}')
  } catch {
    return { ratings: [], comments: [] }
  }
}

function writeRatings(id, data) {
  localStorage.setItem(ratingsKey(id), JSON.stringify(data))
}

export default function MangoCard({ product, onAdd }) {
  const [qty, setQty] = useState(1)
  const [ratingInput, setRatingInput] = useState(5)
  const [commentInput, setCommentInput] = useState('')
  const [data, setData] = useState(() => readRatings(product.id))

  useEffect(() => {
    setData(readRatings(product.id))
  }, [product.id])

  const avg = useMemo(() => {
    if (!data.ratings.length) return 0
    return (data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(1)
  }, [data])

  const addRating = (e) => {
    e.preventDefault()
    const r = Number(ratingInput)
    if (!r || r < 1 || r > 5) return
    const next = { ratings: [...data.ratings, r], comments: commentInput ? [...data.comments, commentInput] : data.comments }
    setData(next)
    writeRatings(product.id, next)
    setCommentInput('')
  }

  const total = qty * product.pricePerKg

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <div>₹{product.pricePerKg}/kg</div>
      <div className="rating">⭐ {avg} ({data.ratings.length})</div>

      <div className="qty">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
        <span>{qty} kg</span>
        <button onClick={() => setQty((q) => q + 1)}>+</button>
      </div>
      <div>Total: ₹{total}</div>
      <button onClick={() => onAdd({ ...product, qty })}>Add to cart</button>

      <form className="form" onSubmit={addRating}>
        <label>
          Give rating (1-5)
          <select value={ratingInput} onChange={(e) => setRatingInput(e.target.value)}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label>
          Comment
          <textarea rows={2} value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder="Write your review..." />
        </label>
        <button type="submit">Submit review</button>
      </form>

      {data.comments.length > 0 && (
        <div className="comments">
          <strong>Comments</strong>
          {data.comments.map((c, i) => (
            <div key={i}>• {c}</div>
          ))}
        </div>
      )}
    </div>
  )
}
