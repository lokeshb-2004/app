import Header from '../components/Header';
import Footer from '../components/Footer';
import { ownerInfo, mangoAdvantages } from '../data/mangoes';
import './About.css';

export default function About() {
  return (
    <div className="page">
      <Header />
      
      <main className="main-content">
        <div className="about-container">
          <section className="about-hero">
            <h1>About Us</h1>
            <p className="about-subtitle">Cultivating Excellence for Over a Decade</p>
          </section>

          <section className="owner-section">
            <div className="owner-card">
              <div className="owner-icon">👨‍🌾</div>
              <h2>{ownerInfo.name}</h2>
              <p className="owner-education">{ownerInfo.education}</p>
              
              <div className="owner-details">
                <div className="detail-item">
                  <strong>Experience:</strong>
                  <span>{ownerInfo.experience}</span>
                </div>
                <div className="detail-item">
                  <strong>Varieties:</strong>
                  <span>{ownerInfo.varieties}</span>
                </div>
                <div className="detail-item">
                  <strong>Farm Size:</strong>
                  <span>{ownerInfo.landSize}</span>
                </div>
                <div className="detail-item">
                  <strong>Location:</strong>
                  <span>{ownerInfo.location}</span>
                </div>
              </div>

              <p className="owner-description">
                I have completed my B.Tech and have over 10 years of experience in mango cultivation. 
                I cultivate more than 15 varieties of mangoes on 7 acres of land located in my village, 
                Mangalampeta, Pulicherla Mandal, Chittoor District, Andhra Pradesh.
              </p>

              <div className="contact-info">
                <p>If you have any doubts or would like to know more, feel free to contact me:</p>
                <a href={`tel:${ownerInfo.contact}`} className="contact-number">
                  📞 {ownerInfo.contact}
                </a>
              </div>
            </div>
          </section>

          <section className="advantages-section">
            <h2>Health Benefits of Mangoes</h2>
            <p className="section-subtitle">Discover why mangoes are called the "King of Fruits"</p>

            <div className="advantages-grid">
              {mangoAdvantages.map((advantage, index) => (
                <div key={index} className="advantage-card">
                  <div className="advantage-icon">{advantage.icon}</div>
                  <h3>{advantage.title}</h3>
                  <p>{advantage.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="story-section">
            <h2>Our Story</h2>
            <p>
              Our journey in mango cultivation began over a decade ago with a passion for growing 
              premium quality mangoes. Located in the fertile lands of Mangalampeta, our 7-acre farm 
              is home to over 15 varieties of mangoes, each carefully nurtured to perfection.
            </p>
            <p>
              With a B.Tech background and extensive hands-on experience, we combine modern agricultural 
              techniques with traditional farming wisdom to produce the finest mangoes. Every mango that 
              leaves our farm represents our commitment to quality, freshness, and customer satisfaction.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
