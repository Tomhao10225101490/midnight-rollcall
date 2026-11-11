# 末铃点名 · 桌面单机恐怖逃生（开发中）

虚构的昭川中学里，晚自习已经结束，广播仍在点名。探索教室、档案室与广播室，寻找离校方法，避开仍在巡查的值班人。

![0.6.0实际下载应用运行截图](docs/desktop.png)

主要交付是离线桌面软件，安装后无需Node、浏览器、账号或联网服务。20—30分钟是首次玩家设计目标，不是实测时长；高级商业音画品质及首次体验仍未完成验收。

## 下载与当前版本

公开版本：[下载0.6.0开发预览](https://github.com/Tomhao10225101490/midnight-rollcall/releases/tag/v0.6.0)。M系列Mac选arm64 DMG/ZIP，Intel Mac选x64，Windows选安装EXE或便携EXE，Linux选AppImage或tar.gz。具体启动和单个可信应用的未签名处理见[安装说明](docs/INSTALL.md)。应用无Developer ID、苹果公证或Windows代码签名，不保证没有系统提示。

源码main目前为0.7.0候选，尚未公开Release。新增门扇近景及打开后的实体碰撞、原创结局曲、晨光庭院，并修复快速恢复/暂停的音频竞争。本机已验证的最新安装包在 `release/fixed-0.7`，可执行应用在 `release/audio-fix-0.7/mac-arm64/末铃点名.app`；这些本机目录不上传源码仓库，不能当成GitHub下载地址。[本机产物大小、SHA256与验证范围](docs/FIXED-LOCAL-ARTIFACTS-0.7.0.md)。旧local-0.7是修复前历史候选。

0.7原生构建[43098439265](https://github.com/Tomhao10225101490/midnight-rollcall/actions/runs/43098439265)仍待完成。旧运行曾因GitHub服务启动异常结束，未执行构建；不将其视为平台包已通过。网页试玩未部署。

## 操作与玩法
WASD移动、鼠标/方向键观察、Shift奔跑、Ctrl潜行、E互动、H在储物柜前藏入/退出、J查看记录/楼层示意图/逐级提示、Esc暂停。柜内只能通过通风缝观察，被目击藏入会遭搜查。

奔跑制造声音并提高纪律值；安静行动逐步降低。值班人丢失视线后会检查最后动静位置及附近。铃响期间值班人停步听令、出口开放十二秒；不要碰到他。试卷、监考登记、档案、频道索引与配电记录构成完整解谜链。关键进度自动存档，设置保存到本机。

恐怖追逐，无血腥，无镜头晃动或刻意闪烁。请先调低音量；出现晕动不适时暂停。支持音量、灵敏度、视野、全屏、画面比例和接触阴影设置。

## 验证范围

| 平台 | 已公开0.6.0 | 本机0.7候选与限制 |
|---|---|---|
| macOS arm64 | DMG/ZIP，实际下载ZIP完整断网键鼠通关，DMG入口检查通过 | 新修复app完整断网通关；DMG/ZIP实际生成、57模块/入口检查、ZIP解压启动通过；包内app.asar与整局app逐字节一致 |
| macOS x64 | 对应系统构建DMG/ZIP、包检查通过 | 0.7尚未完成；未实机试玩 |
| Windows x64 | 对应系统构建安装/便携EXE、包检查通过 | 0.7尚未完成；未实机试玩 |
| Linux x64 | 对应系统构建AppImage/tar.gz、包检查通过 | 0.7尚未完成；未实机试玩 |
| 浏览器 | 静态ZIP及Chrome基础启动/菜单/暂停通过 | 0.7独立ZIP解压后可见Mac Chrome正常键鼠完成第一道谜题、鼠标观察、音频暂停/静音、设置/全屏及刷新读档；未整局 |

0.6九包真实大小与SHA256见[公开产物清单](docs/ARTIFACTS-0.6.0.md)。0.7修复候选固定源为e411ca05f9eea347de25e527c450c98c08ec0080，31项逻辑测试/typecheck通过。完整桌面路线经历3次被捕后通过正常检查点续玩，没有瞬移、无敌或物品注入；Playwright会话网络禁用，HTTP与页面错误为零。熟知路线的自动操作不能代表首次玩家时长；音频信号检查不等于主观听感验收。[完整报告](FINAL_REPORT.md)。

![0.7庭院候选实际正常通关结局](docs/ending-0.7.png)

## 从源码运行、测试与构建
Node.js 22及以上，在本项目目录运行：
```sh
npm ci
node node_modules/electron/install.js
npm run desktop
```
逻辑测试与构建：
```sh
npm run typecheck
npm test
npm run build
npm run dist
npm run dist:web
```
`npm run dist`生成当前系统的桌面包；跨平台发布使用对应系统的GitHub Actions runner。`npm run dev`在本机4173端口运行辅助浏览器构建。

以下桌面自动回归脚本已在macOS实测；默认使用Mac Electron，可通过 `ELECTRON_PATH` 指定应用可执行文件：
```sh
npm run test:desktop
npm run test:traverse
npm run test:search
npm run test:map
npm run test:defeat
npm run test:mix
npm run test:fonts
npm run test:score-reset
npm run test:pointer-transition
npm run test:ending-music
```
`test:traverse`使用正常键鼠路线、只读观察状态。macOS/Linux shell可用 `ROLLCALL_OFFLINE=1 npm run test:traverse`进行网络禁用回归。`test:mix`需要系统已安装离线中文语音。`npm run test:panels`直接挂载界面组件检查布局和输入，仅为组件验证。

可见Chrome回归：先保持 `npm run dev` 运行，再执行 `npm run test:browser`。默认使用Mac本机Google Chrome，支持 `BROWSER_PATH` 指定浏览器可执行文件和 `ROLLCALL_WEB_URL` 指定本地测试地址（包含`?qa=1`）。桌面与可见浏览器测试均须允许测试窗口获得焦点。

`npm run test:door-collision`通过正常键盘检查防夹、门扇阻挡和绕行。`test:ending-music`显式调用播放器组件，不等同于正常通关；逃生触发另由`test:traverse`验证。字体缺失恢复测试须先启动`npm run dev`，再运行`node scripts/font-failure-browser.mjs`，该脚本临时阻止字体请求后解除并检查重试。

## 原创与许可
原创代码MIT。几何、标牌、材质纹理和合成音乐由项目代码生成；不使用下载模型或音频。随包内置离线Noto Sans SC字体，按SIL OFL 1.1单独保留许可、版权与来源。中文语音只尝试本机离线系统声音，无声音时保留提示音与完整字幕。第三方软件保持各自许可，详见[第三方声明](THIRD_PARTY_NOTICES.md)。无账号系统、后端或遥测。

## English Quick Start

Offline desktop game under development. [Download the published 0.6.0 preview](https://github.com/Tomhao10225101490/midnight-rollcall/releases/tag/v0.6.0) for a bundled app. The 0.7.0 candidate is available locally and in source; its cross-platform release is pending. From source: `npm ci`, `node node_modules/electron/install.js`, then `npm run desktop`. Use `npm test`, `npm run typecheck`, `npm run build`, and `npm run dist` for tests and native packaging. Final visual/audio quality and first-player duration acceptance remain pending.
