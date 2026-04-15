import fs from 'node:fs/promises';
import path from 'node:path';

// MIME type 映射
const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

export default defineEventHandler(async (event) => {
  const filePath = getRouterParam(event, 'path');
  
  if (!filePath) {
    throw createError({ statusCode: 400, message: '缺少文件路径' });
  }

  // 安全检查：防止路径穿越攻击
  const sanitizedPath = path.basename(filePath);
  if (sanitizedPath !== filePath) {
    throw createError({ statusCode: 400, message: '非法文件路径' });
  }

  const uploadDir = path.resolve(process.cwd(), '../uploads');
  const fullPath = path.join(uploadDir, sanitizedPath);

  try {
    // 检查文件是否存在
    await fs.access(fullPath);
    
    // 读取文件
    const fileData = await fs.readFile(fullPath);
    
    // 获取 MIME 类型
    const ext = path.extname(sanitizedPath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // 设置响应头
    setResponseHeaders(event, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400', // 缓存 1 天
      'Content-Length': fileData.length.toString(),
    });

    return fileData;
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      throw createError({ statusCode: 404, message: '文件不存在' });
    }
    throw createError({ statusCode: 500, message: '读取文件失败' });
  }
});
