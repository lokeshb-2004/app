import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import logo from '../assets/mango.svg';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} onError={(e)=>{e.currentTarget.src = logo}} />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-rating">
          <span className="stars">{'⭐'.repeat(Math.floor(product.rating))}</span>
          <span className="rating-value">{product.rating}</span>
        </div>
        
        <div className="product-footer">
          <div className="product-price">
            <span className="price-amount">₹{product.price}</span>
            <span className="price-unit">/{product.unit}</span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="add-to-cart-btn"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
