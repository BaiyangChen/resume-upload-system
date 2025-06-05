// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      alert('Login Success');
      window.location.href = res.data.role === 'hr' ? '/hr' : '/upload';
    } catch (err) {
      alert(err.response?.data?.msg || 'Login Fail');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <form onSubmit={handleLogin} style={{
        padding: '40px',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: '300px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box'
          }}/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box'
          }}/>
        <button type="submit" style={{
          width: '100%',
          padding: '10px',
          borderRadius: '4px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>Login</button>
      </form>
    </div>
  );
}

export default Login;