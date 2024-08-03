import React, { useState } from 'react';
import axios from 'axios';
import './adminLogin.css'; // Import the CSS file
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from '../../Components/AxiosRequest';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if email and password are provided
    if (!email || !password) {
      toast.error('Please provide both email and password');
      return;
    }

    try {
      const response = await AxiosRequest.post('/admin/login', { email, password });
      if (response.data.status === 'ok') {
        toast.success('Login successful');
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('token', response.data.token);
      console.log('Token',response.data.token)
        localStorage.removeItem('isOwner');
        localStorage.removeItem('isClient');
        window.location.replace('/admin-dashboard');
      }
    } 
      catch (error) {
        if (!toast.isActive("errorToast")) {
          toast.error(error.response.data.error, { toastId: "errorToast" });
        }
  
      }
  };

  const toastStyle = {
    container: "max-w-sm mx-auto",
    toast: "bg-red-500 text-white font-bold",
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
