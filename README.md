# 末铃点名 · 桌面单机恐怖逃生（开发中）
虚构的昭川中学里，晚自习已经结束，广播仍在点名。探索教室、档案室与广播室，寻找离校方法，避开仍在巡查的值班人。

主要交付是离线运行的桌面软件。当前处于开发阶段，尚未完成完整体验和发布验收，也未达到目标的高品质美术音频标准。20—30分钟是设计目标，不是已测游玩时长。

## 本机运行
本地开发快照位于 `release/末铃点名.app`，可双击启动，不需要Node。`release/`里已有arm64开发版ZIP及DMG，但它们可能落后于源码，暂不作为正式发行包。应用未经开发者签名与苹果公证。

## 源码开发
Node.js 22及以上。首次安装：
```sh
npm ci
node node_modules/electron/install.js
npm run desktop
```
检查与构建：
```sh
npm run typecheck
npm test
npm run test:desktop
npm run test:traverse
npm run build
npm run dist:ci
```
`npm run test:traverse`通过实际键盘操作走路线，只读观察游戏状态，不使用瞬移、无敌或道具注入。以实际输出为准，不等同于人工主观体验验收。

`npm run dev`可在本机4173端口运行辅助浏览器构建。最终用户无需打开浏览器。

## 操作
WASD移动、鼠标观察、Shift奔跑、Ctrl潜行、E互动、H在储物柜旁躲藏、Esc暂停。奔跑制造声音并提高纪律值；安静行动逐步降低。铃响期间出口开放十二秒。关键进度自动存档，设置保存到本机。

恐怖追逐，无血腥，无镜头晃动或刻意闪烁。请先调低音量；出现晕动不适时暂停。

## 验证与下载
macOS arm64已实际启动并通过基础桌面操作自动测试。Windows、Linux、Intel macOS尚未构建或实机验证。源码仓库：[Tomhao10225101490/midnight-rollcall](https://github.com/Tomhao10225101490/midnight-rollcall)。Release与网页试玩尚未发布，因此没有正式下载链接。

## 原创与许可
原创代码MIT。几何、标牌、材质纹理和合成音乐由项目代码生成；不使用下载模型、音频或字体。中文语音只尝试本机离线系统声音，无声音时保留提示音与文字信息。第三方软件保持各自许可，详见THIRD_PARTY_NOTICES.md。

## English Quick Start
Offline desktop game under development. Run `npm ci`, `node node_modules/electron/install.js`, then `npm run desktop`. `npm test` runs logic tests; `npm run test:desktop` tests Electron. No production release or full quality acceptance yet.
