import fs from 'node:fs/promises';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    if (!formData) {
      throw createError({ statusCode: 400, message: '缺少文件数据' });
    }

    const file = formData.find((item) => item.name === 'file');
    if (!file || !file.data) {
      throw createError({ statusCode: 400, message: '未找到上传的文件' });
    }

    // 基础验证
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (file.type && !allowedTypes.includes(file.type)) {
      throw createError({ statusCode: 400, message: '不支持的文件类型，请上传图片 (JPG, PNG, WEBP)' });
    }

    // 生成文件名
    const originalName = file.filename || 'image.jpg';
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const filename = `dish_${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`;
    
    // 持久化存储目录：与 data.json 同级的 uploads 目录
    const uploadDir = path.resolve(process.cwd(), '../uploads');
    
    // 确保目录存在
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);

    // 写入文件
    await fs.writeFile(filePath, file.data);

    // 返回通过 API 路由访问的 URL（兼容 baseURL 配置）
    const config = useRuntimeConfig();
    const baseURL = config.app.baseURL || '/';

    return {
      success: true,
      url: `${baseURL}api/uploads/${filename}`
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || '上传失败'
    };
  }
});
