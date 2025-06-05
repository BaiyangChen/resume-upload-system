import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statusOptions = ['Pending', 'Interviewing', 'Regret', 'Selected'];
const token = localStorage.getItem('token');

function HrDashboard() {
  const [resumes, setResumes] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await axios.get('/api/resume/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumes(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Resumes Fetching Fail');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/resume/status/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumes(prev =>
        prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      alert(err.response?.data?.msg || 'Status Update Fail');
    }
  };
  const filteredResumes = resumes.filter(r =>
    r.name?.includes(searchName) &&
    (filterStatus === '' || r.status === filterStatus)
  );

  return (
    <div style={{ padding: '40px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>HR Dashboard</h2>
      
      {/* 筛选表单 */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '200px'
          }}
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '150px'
          }}
        >
          <option value="">All Status</option>
          {statusOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

        
      {/* 简历表格 */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', backgroundColor: 'white', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#4CAF50', color: 'white' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Phone</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Education</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Experience</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Skills</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Change Status</th>
            </tr>
            </thead>
          <tbody>
            {filteredResumes.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{r.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{r.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{r.phone}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', whiteSpace: 'pre-line' }}>
                  {r.education?.replace(/^{|}$/g, '').split(',').map((edu, idx) => (
                    <div key={idx}>- {edu.replace(/"/g, '').trim()}</div>
                  ))}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{r.experience}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', whiteSpace: 'pre-line' }}>
                  {r.skills?.replace(/^{|}$/g, '').split(',').map((skill, idx) => (
                    <div key={idx}>- {skill.replace(/"/g, '').trim()}</div>
                  ))}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{r.status}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <select
                    value={r.status}
                    onChange={e => handleStatusChange(r.id, e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px' }}
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HrDashboard;