import fs from 'node:fs/promises';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  try {
    const dataPath = path.resolve(process.cwd(), '../data.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const db = JSON.parse(rawData);
    
    const orders = db.orders || [];
    
    return {
      success: true,
      data: orders
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});
