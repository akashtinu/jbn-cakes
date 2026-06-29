import React, { useEffect } from 'react';
import OrderForm from '../components/OrderForm';

const OrderPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="order-page" style={{ paddingTop: '100px', minHeight: 'calc(100vh - 300px)', paddingBottom: '6rem', backgroundColor: 'var(--bg-warm)' }}>
      <div className="container">
        <h1 className="section-title">Complete Your Order</h1>
        <OrderForm />
      </div>
    </div>
  );
};

export default OrderPage;
