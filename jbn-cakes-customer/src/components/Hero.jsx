import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="overlay"></div>
      </div>
      <div className="hero-content">
        <h1 className="animate-fade-in-up">Welcome to JBN Cakes</h1>
        <p className="animate-fade-in-up delay-100">Handcrafted with love, baked to perfection</p>
        <div className="animate-fade-in-up delay-200 mt-8">
          <Link to="/cakes" className="btn-primary hero-btn">Explore Our Cakes</Link>
        </div>
      </div>
      <div className="floating-elements">
        <div className="float-1"></div>
        <div className="float-2"></div>
        <div className="float-3"></div>
      </div>
    </section>
  );
};

export default Hero;
