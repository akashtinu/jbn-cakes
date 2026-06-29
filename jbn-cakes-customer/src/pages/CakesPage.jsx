import React, { useEffect, useState } from 'react';
import CakeCard from '../components/CakeCard';
import { getCakes } from '../services/api';
import './CakesPage.css';

const CakesPage = () => {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCakes = async () => {
      try {
        const data = await getCakes();
        setCakes(data);
      } catch (error) {
        console.error("Failed to fetch cakes", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCakes();
  }, []);

  const categories = ['All', ...new Set(cakes.map(cake => cake.category))];
  
  const filteredCakes = activeTab === 'All' 
    ? cakes 
    : cakes.filter(cake => cake.category === activeTab);

  return (
    <div className="cakes-page">
      <div className="page-header">
        <h1>Our Collection</h1>
        <p>Discover our wide range of delicious handcrafted cakes</p>
      </div>

      <div className="container">
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category}
              className={`tab-btn ${activeTab === category ? 'active' : ''}`}
              onClick={() => setActiveTab(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="cakes-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img"></div>
                <div className="skeleton-text"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cakes-grid">
            {filteredCakes.length > 0 ? (
              filteredCakes.map((cake, index) => (
                <CakeCard key={cake.id} cake={cake} delay={index * 50} />
              ))
            ) : (
              <div className="no-cakes">No cakes found in this category.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CakesPage;
