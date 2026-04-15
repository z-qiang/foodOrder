import fs from 'node:fs/promises';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username, nickName, password } = body;

    if (!username) {
      return { success: false, error: 'Missing username' };
    }

    const dataPath = path.resolve(process.cwd(), '../data.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const db = JSON.parse(rawData);
    
    const userIndex = (db.users || []).findIndex((u: any) => u.username === username);
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }
    
    // Update fields if provided
    if (nickName) db.users[userIndex].nickName = nickName;
    if (password) db.users[userIndex].password = password;
    
    await fs.writeFile(dataPath, JSON.stringify(db, null, 2), 'utf-8');
    
    return {
      success: true,
      data: {
        username: db.users[userIndex].username,
        nickName: db.users[userIndex].nickName
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});
