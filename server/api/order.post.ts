import fs from 'node:fs/promises';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const dataPath = path.resolve(process.cwd(), '../data.json');
    
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const db = JSON.parse(rawData);
    
    // 生成订单及状态
    const newOrder = {
      orderId: 'TIG' + Date.now() + Math.floor(Math.random() * 1000),
      timestamp: Date.now(),
      items: body.items,
      totalAmount: body.totalAmount,
      status: 'PAY_SUCCESS'
    };
    
    db.orders = db.orders || [];
    db.orders.unshift(newOrder); // 最新上的订单在上
    
    // 写入 JSON 存盘
    await fs.writeFile(dataPath, JSON.stringify(db, null, 2), 'utf-8');
    
    return {
      success: true,
      data: newOrder
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});
