# 末铃点名 · 桌面单机恐怖逃生（开发中）
虚构的昭川中学里，晚自习已经结束，广播仍在点名。探索教室、档案室与广播室，寻找离校方法，避开仍在巡查的值班人。

![桌面实机运行截图](docs/desktop.png)

主要交付是离线运行的桌面软件。当前处于开发阶段，尚未完成完整体验和发布验收，也未达到目标的高品质美术音频标准。20—30分钟是设计目标，不是已测游玩时长。

## 本机运行
本地0.3.0开发快照位于 `release/mac-arm64/末铃点名.app`，可双击启动，不需要Node。`release/`里已有arm64开发版ZIP及DMG，但它们可能落后于源码，暂不作为正式发行包。应用未经开发者签名与苹果公证。

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
[下载 v0.2.0 开发预览（GitHub Release）](https://github.com/Tomhao10225101490/midnight-rollcall/releases/tag/v0.2.0)。桌面包内置运行时，可离线运行，无需安装Node。M系列Mac选arm64；Intel Mac选x64；Windows可选安装版或便携版；Linux可选tar.gz或AppImage。

这批包对应提交d3e2941。当前源码0.3.0包含新的设备模型、分步提示及跨教室线索链，正在构建新预览，尚未包含在0.2.0下载包内。全部9个包的远端大小与SHA256已逐个匹配，详见[产物清单](docs/ARTIFACTS-0.2.0.md)。应用没有开发者签名/苹果公证，安装方法见[安装说明](docs/INSTALL.md)。

| 平台 | 0.2.0构建 | 试玩范围 |
|---|---|---|
| macOS arm64 | DMG、应用ZIP | 本机打包应用完整键盘通关；CI下载应用启动及输入验证 |
| macOS x64 | DMG、应用ZIP | 构建通过、未实机试玩 |
| Windows x64 | 安装EXE、便携EXE | 构建通过、未实机试玩 |
| Linux x64 | AppImage、tar.gz | 构建通过、未实机试玩 |
| Web | 静态ZIP | Chrome基础操作测试，未整局试玩 |

[源码仓库](https://github.com/Tomhao10225101490/midnight-rollcall)。网页试玩未部署。

## 原创与许可
原创代码MIT。几何、标牌、材质纹理和合成音乐由项目代码生成；不使用下载模型、音频或字体。中文语音只尝试本机离线系统声音，无声音时保留提示音与文字信息。第三方软件保持各自许可，详见THIRD_PARTY_NOTICES.md。

## English Quick Start
Offline desktop game under development. Run `npm ci`, `node node_modules/electron/install.js`, then `npm run desktop`. `npm test` runs logic tests; `npm run test:desktop` tests Electron. A playable development preview is available on GitHub Releases; final quality acceptance is still pending.
