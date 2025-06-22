
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AdminHeader from '../components/AdminHeader';
import './AdminMenu.css';
import { API_BASE_URL } from '../config';

function AdminMenu() {
  const { token } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchMenu = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/menu?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenuItems(res.data);
    } catch (err) {
      console.error('Error fetching menu:', err);
    }
  }, [search, token]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      setForm({ ...form, image: file });
      setPreviewUrl(file ? URL.createObjectURL(file) : null);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('description', form.description);
    formData.append('category', form.category);
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/admin/menu/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setMsg('✅ Item updated!');
      } else {
        await axios.post(`${API_BASE_URL}/api/admin/menu`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setMsg('✅ Item added!');
      }

      setForm({ name: '', price: '', description: '', category: '', image: null });
      setEditingId(null);
      setPreviewUrl(null);
      fetchMenu();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Error'));
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category || '',
      image: null,
    });
    setEditingId(item._id);
    setPreviewUrl(item.image ? `${API_BASE_URL}${item.image}` : null);
    setMsg('');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMenu();
    } catch (err) {
      alert('❌ Delete failed');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', price: '', description: '', category: '', image: null });
    setPreviewUrl(null);
    setMsg('');
  };

  return (
    <>
      <AdminHeader />
      <div className="admin-container">
        <h2>Manage Menu</h2>

        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />

        <form onSubmit={handleSubmit} className="add-form" encType="multipart/form-data">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Category (e.g. Starters)"
            value={form.category}
            onChange={handleChange}
          />
          <input type="file" name="image" onChange={handleChange} accept="image/*" />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              width="120"
              style={{ marginTop: '10px', borderRadius: '8px' }}
            />
          )}

          <button type="submit">{editingId ? 'Update Item' : 'Add Item'}</button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="cancel-btn">
              Cancel
            </button>
          )}
          {msg && <p className={`msg ${msg.startsWith('✅') ? 'success' : 'error'}`}>{msg}</p>}
        </form>

        <ul className="menu-list">
          {menuItems.length === 0 ? (
            <p>No items found.</p>
          ) : (
            menuItems.map((item) => (
              <li key={item._id}>
                <strong>{item.name}</strong> - ₹{item.price}
                <p>{item.description}</p>
                {item.image && (
                  <img
                    src={`${API_BASE_URL}${item.image}`}
                    alt={item.name}
                    width="100"
                  />
                )}
                <div className="btn-group">
                  <button onClick={() => handleEdit(item)} classname="edit-button">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}

export default AdminMenu;
