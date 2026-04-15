import fs from 'node:fs/promises';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username, password } = body;

    if (!username || !password) {
      return { success: false, error: '用户名或密码不能为空' };
    }

    const dataPath = path.resolve(process.cwd(), '../data.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const db = JSON.parse(rawData);
    
    db.users = db.users || [];
    
    const exist = db.users.find((u: any) => u.username === username);
    if (exist) {
      return { success: false, error: '用户名已存在' };
    }

    const newUser = {
      username,
      password,
      createdAt: Date.now(),
      nickName: body.nickName || username // Default to username if not provided
    };
    
    db.users.push(newUser);
    
    await fs.writeFile(dataPath, JSON.stringify(db, null, 2), 'utf-8');
    
    return {
      success: true,
      data: { 
        username: newUser.username,
        nickName: newUser.nickName
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});
