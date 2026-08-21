# 匿名用户行为统计

项目使用 PostHog Cloud EU 查看事件、转化漏斗和留存。统计是可选功能：没有配置项目 Key 时完全关闭；配置后也只在用户明确同意后发送手动定义的事件。

## 在哪里看

1. 登录 [PostHog EU](https://eu.posthog.com/)，进入 HolaDone 项目。
2. 用 `Activity` 查看刚收到的单条事件及属性，适合验证接入。
3. 用 `Product Analytics` → `New insight` → `Funnel` 查看漏斗。
4. 用 `Product Analytics` → `New insight` → `Retention` 查看次日、7 日回访。

建议的第一个漏斗：

```text
app_opened
  → practice_started
  → practice_input_started
  → practice_round_completed
```

主要激活口径是 `practice_round_completed`，并筛选 `mode = recall` 或 `mode = listen`。这比“打开了页面”更接近用户完成了一轮独立回忆或听写。留存可先设为“首次完成 `practice_round_completed` 的浏览器，之后是否再次完成同一事件”。

## 接入步骤

1. 在 PostHog 创建 EU 项目，复制 `Project token`（通常以 `phc_` 开头，不是 Personal API key）。这个项目 token 本来就会发给浏览器，不要放管理员或 Personal API key。
2. 在本地 `.env.local` 或 Vercel 项目环境变量中配置：

```text
VITE_POSTHOG_KEY=phc_xxx
VITE_POSTHOG_HOST=https://eu.i.posthog.com
```

3. 在 PostHog 项目隐私设置中启用 `Discard IP data`。
4. 重新构建或部署。首次打开会看到统计选择；允许后完成一轮练习，再到 PostHog `Activity` 核对事件。

如果不配置 `VITE_POSTHOG_KEY`，页面不显示统计选择，PostHog SDK 不会初始化，也不会发送统计请求。

## 事件字典

| 事件 | 触发时机 | 主要用途 |
| --- | --- | --- |
| `app_opened` | 每次启动 | 访问、回访基数 |
| `practice_started` | 新开或恢复一轮 | 启动转化 |
| `practice_input_started` | 进入本次练习后首次输入 | 排除只打开未开始 |
| `onboarding_checkpoint_completed` | 新用户完成前 3 项 | 首次体验转化 |
| `practice_round_completed` | 完成预热或完整轮次 | 激活、表现、留存 |
| `practice_exited` | 中途回首页 | 放弃位置和轮次长度 |
| `challenge_saved` | 创建或调整挑战 | 目标功能使用 |
| `install_result` | 触发添加主屏幕 | PWA 安装意愿 |
| `sync_enabled` | 成功创建或连接同步 | 跨设备需求 |

事件只有等级、模式、轮次项目数、耗时和错误数等枚举或数值属性。代码明确关闭自动点击、页面自动采集、录屏、热力图、性能和异常采集，并移除完整 URL、来源页和营销参数。

## 为什么不用 Firebase

Firebase Analytics 也能完成基础事件采集，但主要分析界面会进入 Google Analytics 4，自定义漏斗要在 Explore 中配置。当前项目没有使用 Firebase Auth、Firestore 或 Crashlytics，PostHog 直接提供事件、漏斗和留存界面，所以接入更小、后台也更直接。如果未来项目主体迁到 Firebase 生态，再重新评估也不迟。
