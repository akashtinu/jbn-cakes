import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../services/api';
import './CakeCard.css';

const CakeCard = ({ cake, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) observer.observe(cardRef.current);
    
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  const handleAddToCart = () => {
    addToCart(cake);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div 
      ref={cardRef} 
      className={`cake-card glass-card ${isVisible ? 'animate-fade-in-up' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="cake-image-container">
        <img src={getImageUrl(cake.imageUrl)} alt={cake.name} loading="lazy" />
        <span className="category-badge">{cake.category}</span>
      </div>
      <div className="cake-info">
        <h3>{cake.name}</h3>
        <p>{cake.description}</p>
        
        <div className="cake-footer">
          <div className="price-container">
            <span className="price">₹{cake.price}</span>
            <span className="price-unit">for 500g</span>
            <span className="price-base">(Min. Weight)</span>
          </div>
          <button 
            onClick={handleAddToCart} 
            className={`btn-primary add-btn ${added ? 'added' : ''}`}
            disabled={!cake.available}
          >
            {added ? 'Added!' : (cake.available ? 'Add to Cart' : 'Sold Out')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CakeCard;
