import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role === 'hr') {
      navigate('/hr'); // HR 去 HR 页面
    } else {
      navigate('/upload'); // 求职者去上传页面
    }
  }, [role, navigate]);

  return <div>Loading ...</div>;
}

export default Dashboard;