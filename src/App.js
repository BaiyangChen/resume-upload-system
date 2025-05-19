// src/App.js
import React, { useEffect, useState }from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Upload from './pages/Upload';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // 监听 token 变化（登录后刷新）
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* 如果有 token 就进入上传页，否则跳转登录 */}
        <Route path="/upload" element={token ? <Upload /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;