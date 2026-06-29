import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>JBN Cakes</h2>
            <p>Premium handcrafted cakes made with love and the finest ingredients.</p>
            <div className="social-links"><h3>contect us:</h3>
              <a href="https://instagram.com/jbnca_kes" target="_blank" rel="noopener noreferrer" className="social-link">
                <InstagramIcon />
              </a>
            </div>
          </div>
          
          <div className="footer-contact">
            <h3>Address</h3>
            {/* <div className="contact-item">
              <Phone size={18} />
              <span>+91 9876543210</span>
            </div>
            <div className="contact-item">
              <Mail size={18} />
              <span>orders@jbncakes.com</span>
            </div> */}
            <div className="contact-item">
              <MapPin size={18} />
              <span>Church road,Kaniyakumai,
                pin code 629702</span>
            </div>
          </div>
          
          {/* <div className="footer-hours">
            <h3>Opening Hours</h3>
            <p>Mon - Fri: 9:00 AM - 8:00 PM</p>
            <p>Sat - Sun: 10:00 AM - 9:00 PM</p>
          </div> */}

          <div className="footer-map">
            <h3>Our Location</h3>
            <div className="map-container" style={{ marginTop: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d446.5541694705796!2d77.5509538865768!3d8.086389780282659!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04ed307b89b2fd%3A0x6bb317c3b92109dc!2sGmart!5e0!3m2!1sen!2sin!4v1782665972988!5m2!1sen!2sin" 
                width="100%" 
                height="150" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="strict-origin-when-cross-origin"
                title="Google Maps Location"
              ></iframe>


            </div>
          </div>
          
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} JBN Cakes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
