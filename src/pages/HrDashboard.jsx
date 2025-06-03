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
      alert(err.response?.data?.msg | 'Status Update Fail');
    }
  };
  const filteredResumes = resumes.filter(r =>
    r.name?.includes(searchName) &&
    (filterStatus === '' || r.status === filterStatus)
  );

  return (
    <div>
      <h2>HR Dashboard</h2>
      {/* 筛选表单 */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {/* 这是简历表格 */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Education</th>
            <th>Experience</th>
            <th>Skills</th>
            <th>Status</th>
            <th>Change Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredResumes.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.phone}</td>
              <td>{r.education}</td>
              <td>{r.experience}</td>
              <td>{r.skills}</td>
              <td>{r.status}</td>
              <td>
                <select value={r.status} onChange={e => handleStatusChange(r.id, e.target.value)}>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HrDashboard;