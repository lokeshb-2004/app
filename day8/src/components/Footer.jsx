import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Farmer to Customer Farm</h3>
          <p>Premium quality mangoes directly from our 7-acre farm in Mangalampeta, Andhra Pradesh</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/products">Products</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Bhupathi Lokesh</p>
          <p>Phone: 6304815732</p>
          <p>Mangalampeta, Pulicherla Mandal</p>
          <p>Chittoor District, Andhra Pradesh</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Farmer to Customer Farm. All rights reserved.</p>
      </div>
    </footer>
  );
}
