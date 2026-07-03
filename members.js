// Vercel Serverless Function
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // 环境变量
const REPO_OWNER = '你的GitHub用户名';
const REPO_NAME = '仓库名';
const FILE_PATH = 'data/members.json';

// 统一请求 GitHub API
async function callGitHubAPI(method, content, sha) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
  const body = {
    message: '更新成员数据',
    content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64')
  };
  if (sha) body.sha = sha; // 更新文件需要 sha

  const res = await fetch(url, {
    method: method,
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

export default async function handler(req, res) {
  // 设置 CORS（允许前端跨域请求）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. 先获取文件当前内容和 sha
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const response = await fetch(url, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const fileData = await response.json();
    const currentSha = fileData.sha;
    
    let members;
    // 解码 base64 内容
    if (fileData.content) {
      members = JSON.parse(
        Buffer.from(fileData.content, 'base64').toString('utf-8')
      );
    } else {
      members = [];
    }

    // 2. 根据请求方法处理数据
    if (req.method === 'GET') {
      // 直接返回成员列表
      return res.status(200).json(members);
    }
    else if (req.method === 'POST') {
      // 添加新成员
      const newMember = req.body;
      const maxId = members.reduce((max, m) => Math.max(max, m.id), 0);
      newMember.id = maxId + 1;
      members.push(newMember);
      await callGitHubAPI('PUT', members, currentSha);
      return res.status(200).json({ success: true, member: newMember });
    }
    else if (req.method === 'DELETE') {
      // 删除成员：需要从 query 传入 id
      const id = parseInt(req.query.id);
      const filtered = members.filter(m => m.id !== id);
      if (filtered.length === members.length) {
        return res.status(404).json({ success: false, message: '成员不存在' });
      }
      await callGitHubAPI('PUT', filtered, currentSha);
      return res.status(200).json({ success: true });
    }
    // 可以加上 PUT 方法用于编辑成员

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '操作失败' });
  }
}