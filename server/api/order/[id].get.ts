import fs from 'node:fs/promises';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    if (!id) {
      return { success: false, error: 'Missing order ID' };
    }

    const dataPath = path.resolve(process.cwd(), '../data.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const db = JSON.parse(rawData);
    
    const order = (db.orders || []).find((o: any) => o.orderId === id);
    
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    
    return {
      success: true,
      data: order
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});
