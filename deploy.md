# Windows Server 部署指南 - 美味点餐系统

本指南将指导您如何将本项目部署到 Windows Server 环境中。

## 1. 准备工作

在服务器上，请确保已安装以下软件：
- **Node.js (LTS 版本)**：[下载地址](https://nodejs.org/)
- **PM2**：通过 npm 全局安装
  ```bash
  npm install pm2 -g
  ```

## 2. 编译项目 (在开发机或服务器上)

在项目根目录下执行编译命令：
```bash
npm install
npm run build
```
执行完毕后，项目根目录下会生成一个 `.output` 文件夹。这是生产环境运行所需的全部内容（包含独立的服务端和静态资源）。

## 3. 部署文件

将以下文件/文件夹复制到服务器上的部署目录：
- `.output/` (整个文件夹)
- `ecosystem.config.cjs` (PM2 配置文件)
- `data.json` (数据库文件，建议放在与 `.output` 平级的目录，或根据您的 API 引用途径存放)

**注意**：根据代码中的引用 `path.resolve(process.cwd(), '../data.json')`，在生产环境中运行时，`data.json` 应该放在 `.output` 文件夹的**上一级目录**（即您的部署根目录）。

## 4. 启动项目

在服务器的部署根目录下，打开 PowerShell 或 CMD，运行：
```bash
pm2 start ecosystem.config.cjs
```

### 常用 PM2 命令：
- **查看运行状态**：`pm2 list`
- **查看日志**：`pm2 logs meituan-h5`
- **重启服务**：`pm2 restart meituan-h5`
- **停止服务**：`pm2 stop meituan-h5`

## 5. 配置开机自启 (可选)

在 Windows 上，PM2 默认不会开机自启。建议安装 `pm2-windows-startup`：
```bash
npm install pm2-windows-startup -g
pm2-startup install
pm2 save
```

## 6. 访问服务

默认情况下，项目运行在 `http://localhost:3000`。
- 如果您只需要内网访问，直接访问服务器 IP 即可（需开放 3000 端口）。
- 如果需要域名访问，建议使用 **IIS (配合 Application Request Routing)** 或 **Nginx** 作为反向代理。

### IIS 反向代理简要步骤：
1. 安装 "URL Rewrite" 和 "Application Request Routing (ARR)" 模块。
2. 在 IIS 中启用 ARR 的 Proxy 功能。
3. 在您的网站下添加一个“入站规则”，将所有请求重写到 `http://localhost:3000/{R:0}`。

---

> [!IMPORTANT]
> **关于 data.json 的位置**：
> 生产环境运行 `node .output/server/index.mjs` 时，`process.cwd()` 通常是项目的根目录。请确保 `data.json` 的路径在 API 运行期间是可访问的。
