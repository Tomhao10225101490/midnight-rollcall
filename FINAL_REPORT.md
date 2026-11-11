# 末铃点名 · 0.4.0开发预览交付报告

已有可独立离线运行、能够通关的桌面游戏，0.4.0已公开发布。**完整目标仍未完成**：高级商业游戏音画品质未验收，20—30分钟是设计目标，尚无独立首次玩家时长测量。熟知答案的自动路线不能代表首次体验。

## 游戏与本次变化
虚构昭川中学包含两间教室、走廊、办公室、广播室、储物间、纪律室、楼梯口和出口。第一人称行走、奔跑、潜行、开门、互动、记录与提示；值班人巡逻、遮挡感知、听觉、追逐、搜索和目击藏入搜查。铃声影响安全行动与出口，纪律值影响追捕。

试卷与二班登记组成档案密码，办公室与纪律室组合广播频率，广播指引配电，再持通行证趁铃声离开。包含胜败、重新开始/检查点续玩、中文菜单、暂停、存档校验、音量/灵敏度/视野/画面精细度/全屏。

0.4新增实体柜碰撞与柜内通风缝窥视、限幅观察及原位退出；AI仍能搜查被目击的藏身者。新增原创圆角课桌、开放书斗、钢架课椅与储物柜、粉笔黑板，移除重叠悬空标牌。可关闭的GTAO接触阴影及全部依赖离线打包。拨弦采用本项目阻尼弦波导合成；配乐、音效、材质与几何不含下载素材。中文语音仅调用可用的本机离线声音，必要信息同时显示文字并配提示音。

## 运行与下载
- 项目：当前仓库 `midnight-rollcall`。
- 本机可双击：`release/mac-arm64/末铃点名.app`，版本0.4.0。
- [完整源码](https://github.com/Tomhao10225101490/midnight-rollcall)
- [0.4.0实际下载页](https://github.com/Tomhao10225101490/midnight-rollcall/releases/tag/v0.4.0)
- 本机已下载的实际Mac DMG/ZIP及校验清单：`release/downloads-0.4.0/`。
- 下载ZIP解压的实际CI应用：`artifacts/downloaded-0.4.0/末铃点名.app`。
- [9个包的字节数与SHA256](docs/ARTIFACTS-0.4.0.md)，Release附带统一SHA256SUMS.txt。
- 网页试玩未部署。独立Web ZIP为次要交付，桌面玩家无需浏览器、Node或网络。

源码运行：`npm ci`、`node node_modules/electron/install.js`、`npm run desktop`。
验证：`npm run typecheck`、`npm test`、`npm run test:desktop`、`npm run test:traverse`、`npm run test:hiding`、`npm run test:rendering`、`npm run test:audio`、`npm run test:settings`、`npm run test:regression`。额外断网测试：`node scripts/offline-electron.mjs`。
构建：`npm run dist`；静态包：`npm run dist:web`（构建需要Python 3，桌面玩家不需要）。

## 验证矩阵
| 平台 | 0.4.0实际产物 | 已验证范围 |
|---|---|---|
| macOS Apple Silicon | DMG、应用ZIP；本机.app | 本机正式app完整键盘通关，3次被捕后正常续玩；柜内操作与断网重载通过。下载的CI ZIP应用启动、输入、设置、暂停与断网检查通过；DMG只读挂载、版本/可执行入口/Applications链接通过，已卸载 |
| macOS Intel | DMG、应用ZIP | macOS runner构建、内部版本/入口/41模块及哈希检查；未实机试玩 |
| Windows x64 | 安装EXE、便携EXE | Windows runner构建、两个EXE内层资源/入口/版本/41模块检查；未实机试玩 |
| Linux x64 | AppImage、tar.gz | Linux runner构建、资源/入口/版本/41模块检查；未实机试玩 |
| Web | 静态ZIP | 构建与41模块检查；本机Chrome启动、菜单、游戏和暂停通过，未整局浏览器试玩 |

发布源：`5301ad6e46c01790915590df84dfd70f1cdf3f50`。
原生构建：[43070739511](https://github.com/Tomhao10225101490/midnight-rollcall/actions/runs/43070739511)，全部5个job成功。
包内检查与转存：[43071428344](https://github.com/Tomhao10225101490/midnight-rollcall/actions/runs/43071428344)，成功。公开前后均独立核对远端11项资产（9包+2清单）大小、SHA256及固定源提交一致。两份实际下载Mac包哈希匹配。

18项逻辑测试和类型检查通过。完整键盘测试使用只读QA观察坐标，没有瞬移、无敌或注入物品。断网测试覆盖重载、资源、移动、音频上下文和暂停，HTTP请求为零；不是整局断网通关。音频信号、静音与波形测试不代表主观听感验收。

家具版本走廊短时120帧/2000ms约60FPS；8次重开资源稳定。此性能数据早于实体柜改动，不是发布版本整局或所有设备的最低帧率保证。README截图来自实际下载应用；诊断相机近景不充当普通玩家通关证据。

## 未完成与限制
- 高级商业游戏级建模、美术、音乐仍需提升与体验评价。
- 20—30分钟首次游玩目标未实测，需要继续完善探索节奏及独立玩家体验测试。
- Windows/Linux/Intel Mac未实机试玩；公开下载Mac应用仅上述范围检查，完整通关验证使用本机同源构建。
- 无开发者代码签名或苹果公证证书，不能保证无系统提示。参见[安装说明](docs/INSTALL.md)，不关闭全局安全保护。
- 原创代码MIT，第三方软件保留许可，见THIRD_PARTY_NOTICES.md。无付费API、购买素材、云主机、域名、账号系统、遥测或后端。

0.5开发版另存于 `release/dev-0.5/mac-arm64/末铃点名.app`：新增叙事、设备面板、追捕反馈与原生失焦暂停，实际app完整键盘逃生通过（3次捕获/检查点续玩），被捕与胜利演出最小化冻结通过。0.5尚未公开发布。随后已将人物曲面/织纹与广播混音更新到该开发app；这些音画更新单独做运行检查，不把先前整局结果写成更新后重新通关。
