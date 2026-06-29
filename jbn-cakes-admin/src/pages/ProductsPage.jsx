import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, deleteProduct, getProductImageUrl } from '../services/api';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append('cake', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      await addProduct(data);
      setShowModal(false);
      setFormData({ name: '', description: '', price: '', category: '', available: true });
      setImageFile(null);
      fetchProducts();
    } catch (error) {
      alert("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className="products-page">
      <div className="page-header-actions">
        <button className="btn-primary flex-center" onClick={() => setShowModal(true)}>
          <Plus size={18} style={{marginRight: '8px'}} /> Add Product
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name & Desc</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? products.map(product => (
                  <tr key={product.id}>
                    <td>
                      {product.imageUrl ? (
                        <img 
                          src={getProductImageUrl(product.imageUrl)} 
                          alt={product.name} 
                          className="product-img"
                          onError={(e) => {e.target.onerror = null; e.target.src = '/images/logo.png'}}
                        />
                      ) : (
                        <div className="no-image"><ImageIcon size={24} color="#ccc" /></div>
                      )}
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                      <p className="text-sm text-muted description-clamp">{product.description}</p>
                    </td>
                    <td>{product.category}</td>
                    <td className="font-bold">₹{product.price}</td>
                    <td>
                      <span className={`badge ${product.available ? 'badge-success' : 'badge-danger'}`}>
                        {product.available ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-danger-sm" onClick={() => handleDelete(product.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-control" rows="2"></textarea>
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>Price (₹)</label>
                  <input type="number" name="price" required value={formData.price} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="form-group half">
                  <label>Category</label>
                  <input type="text" name="category" required value={formData.category} onChange={handleInputChange} className="form-control" />
                </div>
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="available" checked={formData.available} onChange={handleInputChange} />
                  Available in Stock
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
