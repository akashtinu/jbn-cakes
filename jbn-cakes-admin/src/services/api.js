import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

const sampleOrders = [
  {
    id: 101,
    customerName: 'John Doe',
    customerPhone: '1234567890',
    customerEmail: 'john@example.com',
    customerAddress: '123 Main St, NY',
    status: 'PENDING',
    totalAmount: 1700,
    orderDate: new Date().toISOString(),
    items: [
      { cake: { id: 1, name: 'Rich Chocolate Truffle' }, quantity: 2, price: 850 }
    ]
  },
  {
    id: 102,
    customerName: 'Jane Smith',
    customerPhone: '9876543210',
    customerEmail: 'jane@example.com',
    customerAddress: '456 Elm St, CA',
    status: 'DELIVERED',
    totalAmount: 950,
    orderDate: new Date(Date.now() - 86400000).toISOString(),
    items: [
      { cake: { id: 2, name: 'Classic Red Velvet' }, quantity: 1, price: 950 }
    ]
  }
];

export const getOrders = async () => {
  try {
    const res = await axios.get(`${API_BASE}/orders`);
    return res.data.length > 0 ? res.data : sampleOrders;
  } catch (error) {
    console.error('Failed to fetch orders, using sample data');
    return sampleOrders;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const res = await axios.put(`${API_BASE}/orders/${id}/status?status=${status}`);
    return res.data;
  } catch (error) {
    console.error('Failed to update order status', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE}/cakes`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch products');
    return [];
  }
};

export const addProduct = async (formData) => {
  try {
    const res = await axios.post(`${API_BASE}/cakes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_BASE}/cakes/${id}`);
  } catch (error) {
    console.error('Failed to delete product', error);
    throw error;
  }
};

export const getReferencePhotoUrl = (filename) => {
  if (!filename) return null;
  return `${API_BASE}/orders/images/${filename}`;
};
