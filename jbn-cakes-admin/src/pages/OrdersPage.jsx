import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../services/api';
import { getReferencePhotoUrl } from '../services/api';
import { CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      // Sort by date descending
      data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      // Optimistic update
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      await updateOrderStatus(id, status);
    } catch (error) {
      alert("Failed to update status");
      fetchOrders(); // Revert on failure
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerPhone.includes(searchTerm) ||
    order.id.toString().includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'DELIVERED': return <span className="badge badge-success"><CheckCircle size={14}/> Delivered</span>;
      case 'CANCELLED': return <span className="badge badge-danger"><XCircle size={14}/> Cancelled</span>;
      default: return <span className="badge badge-warning"><Clock size={14}/> Pending</span>;
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <div className="page-header-actions">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by ID, Name or Phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items & Weight</th>
                <th>Reference Photo</th>
                <th>Special Instructions</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                  <td>
                    <div className="customer-info">
                      <strong>{order.customerName}</strong>
                      <span className="text-sm text-muted">{order.customerPhone}</span>
                    </div>
                  </td>
                  <td>
                    <ul className="item-list">
                      {order.items.map(item => (
                        <li key={item.id || item.cake.name}>
                          <span>{item.cake.name}</span>
                          {item.weight && <span className="weight-tag">{item.weight}</span>}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {order.referencePhotoPath
                      ? (
                        <a href={getReferencePhotoUrl(order.referencePhotoPath)} target="_blank" rel="noreferrer" title="View full image">
                          <img
                            src={getReferencePhotoUrl(order.referencePhotoPath)}
                            alt="Reference"
                            className="ref-photo-thumb"
                          />
                        </a>
                      )
                      : <span className="text-muted">—</span>}
                  </td>
                  <td>
                    {order.notes
                      ? <span className="notes-text">{order.notes}</span>
                      : <span className="text-muted">—</span>}
                  </td>
                  <td className="font-bold">₹{order.totalAmount}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    {order.status === 'PENDING' && (
                      <div className="action-buttons">
                        <button 
                          className="btn-success-sm" 
                          onClick={() => handleStatusChange(order.id, 'DELIVERED')}
                          title="Mark Delivered"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          className="btn-danger-sm" 
                          onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                          title="Cancel Order"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="10" className="text-center py-4">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
