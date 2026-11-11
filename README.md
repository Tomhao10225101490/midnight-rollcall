# 末铃点名 · 桌面单机恐怖逃生（开发中）
虚构的昭川中学里，晚自习已经结束，广播仍在点名。探索教室、档案室与广播室，寻找离校方法，避开仍在巡查的值班人。

![桌面实机运行截图](docs/desktop.png)

主要交付是离线运行的桌面软件。当前为可玩开发预览，主流程已通过通关与发布验证；整体美术、音频和首次体验时长仍未达到最终验收。20—30分钟是设计目标，不是已测游玩时长。

## 本机运行
本机应用位于 `release/mac-arm64/末铃点名.app`，版本0.3.0，可双击启动，不需要Node。公开发布包请从下方Release下载，应用未经开发者签名与苹果公证。

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
npm run test:settings
npm run test:hints
npm run build
npm run dist:ci
```
`npm run test:traverse`通过实际键盘操作走路线，只读观察游戏状态，不使用瞬移、无敌或道具注入。以实际输出为准，不等同于人工主观体验验收。

`npm run dev`可在本机4173端口运行辅助浏览器构建。最终用户无需打开浏览器。

## 操作
WASD移动、鼠标观察、Shift奔跑、Ctrl潜行、E互动、H在储物柜旁躲藏、J查看记录和逐级提示、Esc暂停。奔跑制造声音并提高纪律值；安静行动逐步降低。铃响期间出口开放十二秒。关键进度自动存档，设置保存到本机。

恐怖追逐，无血腥，无镜头晃动或刻意闪烁。请先调低音量；出现晕动不适时暂停。

## 验证与下载
[下载 v0.3.0 开发预览（GitHub Release）](https://github.com/Tomhao10225101490/midnight-rollcall/releases/tag/v0.3.0)。桌面包内置运行时，可离线运行，无需安装Node。M系列Mac选arm64；Intel Mac选x64；Windows可选安装版或便携版；Linux可选tar.gz或AppImage。

这批包对应修复后的提交c69d775，包含新设备模型、角色动作、原创音效、跨教室线索、分类笔记、视野与画面设置。全部9个包已检查内部入口/资源/版本，远端大小与SHA256逐个匹配，详见[产物清单](docs/ARTIFACTS-0.3.0.md)。安装方法见[安装说明](docs/INSTALL.md)。

| 平台 | 0.3.0构建 | 试玩范围 |
|---|---|---|
| macOS arm64 | DMG、应用ZIP | 本机修复版应用完整通关；公开下载ZIP启动与DMG挂载通过 |
| macOS x64 | DMG、应用ZIP | 构建通过、未实机试玩 |
| Windows x64 | 安装EXE、便携EXE | 构建通过、未实机试玩 |
| Linux x64 | AppImage、tar.gz | 构建通过、未实机试玩 |
| Web | 静态ZIP | Chrome基础运行、构建及入口检查；未整局试玩 |

[源码仓库](https://github.com/Tomhao10225101490/midnight-rollcall)。网页试玩未部署。

## 原创与许可
原创代码MIT。几何、标牌、材质纹理和合成音乐由项目代码生成；不使用下载模型、音频或字体。中文语音只尝试本机离线系统声音，无声音时保留提示音与文字信息。第三方软件保持各自许可，详见THIRD_PARTY_NOTICES.md。

## English Quick Start
Offline desktop game under development. Run `npm ci`, `node node_modules/electron/install.js`, then `npm run desktop`. `npm test` runs logic tests; `npm run test:desktop` tests Electron. A playable development preview is available on GitHub Releases; final quality acceptance is still pending.
