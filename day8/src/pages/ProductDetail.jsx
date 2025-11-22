import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { mangoes } from '../data/mangoes';
import logo from '../assets/mango.svg';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Reviews state
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviews, setReviews] = useState({ ratings: [], comments: [] });

  const product = mangoes.find(m => m.id === parseInt(id));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${quantity} kg of ${product.name} added to cart!`);
  };

  // Load reviews from API or localStorage
  useEffect(() => {
    if (!product) return;
    const key = `reviews:${product.id}`;
    const local = localStorage.getItem(key);
    if (local) {
      try { setReviews(JSON.parse(local)); } catch { setReviews({ratings:[],comments:[]}); }
    }
    // Try backend
    fetch(`http://localhost:5174/api/ratings/${product.id}`).then(r=>r.ok?r.json():null).then(data=>{
      if (data && Array.isArray(data.comments)) {
        setReviews({ ratings: data.ratings || [], comments: data.comments || [] });
      }
    }).catch(()=>{});
  }, [product]);

  const avg = useMemo(() => {
    if (!reviews.ratings?.length) return 0;
    return (reviews.ratings.reduce((a,b)=>a+b,0)/reviews.ratings.length).toFixed(1);
  }, [reviews]);

  const addReview = async (e) => {
    e.preventDefault();
    const r = Number(ratingInput);
    if (!r || r < 1 || r > 5) return;

    // one rating per device: overwrite previous rating if exists
    const meKey = `myRating:${product.id}`;
    const prevMy = Number(localStorage.getItem(meKey) || 0);

    let ratings = [...reviews.ratings];
    if (prevMy) {
      // replace one instance of prevMy if present
      const idx = ratings.indexOf(prevMy);
      if (idx >= 0) ratings[idx] = r; else ratings = [...ratings, r];
    } else {
      ratings = [...ratings, r];
    }
    localStorage.setItem(meKey, String(r));

    const next = { ratings, comments: commentInput ? [...reviews.comments, { text: commentInput, at: new Date().toISOString() }] : reviews.comments };
    setReviews(next);
    localStorage.setItem(`reviews:${product.id}`, JSON.stringify(next));
    setCommentInput('');
    // Try send to backend
    try {
      await fetch('http://localhost:5174/api/ratings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ productId: product.id, rating: r, comment: commentInput }) });
    } catch {
      /* offline fallback already saved */
    }
  };

  // Not found guard AFTER hooks
  if (!product) {
    return (
      <div className="page">
        <Header />
        <div className="not-found">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/products')}>Back to Products</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Header />
      
      <main className="main-content">
        <div className="product-detail-container">
          <button onClick={() => navigate('/products')} className="back-btn">
            ← Back to Products
          </button>

          <div className="product-detail">
            <div className="product-detail-image">
              <img src={product.image} alt={product.name} onError={(e)=>{e.currentTarget.src = logo}} />
            </div>

            <div className="product-detail-info">
              <h1>{product.name}</h1>
              
              <div className="product-detail-rating">
                <span className="stars">{'⭐'.repeat(Math.floor(product.rating))}</span>
                <span className="rating-value">{product.rating} out of 5</span>
              </div>

              <p className="product-detail-description">{product.description}</p>

              <div className="product-detail-price">
                <span className="price-label">Price:</span>
                <span className="price">₹{product.price}/{product.unit}</span>
              </div>

              <div className="product-detail-stock">
                {product.inStock ? (
                  <span className="in-stock">✓ In Stock</span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>

              <div className="product-detail-actions">
                <div className="quantity-selector">
                  <label>Quantity (kg):</label>
                  <div className="quantity-controls">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                    />
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="add-to-cart-btn-large"
                  disabled={!product.inStock}
                >
                  Add to Cart - ₹{product.price * quantity}
                </button>
              </div>
            </div>
          </div>

          <section className="reviews-section" style={{marginTop:'1.5rem'}}>
            <h2>Reviews</h2>
            <div className="product-detail-rating" style={{marginBottom:'.5rem'}}>
              <span className="stars">{'⭐'.repeat(Math.round(avg || 0))}</span>
              <span className="rating-value">{avg} ({reviews.ratings.length})</span>
            </div>

            <form className="form" onSubmit={addReview} style={{marginBottom:'1rem'}}>
              <div>
                <div style={{fontSize:'14px', marginBottom:'6px'}}>Your rating</div>
                <div aria-label="Rate" role="radiogroup" style={{display:'flex',gap:'6px',fontSize:'24px',cursor:'pointer'}}>
                  {[1,2,3,4,5].map(n => (
                    <span key={n} role="radio" aria-checked={ratingInput===n}
                      onClick={()=>setRatingInput(n)}
                      style={{color: n<=ratingInput? '#f59e0b' : '#d1d5db'}}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <label>
                Comment
                <textarea rows="3" placeholder="Write your review..." value={commentInput} onChange={(e)=>setCommentInput(e.target.value)} />
              </label>
              <button className="add-to-cart-btn" type="submit">Submit review</button>
            </form>

            <div className="comments" style={{display:'grid',gap:'.5rem'}}>
              {reviews.comments?.length ? reviews.comments.slice().reverse().map((c, i) => (
                <div key={i} className="card" style={{padding:'12px'}}>
                  <div style={{fontSize:'14px'}}>{c.text || c}</div>
                  {c.at && <div style={{color:'#6b7280',fontSize:'12px'}}>{new Date(c.at).toLocaleString()}</div>}
                </div>
              )) : <div>No comments yet.</div>}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
