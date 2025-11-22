import Header from '../components/Header';
import Footer from '../components/Footer';
import { ownerInfo } from '../data/mangoes';
import './Contact.css';

export default function Contact() {
  return (
    <div className="page">
      <Header />
      
      <main className="main-content">
        <div className="contact-container">
          <div className="contact-hero">
            <h1>Contact Us</h1>
            <p>We'd love to hear from you. Get in touch with us!</p>
          </div>

          <div className="contact-content">
            <div className="contact-info-section">
              <h2>Get In Touch</h2>
              
              <div className="contact-card">
                <div className="contact-item">
                  <span className="contact-icon">👤</span>
                  <div>
                    <h3>Customer</h3>
                    <p>{ownerInfo.name}</p>
                  </div>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <div>
                    <h3>Phone</h3>
                    <a href={`tel:${ownerInfo.contact}`}>{ownerInfo.contact}</a>
                  </div>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div>
                    <h3>Location</h3>
                    <p>{ownerInfo.location}</p>
                  </div>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">🌾</span>
                  <div>
                    <h3>Farm Details</h3>
                    <p>{ownerInfo.landSize} | {ownerInfo.varieties}</p>
                  </div>
                </div>
              </div>

              <div className="business-hours">
                <h3>Business Hours</h3>
                <p>Monday - Saturday: 8:00 AM - 6:00 PM</p>
                <p>Sunday: 9:00 AM - 2:00 PM</p>
              </div>

              <div className="contact-card">
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <h3>For queries</h3>
                    <p>Please call us. Message form is disabled.</p>
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
