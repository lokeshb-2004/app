import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import './Checkout.css';

function makeOrderId() {
  const d = new Date();
  const pad = (n)=> String(n).padStart(2,'0');
  const ts = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  const r = Math.floor(Math.random()*10000).toString().padStart(4,'0');
  return `ORD-${ts}-${r}`;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();

  async function createOrder(statusHint = 'PENDING') {
    try {
      const res = await fetch('http://localhost:5174/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          user: formData,
          amount: getCartTotal(),
          paymentMethod: formData.paymentMethod,
          status: statusHint,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        return data.orderId
      }
    } catch {
      /* fallback to local order id */
    }
    return makeOrderId() // fallback local
  }

  async function markPaid(orderId) {
    try {
      await fetch('http://localhost:5174/api/payments/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId }) })
    } catch {
      /* ignore verify backend failure */
    }
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  // store or update customer in DB when contact info changes (debounced)
  let upsertTimer;
  const upsertCustomer = (data) => {
    clearTimeout(upsertTimer);
    upsertTimer = setTimeout(()=>{
      if (data.phone) {
        fetch('http://localhost:5174/api/customers/upsert', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).catch(()=>{})
      }
    }, 600);
  }
  const [paymentType, setPaymentType] = useState('upi'); // 'upi' | 'card'

  if (cart.length === 0) {
    navigate('/products');
    return null;
  }

  const handleChange = (e) => {
    const next = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(next);
    // Upsert to DB
    upsertCustomer(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod === 'online') {
      return;
    }
    // COD flow
    const orderId = await createOrder('PENDING');
    alert(`Order placed successfully!\nOrder ID: ${orderId}\nTotal: ₹${getCartTotal()}\n\nWe will contact you at ${formData.phone} for confirmation.`);
    clearCart();
    navigate('/products');
  };

  async function openGateway(orderId, preferred='upi') {
    const load = (src)=> new Promise(res=>{ const s=document.createElement('script'); s.src=src; s.onload=res; document.body.appendChild(s); });
    await load('https://checkout.razorpay.com/v1/checkout.js');
    const resp = await fetch('http://localhost:5174/api/pg/razorpay/order', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ amount: getCartTotal(), orderId })});
    const data = await resp.json();
    if (!data || !data.key) { alert('Payment gateway not configured'); return; }
    const rzp = new window.Razorpay({
      key: data.key,
      amount: data.amount,
      currency: 'INR',
      name: 'Lokesh Mango Farm',
      description: 'Order '+orderId,
      order_id: data.id,
      handler: async () => {
        await markPaid(orderId);
        navigate(`/order/${orderId}/success`);
      },
      prefill: { name: formData.name, email: formData.email, contact: formData.phone },
      theme: { color: '#16a34a' },
      config: preferred==='upi' ? { display: { blocks: { upi: { name: 'UPI', instruments: [{ method: 'upi' }] } }, sequence: ['block.upi'], preferences: { show_default_blocks: false } } } : undefined
    });
    rzp.open();
  }

  const startUpiPayment = async () => {
    const orderId = await createOrder('PENDING');
    await openGateway(orderId, 'upi');
  };


  return (
    <div className="page">
      <Header />
      
      <main className="main-content">
        <div className="checkout-container">
          <h1>Checkout</h1>

          <div className="checkout-content">
            <div className="checkout-form-section">
              <form onSubmit={handleSubmit} className="checkout-form">
                <section className="form-section">
                  <h2>Contact Information</h2>
                  
                  <div className="form-group">
                      <label htmlFor="name">Customer Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </section>

                <section className="form-section">
                  <h2>Delivery Address</h2>
                  
                  <div className="form-group">
                    <label htmlFor="address">Address *</label>
                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="state">State *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="pincode">Pincode *</label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </section>

                <section className="form-section">
                  <h2>Payment Method</h2>
                  
                  <div className="payment-options">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                      />
                      <span>Cash on Delivery</span>
                    </label>

                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={handleChange}
                      />
                      <span>Online Payment</span>
                    </label>
                  </div>

                  {formData.paymentMethod === 'online' && (
                    <div className="online-payment-box" style={{marginTop:'12px',display:'grid',gap:'12px'}}>
                      <div style={{display:'flex',gap:'8px'}}>
                        <button type="button" onClick={()=>setPaymentType('upi')} className="category-btn active">UPI</button>
                        <button type="button" onClick={()=>setPaymentType('card')} className="category-btn">Card</button>
                        <button type="button" onClick={async ()=>{
                          // Gateway payment
                          const orderId = await createOrder('PENDING');
                          // lazy load Razorpay
                          const load = (src)=> new Promise(res=>{ const s=document.createElement('script'); s.src=src; s.onload=res; document.body.appendChild(s); });
                          await load('https://checkout.razorpay.com/v1/checkout.js');
                          const resp = await fetch('http://localhost:5174/api/pg/razorpay/order', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ amount: getCartTotal(), orderId })});
                          const data = await resp.json();
                          if (!data || !data.key) { alert('Payment gateway not configured'); return; }
                          const rzp = new window.Razorpay({
                            key: data.key,
                            amount: data.amount,
                            currency: 'INR',
                            name: 'Lokesh Mango Farm',
                            description: 'Order '+orderId,
                            order_id: data.id,
                            handler: async function () {
                              await markPaid(orderId);
                              alert('Payment successful! Order ID: '+orderId);
                              clearCart();
                              navigate('/products');
                            },
                            prefill: { name: formData.name, email: formData.email, contact: formData.phone },
                            theme: { color: '#16a34a' },
                          });
                          rzp.open();
                        }} className="category-btn">Gateway</button>
                      </div>

                      {paymentType === 'upi' ? (
                        <div style={{display:'grid',gap:'10px'}}>
                          <div className="upi-apps" style={{display:'flex',gap:'8px',flexWrap:'wrap',justifyContent:'center'}}>
                            <button type="button" className="add-to-cart-btn" onClick={startUpiPayment}>Pay with UPI</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{display:'grid',gap:'10px',justifyItems:'center'}}>
                          <button type="button" className="place-order-btn" onClick={async ()=>{ const oid=await createOrder('PENDING'); await openGateway(oid,'card') }}>Pay with Card</button>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {formData.paymentMethod === 'cod' && (
                  <button type="submit" className="place-order-btn">Place Order</button>
                )}
              </form>
            </div>

            <div className="order-summary-section">
              <div className="order-summary">
                <h2>Order Summary</h2>

                <div className="order-items">
                  {cart.map(item => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="order-item-details">
                        <h4>{item.name}</h4>
                        <p>{item.quantity} kg × ₹{item.price}</p>
                      </div>
                      <div className="order-item-total">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-totals">
                  <div className="order-total-row">
                    <span>Subtotal:</span>
                    <span>₹{getCartTotal()}</span>
                  </div>
                  <div className="order-total-row">
                    <span>Delivery:</span>
                    <span>Free</span>
                  </div>
                  <div className="order-total-row order-grand-total">
                    <span>Total:</span>
                    <span>₹{getCartTotal()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
