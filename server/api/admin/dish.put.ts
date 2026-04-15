import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * 判断图片路径是否为本地上传文件
 */
function isLocalUpload(imageUrl: string): boolean {
  return !!imageUrl && imageUrl.includes('/api/uploads/');
}

/**
 * 从图片 URL 中提取文件名
 */
function extractFilename(imageUrl: string): string {
  const parts = imageUrl.split('/');
  return parts[parts.length - 1];
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, name, categoryId, price, image, desc, stock } = body;

    if (!id) {
      return { success: false, error: '缺少菜品 ID' };
    }
    if (!name || !categoryId || !price) {
      return { success: false, error: '缺少必填字段（名称、分类、价格）' };
    }

    const dataPath = path.resolve(process.cwd(), '../data.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const db = JSON.parse(rawData);

    db.dishes = db.dishes || [];
    const dishIndex = db.dishes.findIndex((d: any) => d.id === Number(id));

    if (dishIndex === -1) {
      return { success: false, error: '菜品不存在' };
    }

    const oldDish = db.dishes[dishIndex];

    // 如果图片被更换，且旧图片为本地上传文件 → 删除旧图片
    if (image && oldDish.image && image !== oldDish.image && isLocalUpload(oldDish.image)) {
      const oldFilename = extractFilename(oldDish.image);
      const uploadDir = path.resolve(process.cwd(), '../uploads');
      const oldFilePath = path.join(uploadDir, oldFilename);
      try {
        await fs.unlink(oldFilePath);
        console.log(`[dish.put] 已删除旧图片: ${oldFilename}`);
      } catch (e: any) {
        // 文件不存在则静默跳过
        if (e.code !== 'ENOENT') {
          console.warn(`[dish.put] 删除旧图片失败: ${e.message}`);
        }
      }
    }

    // 更新菜品字段
    db.dishes[dishIndex] = {
      ...oldDish,
      name,
      categoryId: Number(categoryId),
      price: Number(price),
      image: image || oldDish.image,
      desc: desc !== undefined ? desc : oldDish.desc,
      stock: stock !== undefined ? Number(stock) : oldDish.stock
    };

    await fs.writeFile(dataPath, JSON.stringify(db, null, 2), 'utf-8');

    return {
      success: true,
      data: db.dishes[dishIndex]
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});
