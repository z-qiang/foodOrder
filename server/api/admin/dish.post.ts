import fs from 'node:fs/promises';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, categoryId, price, image, desc, stock } = body;

    if (!name || !categoryId || !price) {
      return { success: false, error: '缺少必填字段' };
    }

    const dataPath = path.resolve(process.cwd(), '../data.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const db = JSON.parse(rawData);
    
    db.dishes = db.dishes || [];
    
    const newDish = {
      id: Date.now() % 1000000, // simple pseudo ID
      categoryId: Number(categoryId),
      name,
      price: Number(price),
      image: image || 'https://picsum.photos/200',
      desc: desc || '',
      stock: Number(stock) || 100
    };
    
    db.dishes.push(newDish);
    
    await fs.writeFile(dataPath, JSON.stringify(db, null, 2), 'utf-8');
    
    return {
      success: true,
      data: newDish
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});
