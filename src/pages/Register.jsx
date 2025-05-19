import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; //用于注册成功后跳转页面

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 默认是求职者
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { email, password, role });
      alert('Register Success, please login');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || 'Register fail');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registration</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="user">Job Seeker</option>
        <option value="hr">Recruiter</option>
      </select>
      <button type="submit">Signup</button>
    </form>
  );
}

export default Register;