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
    const { id } = body;

    if (!id) {
      return { success: false, error: '缺少菜品 ID' };
    }

    const dataPath = path.resolve(process.cwd(), '../data.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const db = JSON.parse(rawData);

    db.dishes = db.dishes || [];
    const dishIndex = db.dishes.findIndex((d: any) => d.id === Number(id));

    if (dishIndex === -1) {
      return { success: false, error: '菜品不存在' };
    }

    const dish = db.dishes[dishIndex];

    // 如果图片为本地上传文件 → 删除文件
    if (dish.image && isLocalUpload(dish.image)) {
      const filename = extractFilename(dish.image);
      const uploadDir = path.resolve(process.cwd(), '../uploads');
      const filePath = path.join(uploadDir, filename);
      try {
        await fs.unlink(filePath);
        console.log(`[dish.delete] 已删除图片文件: ${filename}`);
      } catch (e: any) {
        // 文件不存在时静默跳过，不影响菜品删除
        if (e.code !== 'ENOENT') {
          console.warn(`[dish.delete] 删除图片文件失败: ${e.message}`);
        }
      }
    }

    // 从数组中移除菜品
    db.dishes.splice(dishIndex, 1);

    await fs.writeFile(dataPath, JSON.stringify(db, null, 2), 'utf-8');

    return {
      success: true,
      message: '菜品删除成功'
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});
