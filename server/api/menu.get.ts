import fs from 'node:fs/promises';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  try {
    // 读取上层 order 目录的 data.json
    const dataPath = path.resolve(process.cwd(), '../data.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const db = JSON.parse(rawData);
    
    return {
      success: true,
      data: {
        categories: db.categories || [],
        dishes: db.dishes || []
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});
