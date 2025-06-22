
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSearch, FaBars } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (search.trim().length > 0) {
      fetch(`http://localhost:5000/api/menu?search=${search}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.slice(0, 5));
        });
    } else {
      setSuggestions([]);
    }
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/menu?search=${search}`);
      setSuggestions([]);
    }
  };

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeDropdown);
    return () => {
      document.removeEventListener('mousedown', closeDropdown);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">TastyBites</Link>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(prev => !prev)}>
        <FaBars />
      </div>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li className={isActive('/menu') ? 'active' : ''}><Link to="/menu">MENU</Link></li>
        <li className={isActive('/about') ? 'active' : ''}><Link to="/about">ABOUT</Link></li>

        {user ? (
          <>
            <li><Link to="/book">BOOK TABLE</Link></li>
            <li ref={dropdownRef} className="dropdown">
              <button className="dropbtn" onClick={toggleDropdown}>
                MY ACCOUNT ▾
              </button>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/order-history" onClick={() => setDropdownOpen(false)}>Order History</Link>
                  <Link to="/booking-details" onClick={() => setDropdownOpen(false)}>Bookings</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)}>Admin Dashboard</Link>
                  )}
                  <Link to="/contact" onClick={() => setDropdownOpen(false)}>Contact Us</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </li>
          </>
        ) : (
          <>
            <li className={isActive('/login') ? 'active' : ''}><Link to="/login">LOGIN</Link></li>
            <li className={isActive('/register') ? 'active' : ''}><Link to="/register">REGISTER</Link></li>
          </>
        )}
      </ul>

      <div className="navbar-icons">
        <Link to={user ? "/profile" : "/login"}>
          <FaUser />
        </Link>
        <Link to="/cart">
          <FaShoppingCart />
        </Link>
      <div className={`navbar-search-wrapper ${searchExpanded ? 'expanded' : ''}`}>
      <form
       onSubmit={handleSearch}
       className={`navbar-search ${searchExpanded ? 'expanded' : ''}`}
       onFocus={() => setSearchExpanded(true)}
       onBlur={() => setTimeout(() => setSearchExpanded(false), 200)}
     >
    <input
      type="text"
      placeholder="Search menu..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <button type="submit">
      <FaSearch />
    </button>
    {suggestions.length > 0 && (
      <ul className="search-suggestions">
        {suggestions.map((item, idx) => (
          <li key={idx} onClick={() => {
            setSearch(item.name);
            navigate(`/menu?search=${item.name}`);
            setSuggestions([]);
          }}>
            {item.name}
          </li>
        ))}
      </ul>
    )}
  </form>
</div>

      </div>
    </nav>
  );
}

export default Navbar;

