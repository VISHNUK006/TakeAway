
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Checkout.css';
import { API_BASE_URL } from '../config';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState('');
  const [paymentMode, setPaymentMode] = useState('COD');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => {
  const loadGoogleMaps = async () => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  };

  loadGoogleMaps();
}, []);

const initMap = () => {
  const mapContainer = document.getElementById('map');
  if (!mapContainer || !window.google) {
    console.error('Map container or Google Maps not available.');
    return;
  }

  const defaultPosition = { lat: 20.5937, lng: 78.9629 };

  const map = new window.google.maps.Map(mapContainer, {
    center: defaultPosition,
    zoom: 5,
  });

  const marker = new window.google.maps.Marker({
    position: defaultPosition,
    map,
    draggable: true,
    title: 'Drag me to your location',
  });

  setCoordinates(defaultPosition);

  marker.addListener('dragend', function () {
    const pos = marker.getPosition();
    setCoordinates({ lat: pos.lat(), lng: pos.lng() });
  });
};


  const handlePlaceOrder = async (mode = 'COD', status = 'Pending') => {
    if (!address.trim()) {
      toast.error('Please enter your address');
      return;
    }

    const confirmPayment = window.confirm(
      `Total amount ₹${getTotal()}. Do you want to proceed?`
    );
    if (!confirmPayment) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: cartItems.map(({ _id, qty }) => ({
            menuItem: _id,
            qty,
          })),
          total: getTotal(),
          address,
          location: 'Home Delivery',
          paymentMode: mode,
          paymentStatus: status,
          coordinates,
        }),
      });

      if (response.ok) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/order-history');
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
    }
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleRazorpay = async () => {
    const res = await loadRazorpayScript();
    if (!res) return toast.error('Razorpay SDK failed to load');

    try {
      const receiptId = 'receipt_' + Date.now();

      const orderRes = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getTotal(),
          receipt: receiptId,
        }),
      });

      const data = await orderRes.json();

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'TakeAway',
        description: 'Food Order Payment',
        order_id: data.id,
        handler: async function (response) {
          const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: data.amount / 100,
              receipt: data.receipt,
            }),
          });

          const result = await verifyRes.json();

          if (result.success) {
            toast.success('✅ Payment verified!');
            await handlePlaceOrder('ONLINE', 'Paid');
          } else {
            toast.error('❌ Payment verification failed.');
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
        },
        theme: {
          color: '#ffcc00',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Failed to initiate payment.');
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <label htmlFor="address">Delivery Address:</label>
      <textarea
        id="address"
        placeholder="Enter your full address..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <div style={{ height: '300px', marginBottom: '15px' }}>
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
      </div>
      <p style={{ fontSize: '14px', color: '#aaa' }}>
        📍 Selected Location: {coordinates.lat?.toFixed(4)}, {coordinates.lng?.toFixed(4)}
      </p>

      <label htmlFor="payment">Select Payment Mode:</label>
      <select
        id="payment"
        value={paymentMode}
        onChange={(e) => setPaymentMode(e.target.value)}
      >
        <option value="COD">Cash on Delivery</option>
        <option value="ONLINE">Pay Online</option>
      </select>

      <div className="checkout-total">Total: ₹{getTotal()}</div>

      {paymentMode === 'ONLINE' ? (
        <button onClick={handleRazorpay}>Pay with Razorpay</button>
      ) : (
        <button onClick={() => handlePlaceOrder('COD', 'Pending')}>Place Order</button>
      )}
    </div>
  );
}

export default Checkout;
