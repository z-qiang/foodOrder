import fs from 'node:fs/promises';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username, password } = body;

    const dataPath = path.resolve(process.cwd(), '../data.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const db = JSON.parse(rawData);
    
    db.users = db.users || [];
    
    const user = db.users.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      // In a real app we'd generate a JWT, but for this demo we'll return the user info and rely on the client to store a cookie.
      return {
        success: true,
        data: { 
          username: user.username,
          nickName: user.nickName || user.username // Fallback to username for legacy records
        }
      };
    } else {
      return { success: false, error: '用户名或密码不正确' };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});
