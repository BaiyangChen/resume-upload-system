// src/pages/Upload.jsx
import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
  
  const [file, setFile] = useState(null);
  const [parsedText, setParsedText] = useState('');
  const [fields, setFields] = useState({
    name: '', email: '', phone: '', education: '', experience: '', skills:''
  });
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
      const extracted = await extractFieldsWithLLM(res.data.content);
      setFields(extracted);
    } catch (err) {
      alert(err.response?.data?.msg || 'Upload Fail');
    }
  };

  const handleConfirm = async() => {
    try {
      await axios.post('/api/resume/save', {
        content: parsedText,
        filename: file.name,
        ...fields
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      alert('Resume Saved');
    } catch (err) {
      alert(err.response?.data?.msg || 'Saving Fail');
    }
  };

  // function extractFieldsFromText(text) {
  //   const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  //   // 1. 姓名：第一行，/^[A-Za-z\s]+ = 只包含多个英文字母和空格，$=到行的结尾结束
  //   const name = lines.length > 0 ? lines[0].match(/^[A-Za-z\s]+$/) ? lines[0] : null : null;
  
  //   // 2. 邮箱：
  //   const emailMatch = text.match(/[a-zA-Z0-9._]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}/);
  //   //[a-zA-Z0-9._%+-]+ 多个所有英文字母数字点下横线；
  //   // @[a-zA-Z.-]+ 一个@和多个英文字母点下横线 
  //   //  \.[a-zA-Z]{2,}  点是一个特殊字符代表《任意字符》所以要用斜杠；这里的意思是点之后包含英文所有字符，两个以上
  
  //   // 3. 电话：格式 xxx-xxx-xxxx（例如 123-456-7890），中间可以是横岗或者点
  //   const phoneMatch = text.match(/\b\d{3}[-.]\d{3}[-.]\d{4}\b/);
  
  //   // 4. 技能：匹配 Skills 开头的段落，向后取300个英文字符（或遇到换行）
  //   const skillsMatch = text.match(/Skills?:?\s*([\s\S]{0,300})/i);
  //   //Skills?:? 后面的s和：都是可有可无
  //   //\s*  任意数量的空格
  //   //([\s\S]{0,80})  [\s\S]意味着所有字符都可以，取前80个字符
  
  //   // 5. 教育经历（Education 到 Experience/Projects）
  //   const eduMatch = text.match(/EDUCATION([\s\S]*?)(?=PROFESSIONAL EXPERIENCE|EXPERIENCE|PROJECTS|SKILLS|$)/i);
  //   // 6. 工作经历（Experience 到 Education/Projects）
  //   const expMatch = text.match(/(EXPERIENCE|PROFESSIONAL EXPERIENCE)([\s\S]*?)(?=EDUCATION|PROJECTS|SKILLS|$)/i);
  
  //   return {
  //     name: name ? name.trim() : null,
  //     email: emailMatch ? emailMatch[0].trim() : null,
  //     phone: phoneMatch ? phoneMatch[0].trim() : null,
  //     skills: skillsMatch ? skillsMatch[1].trim() : null,
  //     education: eduMatch ? eduMatch[1].trim() : null,
  //     experience: expMatch ? expMatch[2].trim() : null
  //   };
  // }

  const extractFieldsWithLLM = async (text) =>  {
    const res = await axios.post('/api/resume/extract', { text });
    console.log("模型返回：", res.data.result);
    try {
      const parsed = res.data.result;
      // education是数组，转成字符串展示
      const educationStr = Array.isArray(parsed.education)
      ? parsed.education.map(edu => `${edu.degree} at ${edu.school} (${edu.year})`).join('\n')
      : (parsed.education || '');
      // experience是数组，转成字符串展示
      const experienceStr = Array.isArray(parsed.workExperience)
      ? parsed.workExperience.map(exp => `${exp.jobTitle} at ${exp.company} (${exp.year})`).join('\n')
      : (parsed.workExperience || '');
      //技能是数组，用换行符分割
      const skillsStr = Array.isArray(parsed.skills) ? parsed.skills.join("\n") : (parsed.skills || '');
      return {
        name: parsed.name || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        education: educationStr,
        experience: experienceStr,
        skills: skillsStr
      };
    } catch (err) {
      alert(err.response?.data?.msg ||'模型返回格式错误！');
      return {};
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
    
        <label>Name:<input value={fields.name || ''} onChange={e => setFields({ ...fields, name: e.target.value })} /></label><br />
        <label>Email:<input value={fields.email || ''} onChange={e => setFields({ ...fields, email: e.target.value })} /></label><br />
        <label>Phone:<input value={fields.phone || ''} onChange={e => setFields({ ...fields, phone: e.target.value })} /></label><br />
    
        <label>Skills:<br />
          <textarea rows="4" cols="50" value={fields.skills || ''} onChange={e => setFields({ ...fields, skills: e.target.value })} />
        </label><br />
    
        <label>Education:<br />
          <textarea rows="4" cols="50" value={fields.education || ''} onChange={e => setFields({ ...fields, education: e.target.value })} />
        </label><br />
    
        <label>Experience:<br />
          <textarea rows="4" cols="50" value={fields.experience || ''} onChange={e => setFields({ ...fields, experience: e.target.value })} />
        </label><br />
    
        <button onClick={handleConfirm}>Confirm and Save</button>
      </div>
      )}
    </div>
  );
}

export default Upload;