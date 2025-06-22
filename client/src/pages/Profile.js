
import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Profile.css';
import defaultAvatar from '../assets/default-avatar.png'; 
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function Profile() {
const { token, logoutUser } = useContext(AuthContext);
const [user, setUser] = useState(null);
const [error, setError] = useState('');
const navigate = useNavigate();

useEffect(() => {
const fetchProfile = async () => {
try {
const res = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
headers: { Authorization: `Bearer ${token}` },
});
setUser(res.data);
} catch (err) {
setError('❌ Failed to fetch profile. Please login again.');
console.error(err);
}
};

if (token) fetchProfile();
else setError('You are not logged in.');
}, [token,]);

const handleLogout = () => {
logoutUser();
navigate('/');
};

const handleEditProfile = () => {
window.location.href = '/edit-profile';
};

return (
  <>
    <Navbar />
<div className="container">
<div className="profile-container">
<h2>User Profile</h2>
{error && <p style={{ color: 'red' }}>{error}</p>}
{!user ? (
<p>Loading profile...</p>
) : (
<div className="profile-card">
<div className="profile-image">
<img
  src={user.profilePicture ? `${API_BASE_URL}${user.profilePicture}` : defaultAvatar}
  alt="Profile"
/>
</div>
<p><strong>Name:</strong> {user.name}</p>
<p><strong>Email:</strong> {user.email}</p>
<p><strong>Role:</strong> {user.role}</p>
<button className="logout-btn" onClick={handleEditProfile}>Edit</button>
<button className="logout-btn" onClick={handleLogout}>Logout</button>
</div>
)}
</div>
</div>
</>
);
}

export default Profile;