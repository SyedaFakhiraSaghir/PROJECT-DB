import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';

const Profile = () => {
  const userId = 1; // Assuming user is logged in and has a userId (Replace with actual dynamic ID)

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    phone_number: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updatedPhone, setUpdatedPhone] = useState('');

  // Fetch user profile from backend
  useEffect(() => {
    axios.get(`http://localhost:9000/profile/${userId}`)
      .then(response => {
        setProfile(response.data);  // Assuming the profile data returned from the backend is directly the user object
        setUpdatedPhone(response.data.phone_number);
      })
      .catch(error => {
        console.error("Error fetching profile:", error);
      });
  }, [userId]);

  // Handle form submission for editing profile
  const handleUpdateProfile = (e) => {
    e.preventDefault();

    if (updatedPhone === profile.phone_number) {
      alert("No changes made to the phone number.");
      setIsEditing(false);
      return;
    }

    // Sending PUT request to update profile
    axios.put(`http://localhost:9000/profile/${userId}`, {
      name: profile.name,
      email: profile.email,
      age: profile.age,
      phone_number: updatedPhone
    })
      .then(response => {
        setProfile(prevState => ({
          ...prevState,
          phone_number: updatedPhone
        }));
        setIsEditing(false);
        alert("Profile updated successfully!");
      })
      .catch(error => {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
      });
  };

  return (
    <>
      <div class="header">
        <a href="#default" class="logo">RAAS</a>
        <div class="header-right">
          <a class="active" href="http://localhost:3000/home">Home</a>
        </div>
      </div>
      <h2>User Profile</h2>
      <form onSubmit={handleUpdateProfile}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={profile.name}
            disabled={!isEditing}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={profile.email}
            disabled={!isEditing}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            value={profile.age}
            disabled={!isEditing}
            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            value={updatedPhone}
            disabled={!isEditing}
            onChange={(e) => setUpdatedPhone(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          {isEditing && (
            <button type="submit">
              Save Changes
            </button>
          )}
        </div>
      </form>
      </>
  );
};

export default Profile;
