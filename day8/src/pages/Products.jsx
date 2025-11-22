import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { mangoes } from '../data/mangoes';
import './Products.css';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMangoes = mangoes.filter(mango =>
    mango.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page">
      <Header />
      
      <main className="main-content">
        <div className="hero-section">
          <h1>Fresh Mango Varieties</h1>
          <p>Direct from our 7-acre farm in Mangalampeta, Andhra Pradesh</p>
        </div>

        <div className="products-container">
          <div className="filters">
            <input
              type="text"
              placeholder="Search mangoes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="products-grid">
            {filteredMangoes.map(mango => (
              <ProductCard key={mango.id} product={mango} />
            ))}
          </div>

          {filteredMangoes.length === 0 && (
            <div className="no-results">
              <p>No mangoes found. Try a different name.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
