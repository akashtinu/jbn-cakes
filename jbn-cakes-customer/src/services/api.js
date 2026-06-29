import axiosLib from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

const sampleCakes = [
  { id: 1, name: 'Rich Chocolate Truffle', description: 'Dark chocolate ganache with moist chocolate sponge.', price: 850, category: 'Chocolate', imageUrl: 'chocolate_cake_1782630905028.png', available: true },
  { id: 2, name: 'Classic Red Velvet', description: 'Smooth cream cheese frosting on a vibrant red velvet sponge.', price: 950, category: 'Premium', imageUrl: 'red_velvet_cake_1782630916346.png', available: true },
  { id: 3, name: 'Authentic Black Forest', description: 'Layers of chocolate sponge, whipped cream, and cherries.', price: 750, category: 'Classic', imageUrl: 'black_forest_cake_1782630928776.png', available: true },
  { id: 4, name: 'Elegant Vanilla Buttercream', description: 'Classic vanilla cake with floral buttercream design.', price: 600, category: 'Classic', imageUrl: 'vanilla_cake_1782630940808.png', available: true },
  { id: 5, name: 'Fresh Strawberry Shortcake', description: 'Light sponge layered with fresh strawberries and cream.', price: 900, category: 'Fruit', imageUrl: 'strawberry_cake_1782630952634.png', available: true },
];

export const getImageUrl = (filename) => {
  if (!filename) return '/images/logo.png';
  // Fallback to local images if backend is not reachable for the images
  return `${API_BASE}/cakes/images/${filename}`;
};

export const getCakes = async () => {
  try {
    const res = await axiosLib.get(`${API_BASE}/cakes?available=true`);
    return res.data.length > 0 ? res.data : sampleCakes;
  } catch (error) {
    console.log('Backend unreachable, using sample data');
    return sampleCakes;
  }
};

export const placeOrder = async (orderData, photoFile) => {
  try {
    if (photoFile) {
      // Send as multipart/form-data
      const formData = new FormData();
      formData.append('order', JSON.stringify(orderData));
      formData.append('photo', photoFile);
      const res = await axiosLib.post(`${API_BASE}/orders`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } else {
      const res = await axiosLib.post(`${API_BASE}/orders`, orderData);
      return res.data;
    }
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

export const getReferencePhotoUrl = (filename) => {
  if (!filename) return null;
  return `${API_BASE}/orders/images/${filename}`;
};
