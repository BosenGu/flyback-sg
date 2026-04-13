# FlyBack SG

FlyBack SG 是一个面向新加坡留学生的低价机票发现与出行协同 demo。项目围绕“出行决策、信息聚合、社交协同”三个方向，帮助学生快速发现从 Singapore Changi Airport (SIN) 出发的回国航线、比较价格趋势，并为后续同航班沟通、落地拼车等轻社交功能预留产品空间。

## 核心功能

- 首页展示新加坡出发的低价回国航班
- 支持目的地、价格、航司、出发时间等基础筛选
- 航班卡片展示价格趋势、行李额度、航司与航班时间
- 航班详情弹窗聚合不同 OTA 渠道价格
- 低价地图页展示热门回国目的地与起步价
- 降价提醒与心愿单入口作为后续转化功能雏形
- 生态圈页面支持按学校、方向和航班筛选拼车帖
- 同航班聊天室 demo 支持本地发送消息与刷新保留

## 目标用户

主要面向在新加坡留学、实习或短期交流的中国学生，典型场景包括假期回国、临时回国、毕业返程，以及和同学一起拼车去机场或落地后回家的出行协同。

## 产品亮点

- 聚焦新加坡留学生，而不是泛旅游用户
- 将低价发现、行李政策、学生优惠和回国目的地探索放在同一个决策流里
- 保留同航班沟通、拼车匹配、学生认证优惠等后续扩展空间
- Demo 以可视化卡片和轻量交互为主，适合面试和作品集展示
- 航班和订票平台采用真实感静态数据，价格用于 demo 展示，不代表实时票价

## 技术栈

- React 18
- Vite 5
- React Router
- Tailwind CSS
- shadcn/ui + Radix UI
- Framer Motion
- Lucide React
- Supabase JavaScript Client

## 本地运行

建议使用 Node.js 18。当前仓库带有 `.nvmrc`，可以通过 nvm 切换版本。

```bash
nvm use
npm install
npm run dev
```

默认开发服务器由 Vite 启动。当前 `vite.config.js` 中配置的端口是 `8080`。

## 环境变量

Supabase 配置是可选项。未配置时，页面会使用静态 mock 数据，适合作品集 demo 展示；如果后续接入真实数据库，可以复制 `.env.example` 为 `.env.local` 并填入：

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

不要把 `.env.local` 提交到 GitHub。当前代码不会在仓库中内置 no-code 平台的 fallback 地址或 token。

## 项目结构

```text
src/
  components/
    flights/           # 航班卡片、筛选、预订弹窗、同航班聊天
    search/            # 搜索框与目的地选择
    ui/                # shadcn/ui 基础组件
  data/                # 航班、订票平台、生态圈 mock 数据
  integrations/        # Supabase client
  lib/                 # 通用工具函数
  pages/               # 页面级组件
supabase/
  migrations/          # no-code 导出时附带的数据库迁移文件
```

## Demo 数据说明

当前版本不在前端实时爬虫，也不调用付费航班搜索 API。航司、航线、订票平台和价格区间使用真实感静态 mock 数据，适合展示产品逻辑和交互。实际购票前仍需以航司官网或订票平台为准。

同航班聊天和生态圈拼车帖子为前端 demo 功能，新增内容会写入浏览器 `localStorage`：

```text
flyback-sg-community-posts
flyback-sg-flight-messages
```

## 部署

项目适合部署到 Vercel。基础流程：

1. 将仓库上传到 GitHub。
2. 在 Vercel 导入该 GitHub 仓库。
3. Framework Preset 选择 Vite。
4. Build Command 使用 `npm run build`。
5. Output Directory 使用 `build`。
6. 如需连接真实 Supabase，在 Vercel Environment Variables 中配置 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`；仅展示 mock demo 时可以先不配置。

仓库已提供 `vercel.json`，Vercel 导入时会自动使用 `npm run build` 和 `build` 输出目录。

更完整的步骤见 [DEPLOYMENT.md](./DEPLOYMENT.md)。

## 后续规划

- 将 Supabase 查询逻辑进一步收敛到 `services/`
- 增加同航班同学沟通入口
- 增加落地拼车匹配流程
- 增加学生认证优惠说明和真实 OTA 跳转
- 增加移动端细节优化与基础测试
- 清理 no-code 平台遗留依赖和未使用组件
