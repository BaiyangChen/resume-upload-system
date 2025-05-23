import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statusOptions = ['Pending', 'Interviewing', 'Regret', 'Selected'];
const token = localStorage.getItem('token');

function HrDashboard() {
  const [resumes, setResumes] = useState([]);
  console.log('TOKEN:', token);
  console.log('ROLE:', localStorage.getItem('role'));
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

  return (
    <div>
      <h2>HR Dashboard</h2>
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
          {resumes.map((r) => (
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