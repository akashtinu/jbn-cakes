import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ShoppingCart, Cake, LogOut, Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.png';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
    { path: '/products', icon: <Cake size={20} />, label: 'Products' }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar overlay for mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={logoImg} alt="JBN Cakes Logo" className="logo" onError={(e) => e.target.style.display='none'} />
          <h2>JBN Admin</h2>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <button className="nav-item logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="page-title">
              <h1>{navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}</h1>
            </div>
          </div>
          <div className="admin-profile">
            <div className="avatar">A</div>
            <span>Admin</span>
          </div>
        </header>
        
        <div className="content-wrapper animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
