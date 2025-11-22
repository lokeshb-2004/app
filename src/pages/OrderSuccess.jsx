import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './OrderSuccess.css'

export default function OrderSuccess(){
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:5174/api/orders/${id}`).then(r=>r.json()).then(setOrder).catch(()=>{})
  }, [id])

  return (
    <div className="page">
      <Header />
      <main className="main-content">
        <div className="receipt">
          <h1>Order Successful</h1>
          <p className="muted">Order ID: {id}</p>
          {order ? (
            <div className="receipt-card">
              <div className="row between">
                <div>
                  <div className="label">Customer</div>
                  <div>{order.user?.name}</div>
                  <div className="muted">{order.user?.phone}</div>
                </div>
                <div className="right">
                  <div className="label">Total</div>
                  <div className="total">₹{order.amount}</div>
                  <div className="muted">{order.paymentMethod?.toUpperCase()}</div>
                </div>
              </div>

              <div className="items">
                {order.cart?.map((it)=> (
                  <div className="item" key={it.id}>
                    <div>{it.name} × {it.quantity} {it.unit || 'kg'}</div>
                    <div>₹{it.price * it.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="row between">
                <div className="muted">Status</div>
                <div className="badge">{order.status}</div>
              </div>

              <div className="actions">
                <button className="primary" onClick={()=>window.print()}>Print Bill</button>
                <Link to="/products" className="link-btn">Continue shopping</Link>
              </div>
            </div>
          ) : <div className="receipt-card">Loading...</div>}
        </div>
      </main>
      <Footer />
    </div>
  )
}