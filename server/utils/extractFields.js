
function extractFields(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    // 1. 姓名：第一行，/^[A-Za-z\s]+ = 只包含多个英文字母和空格，$=到行的结尾结束
    const name = lines.length > 0 ? lines[0].match(/^[A-Za-z\s]+$/) ? lines[0] : null : null;
  
    // 2. 邮箱：
    const emailMatch = text.match(/[a-zA-Z0-9._]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}/);
    //[a-zA-Z0-9._%+-]+ 多个所有英文字母数字点下横线；
    // @[a-zA-Z.-]+ 一个@和多个英文字母点下横线 
    //  \.[a-zA-Z]{2,}  点是一个特殊字符代表《任意字符》所以要用斜杠；这里的意思是点之后包含英文所有字符，两个以上
  
    // 3. 电话：格式 xxx-xxx-xxxx（例如 123-456-7890），中间可以是横岗或者点
    const phoneMatch = text.match(/\b\d{3}[-.]\d{3}[-.]\d{4}\b/);
  
    // 4. 技能：匹配 Skills 开头的段落，向后取300个英文字符（或遇到换行）
    const skillsMatch = text.match(/Skills?:?\s*([\s\S]{0,300})/i);
    //Skills?:? 后面的s和：都是可有可无
    //\s*  任意数量的空格
    //([\s\S]{0,80})  [\s\S]意味着所有字符都可以，取前80个字符
  
    // 5. 教育经历（Education 到 Experience/Projects）
    const eduMatch = text.match(/EDUCATION([\s\S]*?)(?=PROFESSIONAL EXPERIENCE|EXPERIENCE|PROJECTS|SKILLS|$)/i);
    // 6. 工作经历（Experience 到 Education/Projects）
    const expMatch = text.match(/(EXPERIENCE|PROFESSIONAL EXPERIENCE)([\s\S]*?)(?=EDUCATION|PROJECTS|SKILLS|$)/i);
    
    console.log("eduMatch:", eduMatch[1]);
    console.log("expMatch:", expMatch[2]);

    return {
      name: name ? name.trim() : null,
      email: emailMatch ? emailMatch[0].trim() : null,
      phone: phoneMatch ? phoneMatch[0].trim() : null,
      skills: skillsMatch ? skillsMatch[1].trim() : null,
      education: eduMatch ? eduMatch[1].trim() : null,
      experience: expMatch ? expMatch[2].trim() : null
    };
  }
  
  module.exports = extractFields;