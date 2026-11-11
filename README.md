# 末铃点名 · 桌面单机恐怖逃生（开发中）
虚构的昭川中学里，晚自习已经结束，广播仍在点名。探索教室、档案室与广播室，寻找离校方法，避开仍在巡查的值班人。

![0.5.0实际下载应用运行截图](docs/desktop.png)

主要交付是离线运行的桌面软件。[下载 v0.5.0 开发预览](https://github.com/Tomhao10225101490/midnight-rollcall/releases/tag/v0.5.0)，无需安装Node或打开浏览器。当前主流程已通过通关与发布验证；高级商业音画品质和首次体验时长仍未完成最终验收。20—30分钟是设计目标，不是已测游玩时长。

## 下载与启动
M系列Mac选arm64 DMG/ZIP；Intel Mac选x64；Windows可选安装EXE或便携EXE；Linux可选AppImage或tar.gz。具体启动与未签名提示见[安装说明](docs/INSTALL.md)。应用无开发者签名与苹果公证，不保证没有系统提示。

本机已下载的DMG/ZIP位于 `release/downloads-0.5.0/`；ZIP解出的实际发行应用为 `artifacts/downloaded-0.5.0/末铃点名.app`，可双击运行。同源本机构建另存于 `release/dev-0.5/mac-arm64/末铃点名.app`。旧的 `release/mac-arm64` 仍是0.4，不代表最新版。

## 操作与玩法
WASD移动、鼠标/方向键观察、Shift奔跑、Ctrl潜行、E互动、H在储物柜前藏入/退出、J查看记录/楼层示意图/逐级提示、Esc暂停。柜内只能通过通风缝观察，被目击藏入会遭搜查。

奔跑制造声音并提高纪律值；安静行动逐步降低。值班人丢失视线后会检查最后动静位置及附近。铃响期间值班人停步听令、出口开放十二秒；不要碰到他。试卷、监考登记、档案、频道索引与配电记录构成完整解谜链。关键进度自动存档，设置保存到本机。

恐怖追逐，无血腥，无镜头晃动或刻意闪烁。请先调低音量；出现晕动不适时暂停。支持音量、灵敏度、视野、全屏、画面比例和接触阴影设置。

## 验证范围
本次包对应固定提交 `ef2a4a2902d9985c8afef0d538fe2788031a3596`。新增空间叙事、设备谜题面板、校园建筑细节、人物曲面/织纹、广播混音、被捕演出、原生失焦暂停、周边搜查和楼层图。

全部9个包已检查内部入口/版本及48个递归运行模块，远端大小与SHA256逐个匹配，详见[产物清单](docs/ARTIFACTS-0.5.0.md)。

| 平台 | 0.5.0实际产物 | 验证范围 |
|---|---|---|
| macOS arm64 | DMG、应用ZIP | 实际下载ZIP完整网络禁用键盘通关；菜单/鼠标锁定/设置通过；DMG挂载和安装入口通过 |
| macOS x64 | DMG、应用ZIP | 对应系统构建、包检查通过，未实机试玩 |
| Windows x64 | 安装EXE、便携EXE | 对应系统构建、包检查通过，未实机试玩 |
| Linux x64 | AppImage、tar.gz | 对应系统构建、包检查通过，未实机试玩 |
| Web | 静态ZIP | Chrome基础启动、菜单、暂停及包检查；未整局试玩 |

完整键盘路线经历3次被捕后通过正常检查点续玩，没有瞬移、无敌或物品注入。网络禁用由Playwright会话离线模式实现，完整路线HTTP请求为零。熟知路线的自动操作不能代表首次玩家时长；音频图和本地播报状态检查不代表主观听感验收。[完整报告](FINAL_REPORT.md)。网页试玩未部署。

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
```
`test:traverse`使用正常键鼠路线、只读观察状态。macOS/Linux shell可用 `ROLLCALL_OFFLINE=1 npm run test:traverse`进行网络禁用回归。`test:mix`需要系统已安装离线中文语音。`npm run test:panels`直接挂载界面组件检查布局和输入，仅为组件验证。

## 原创与许可
原创代码MIT。几何、标牌、材质纹理和合成音乐由项目代码生成；不使用下载模型或音频。0.6开发源码新增离线Noto Sans SC字体，按SIL OFL 1.1单独保留许可、版权与来源。中文语音只尝试本机离线系统声音，无声音时保留提示音与完整字幕。第三方软件保持各自许可，详见[第三方声明](THIRD_PARTY_NOTICES.md)。无账号系统、后端或遥测。

## English Quick Start
Offline desktop game under development. [Download the 0.5.0 preview](https://github.com/Tomhao10225101490/midnight-rollcall/releases/tag/v0.5.0) for a bundled desktop app. From source: `npm ci`, `node node_modules/electron/install.js`, then `npm run desktop`. Use `npm test`, `npm run build`, and `npm run dist` for tests and native packaging. Final visual/audio quality and first-player duration acceptance remain pending.

当前main为尚未公开发布的0.6.0候选版本，新增原创立体窗户和档案柜细节。本机开发应用另存于 `release/dev-0.6/mac-arm64/末铃点名.app`；公开下载及上述发布验证仍对应0.5.0。

0.6中文字体回归：`npm run test:fonts`。构建时校验官方固定字体哈希及源码字符覆盖；界面与场景文字使用同一本地字体。公开0.5安装包尚不含该改动。

字体缺失恢复测试：先保持 `npm run dev` 运行，再执行 `node scripts/font-failure-browser.mjs`。该脚本在Chrome中临时阻止字体请求、验证错误提示，再解除阻止并重试；不修改字体资产。

0.6配乐增加五段随解谜阶段变化的原创乐句与追逐动机。`npm run test:score-reset`检查暂停及普通/追逐中重开后的音符清理；该脚本启动本机Electron，须保持测试窗口可获得焦点。音乐仍为本地合成，自动声学检查不等于主观听感验收。

输入事件回归：`npm run test:pointer-transition` 在实际Electron中连续20次快速打开记录并Esc返回，同时验证正常Esc和最小化仍会暂停。

0.6.0发布验收进行中：正式版本候选应用位于 `release/candidate-0.6/mac-arm64/末铃点名.app`。公开下载仍为0.5.0，新版本构建与下载包验证完成后更新入口。
