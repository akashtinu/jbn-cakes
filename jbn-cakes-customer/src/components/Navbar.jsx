import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logoImg from '../assets/logo.png';
import './Navbar.css';



const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const location = useLocation();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';
  const isSolid = isScrolled || !isHome;

  return (
    <header className={`navbar ${isSolid ? 'scrolled' : 'transparent'}`}>
      <div className="nav-container">
        <Link to="/" className="brand-logo">
          <img src={logoImg} alt="JBN Cakes Logo" />
          <span className="brand-name">JBN Cakes</span>
        </Link>

        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/cakes" className={location.pathname === '/cakes' ? 'active' : ''}>Our Cakes</Link>
          <Link to="/order" className={location.pathname === '/order' ? 'active' : ''}>
            Order Now
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </nav>

        <div className="nav-actions">
          <a href="https://instagram.com/jbnca_kes" target="_blank" rel="noopener noreferrer" className="social-icon">
            <InstagramIcon />
          </a>
          <Link to="/order" className="cart-icon">
            <ShoppingBag size={24} />
            {cartCount > 0 && <span className="cart-badge-sm">{cartCount}</span>}
          </Link>
          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
