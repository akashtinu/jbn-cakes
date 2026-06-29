import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import CakeCard from '../components/CakeCard';
import { getCakes } from '../services/api';
import './Home.css';

const Home = () => {
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const cakes = await getCakes();
        setFeaturedCakes(cakes.slice(0, 6)); // First 6 cakes
      } catch (error) {
        console.error("Failed to fetch cakes", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCakes();
  }, []);

  return (
    <div className="home-page">
      <Hero />
      
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Our Signature Creations</h2>
          
          {loading ? (
            <div className="cakes-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cakes-grid">
              {featuredCakes.map((cake, index) => (
                <CakeCard key={cake.id} cake={cake} delay={index * 100} />
              ))}
            </div>
          )}
          
          <div className="view-all-container">
            <Link to="/cakes" className="btn-outline view-all-btn">
              View All Cakes
            </Link>
          </div>
        </div>
      </section>
      
      <section className="about-section">
        <div className="container about-grid">
          <div className="about-content animate-fade-in-up">
            <h2>The JBN Cakes Experience</h2>
            <p>Every cake we bake tells a story of passion, quality, and celebration. Using only the finest ingredients sourced globally, our master bakers craft confections that not only look spectacular but taste divine.</p>
            <p>Whether it's a grand wedding or a quiet birthday, make it unforgettable with JBN Cakes.</p>
          </div>
          <div className="about-image animate-fade-in-up delay-200">
            <div className="glass-card image-wrapper">
              <img src="/images/chocolate_cake_1782630905028.png" alt="Baker decorating cake" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
