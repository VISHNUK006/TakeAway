
import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Navbar from '../components/Navbar';
import './Menu.css';
import { API_BASE_URL } from '../config';

function Menu() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search')?.toLowerCase() || '';

  const [grouped, setGrouped] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/menu`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Menu Items:", data); 
        const groupedData = data.reduce((acc, item) => {
          const category = item.category || 'Uncategorized';
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        }, {});
        setGrouped(groupedData);
      })
      .catch((err) => console.error('Error fetching menu:', err));
  }, []);

  const handleAddToCart = (item) => {
    const { _id, name, price, image } = item;
    if (!_id || _id.length !== 24) {
      alert('Invalid menu item cannot be added to cart.');
      return;
    }
    addToCart({ _id, name, price, image, qty: 1 });
  };

  const categoryList = ['All', ...Object.keys(grouped)];

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="menu-container">
          <h2>Our Menu</h2>

          <div className="category-tabs">
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'active' : ''}
              >
                {cat}
              </button>
            ))}
          </div>

          {Object.entries(grouped).map(([category, items]) => (
            <div
              key={category}
              style={{
                display:
                  selectedCategory === 'All' || selectedCategory === category
                    ? 'block'
                    : 'none',
              }}
            >
              <div className="menu-grid">
                {items
                  .filter((item) =>
                    item.name.toLowerCase().includes(searchQuery)
                  )
                  .map((item) => (
                    <div className="menu-card" key={item._id}>
                      {item.image ? (
                        <img
                          src={`${API_BASE_URL}${item.image}`}
                          alt={item.name}
                          className="menu-image"
                        />
                      ) : (
                        <div className="menu-placeholder">No Image</div>
                      )}
                      <h3>{item.name}</h3>
                      <p>₹{item.price}</p>
                      <button onClick={() => handleAddToCart(item)}>
                        Add to Cart
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Menu;

