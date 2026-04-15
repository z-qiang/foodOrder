import fs from 'node:fs/promises';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    if (!id) {
      return { success: false, error: '缺少订单 ID' };
    }

    const dataPath = path.resolve(process.cwd(), '../data.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const db = JSON.parse(rawData);
    
    if (!db.orders) {
      return { success: false, error: '订单数据不存在' };
    }

    const orderIndex = db.orders.findIndex(o => o.orderId === id);
    if (orderIndex === -1) {
      return { success: false, error: '订单不存在' };
    }

    // Remove the order
    db.orders.splice(orderIndex, 1);
    
    await fs.writeFile(dataPath, JSON.stringify(db, null, 2), 'utf-8');
    
    return {
      success: true,
      message: '订单删除成功'
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});
