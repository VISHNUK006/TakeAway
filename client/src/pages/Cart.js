
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Cart.css';
import { API_BASE_URL } from '../config';

function Cart() {
  const { cartItems, removeFromCart, updateQty } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    const allValid = cartItems.every(item => item._id && item._id.length === 24);
    if (!allValid) {
      toast.error('Cart contains invalid items. Please remove them before checkout.');
      return;
    }

    if (!isLoggedIn) {
      toast.warning('You must be logged in to proceed to checkout.');
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item._id);
    toast.info(`${item.name} removed from cart.`);
  };

  return (
    <>
    <Navbar />
    <div className="container">
      <div className="cart-container">
        <h2>Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty. <Link to="/menu">Browse our menu</Link></p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                {item.image ? (
                        <img
                          src={`${API_BASE_URL}${item.image}`}
                          alt={item.name}
                          className="menu-image"
                        />
                      ) : (
                        <div className="menu-placeholder">No Image</div>
                      )}
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Price: ₹{item.price}</p>
                </div>
                <div className="cart-item-controls">
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) =>
                      updateQty(item._id, parseInt(e.target.value))
                    }
                  />
                  <button onClick={() => handleRemoveItem(item)}>Remove</button>
                </div>
              </div>
            ))}

            <div className="cart-summary">
              <h3>Total:₹{getTotal()}</h3>
              <button onClick={handleCheckout}>Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}

export default Cart;

