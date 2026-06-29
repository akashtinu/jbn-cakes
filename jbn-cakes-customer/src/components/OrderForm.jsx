import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder, getImageUrl } from '../services/api';
import { CheckCircle, Trash2, Plus, Minus, Upload, X, Image } from 'lucide-react';
import './OrderForm.css';

const OrderForm = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: ''
  });
  const [referencePhoto, setReferencePhoto] = useState(null);   // File object
  const [photoPreview, setPhotoPreview] = useState(null);       // Data URL for preview
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const formatWeight = (qty) => {
    const grams = qty * 250;
    return grams >= 1000 ? `${grams / 1000}kg` : `${grams}g`;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReferencePhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setReferencePhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: formData.name,
        customerPhone: formData.phone,
        notes: formData.notes,
        totalAmount: getCartTotal(),
        items: cartItems.map(item => ({
          cake: { id: item.cakeId },
          quantity: 1,
          price: item.price * item.quantity,
          weight: formatWeight(item.quantity)
        }))
      };

      await placeOrder(orderData, referencePhoto);
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="empty-cart animate-fade-in-up">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any delicious cakes yet!</p>
        <button className="btn-primary mt-4" onClick={() => navigate('/cakes')}>
          Browse Cakes
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="order-success animate-fade-in-up">
        <CheckCircle size={80} color="#33D69F" />
        <h2>Order Confirmed!</h2>
        <p>Thank you, {formData.name}. Your order has been placed successfully.</p>
        <p>We will contact you shortly at {formData.phone} for delivery details.</p>
        <button className="btn-primary mt-4" onClick={() => navigate('/')}>
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="order-form-container glass-card animate-fade-in-up">
      <div className="step-indicator">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Cart</div>
        <div className="step-line"></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Details</div>
        <div className="step-line"></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Confirm</div>
      </div>

      <div className="form-steps">
        {step === 1 && (
          <div className="step-content slide-in">
            <h3>Review Your Cart</h3>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={getImageUrl(item.imageUrl)} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-price">₹{item.price * 2} <span className="price-label">per 500g</span></p>
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16}/></button>
                    <span className="weight-display">{formatWeight(item.quantity)}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16}/></button>
                  </div>
                  <div className="item-total">₹{item.price * item.quantity}</div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div className="total-row">
                <span>Total Amount:</span>
                <span className="total-price">₹{getCartTotal()}</span>
              </div>
              <button className="btn-primary next-btn" onClick={() => setStep(2)}>
                Proceed to Details
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content slide-in">
            <h3>Delivery Details</h3>
            <form className="details-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Special Instructions</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="2" placeholder="E.g. Message on cake, flavour preference"></textarea>
              </div>

              {/* ── Reference Photo ─────────────────────────────────── */}
              <div className="form-group">
                <label>Reference Photo / Cake Model <span className="label-optional">(Optional)</span></label>
                <p className="field-hint">Upload a photo of the cake design or model you'd like us to follow.</p>

                {!photoPreview ? (
                  <div
                    className="photo-upload-zone"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Upload size={32} className="upload-icon" />
                    <span>Click to choose photo</span>
                    <span className="upload-hint">JPG, PNG, WEBP up to 10MB</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handlePhotoChange}
                    />
                  </div>
                ) : (
                  <div className="photo-preview-box">
                    <img src={photoPreview} alt="Reference" className="photo-preview-img" />
                    <div className="photo-preview-info">
                      <Image size={16} />
                      <span>{referencePhoto?.name}</span>
                      <button type="button" className="remove-photo-btn" onClick={removePhoto}>
                        <X size={16} /> Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* ────────────────────────────────────────────────────── */}

              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={() => setStep(1)}>Back</button>
                <button type="button" className="btn-primary"
                  disabled={!formData.name || !formData.phone}
                  onClick={() => setStep(3)}>
                  Review Order
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="step-content slide-in">
            <h3>Confirm Your Order</h3>
            <div className="order-summary">
              <div className="summary-section">
                <h4>Items</h4>
                {cartItems.map(item => (
                  <div key={item.id} className="summary-row">
                    <span>{item.name} ({formatWeight(item.quantity)})</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="summary-total">
                  <strong>Total to Pay</strong>
                  <strong>₹{getCartTotal()}</strong>
                </div>
              </div>

              <div className="summary-section">
                <h4>Customer Details</h4>
                <p><strong>{formData.name}</strong> — {formData.phone}</p>
                {formData.notes && <p><em>Note: {formData.notes}</em></p>}
              </div>

              {photoPreview && (
                <div className="summary-section">
                  <h4>Reference Photo</h4>
                  <img src={photoPreview} alt="Reference" className="summary-photo-preview" />
                </div>
              )}
            </div>

            <div className="form-actions mt-4">
              <button type="button" className="btn-outline" onClick={() => setStep(2)}>Back</button>
              <button type="button" className="btn-primary" onClick={submitOrder} disabled={isSubmitting}>
                {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
