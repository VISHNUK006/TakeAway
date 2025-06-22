
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './EditProfile.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function EditProfile() {
  const { token, user, loginUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: '' });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/auth/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (image) {
        const imgData = new FormData();
        imgData.append('image', image);

        await axios.post(`${API_BASE_URL}/api/auth/upload`, imgData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      loginUser(res.data.user, token);
      setMsg('✅ Profile updated successfully!');
      navigate('/profile'); 
    } catch (err) {
      console.error(err);
      setMsg('❌ ' + (err.response?.data?.message || 'Update failed.'));
    }
  };

  return (
    <div className="e-container">
      <div className="editprofile-container">
        <h2>Edit Profile</h2>
        <form className="edit-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="New Password (optional)" value={formData.password} onChange={handleChange} />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button type="submit">Save Changes</button>
          {msg && <p>{msg}</p>}
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
