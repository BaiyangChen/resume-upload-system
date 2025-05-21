// src/pages/Upload.jsx
import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
  
  const [file, setFile] = useState(null);
  const [parsedText, setParsedText] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
    if (role !== 'user') {
    return <h2>you are not applicant</h2>;
    }
  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.post('/api/resume/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', //表示请求中有文件，不是json
        }
      });
      setParsedText(res.data.content); //上传成功，后端会提取文字，然后返回给前端，把这些内容存在parsedText里
    } catch (err) {
      alert(err.response?.data?.msg || 'Upload Fail');
    }
  };

  const handleConfirm = async() => {
    try {
      await axios.post('/api/resume/save', {
        content: parsedText,
        filename: file.name
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      alert(' Resume Saved');
    } catch (err) {
      alert(err.response?.data?.msg || 'Saving Fail');
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={e => setFile(e.target.files[0])} accept=".pdf" required />
        <button type="submit">Upload</button>
      </form>

      {parsedText && (
        <div>
          <h3>Resume Detail</h3>
          <textarea value={parsedText} onChange={e => setParsedText(e.target.value)} rows="20" cols="80" />
          <br />
          <button onClick={handleConfirm}>Confirm and Save</button>
        </div>
      )}
    </div>
  );
}

export default Upload;