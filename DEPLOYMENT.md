# FlyBack SG 部署说明

这份文档用于把 FlyBack SG 上传到 GitHub，并部署到 Vercel。

## 1. 本地准备

确认本地已安装 Node.js 18 或以上版本。

```bash
node --version
npm --version
```

安装依赖并本地构建：

```bash
npm install
npm run build
```

如果构建成功，可以本地预览：

```bash
npm run preview
```

## 2. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env.local
```

填入 Supabase 配置：

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

注意：`.env.local` 不要提交到 GitHub。

## 3. 上传到 GitHub

在项目根目录初始化 Git 仓库：

```bash
git init
git add .
git commit -m "chore: prepare FlyBack SG demo"
```

在 GitHub 创建一个新仓库，例如：

```text
flyback-sg
```

然后关联远程仓库并推送：

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/flyback-sg.git
git push -u origin main
```

## 4. 部署到 Vercel

1. 打开 Vercel Dashboard。
2. 点击 Add New Project。
3. 选择 GitHub 中的 `flyback-sg` 仓库。
4. Framework Preset 选择 `Vite`。
5. Build Command 使用：

```bash
npm run build
```

6. Output Directory 使用：

```bash
build
```

7. 在 Environment Variables 中添加：

```bash
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

8. 点击 Deploy。

## 5. 部署后检查

部署成功后，建议检查：

- 首页是否能打开
- 搜索目的地后是否出现航班列表
- 筛选和排序是否可用
- 低价地图页 `/#/explore` 是否可访问
- 航班详情弹窗是否能打开
- 降价提醒输入框是否有交互反馈

## 6. 常见问题

### 页面刷新后 404

当前项目使用 `HashRouter`，URL 形态是 `/#/explore`，通常不会出现普通 SPA 刷新 404。如果后续改成 `BrowserRouter`，需要额外配置 Vercel rewrites。

### Supabase 数据加载失败

先检查 Vercel 环境变量是否配置正确。当前 demo 保留了 fallback 配置，即使远程数据失败，也会回退到 mock 数据用于展示。

### Output Directory 不匹配

当前 `vite.config.js` 将构建输出目录设置为 `build`，因此 Vercel 的 Output Directory 应填写 `build`，不是 Vite 默认的 `dist`。
