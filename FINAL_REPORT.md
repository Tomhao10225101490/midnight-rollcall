# 末铃点名 · 0.3.0开发预览交付报告

已有可独立离线运行、能够通关的桌面游戏，并已公开发布0.3.0预览。**最终目标仍未完成**：用户要求的高级商业游戏音画品质尚未达到验收，20—30分钟是设计目标，尚无独立首次玩家时长测量。不能把熟知答案的自动路线当成首次游玩体验。

## 游戏内容
虚构昭川中学的有限教学楼与出口；第一人称行走、奔跑、潜行、互动、躲藏、开关门；值班人巡逻、遮挡感知、听觉、追逐、搜索及目击藏入搜查。铃声影响安全行动与出口，纪律值影响追捕。

一班试卷排序与二班登记组成档案密码，办公室与纪律室组合广播频率，广播指引配电，再持通行证趁铃声离开。收集线索能回看并有三级提示。包含胜败、检查点续玩、菜单、暂停、存档校验/迁移、音量/灵敏度/视野/画面精细度/全屏。

程序化原创校园及多部件设备、分节角色、PBR材质与静态实例化；原创合成音效和配乐，值班人脚步带方向、距离及隔墙滤波。中文离线语音依赖本机可用声音，提示音与文字始终保留；未导出系统语音资产。

## 运行与下载
- 项目目录：当前仓库 `midnight-rollcall`。
- 本机可双击：`release/mac-arm64/末铃点名.app`，版本0.3.0；无开发者签名或公证。
- [GitHub完整源码](https://github.com/Tomhao10225101490/midnight-rollcall)
- [0.3.0开发预览下载页](https://github.com/Tomhao10225101490/midnight-rollcall/releases/tag/v0.3.0)
- 已下载的公开Mac安装包：`release/downloads-0.3.0/`（DMG、应用ZIP及SHA256清单）。
- [全部9包的真实字节数与SHA256](docs/ARTIFACTS-0.3.0.md)，Release也附带统一SHA256SUMS.txt。
- 网页试玩未部署。Web静态ZIP可独立构建，作为次要交付，不替代桌面软件。

源码运行：`npm ci`、`node node_modules/electron/install.js`、`npm run desktop`。
验证：`npm run typecheck`、`npm test`、`npm run test:desktop`、`npm run test:settings`、`npm run test:hints`、`npm run test:audio`、`npm run test:regression`、`npm run test:traverse`。
构建：`npm run dist`；Web ZIP：`npm run dist:web`（构建工具需要Python 3，最终桌面玩家不需要）。

## 验证矩阵
| 平台 | 实际0.3.0产物 | 已验证范围 |
|---|---|---|
| macOS Apple Silicon | DMG、应用ZIP；本机.app | 本机修复版.app完整键盘通关，3次被捕与正常续玩；设置/笔记操作验证；CI包内部检查；公开下载ZIP应用启动、输入/设置及DMG只读挂载验证 |
| macOS Intel | DMG、应用ZIP | macOS runner构建通过、内容/哈希检查；未实机试玩 |
| Windows x64 | 安装EXE、便携EXE | Windows runner构建通过，两个EXE内层资源/入口/版本检查；未实机试玩 |
| Linux x64 | AppImage、tar.gz | Linux runner构建通过，两个包内资源/入口/版本检查；未实机试玩 |
| Web | 静态ZIP | 构建与入口检查；0.3.0本机Chrome启动、菜单、游戏和暂停通过，未整局浏览器试玩 |

发布源提交：`c69d775b365d7afb3f88e4c74972865019b044b3`。
原生构建：[run43065138766](https://github.com/Tomhao10225101490/midnight-rollcall/actions/runs/43065138766)，全部5个job成功。
检查与转存：[run43066389031](https://github.com/Tomhao10225101490/midnight-rollcall/actions/runs/43066389031)，9个包逐个检查app.asar或Web入口，再上传到草稿。公开前远端11项资产（9包+2清单）的大小和SHA256全部匹配，源提交一致。

15项逻辑测试与类型检查通过。最新新增回归证明合法外墙边缘目标可以被追到，以及铃声期间藏入不会被追溯误判。完整键盘通关使用只读QA观察坐标，未瞬移、无敌或注入物品。设置测试验证FOV及2倍采样真正应用、重载保存、暂停返回、笔记Esc关闭；中文截图已检查。

静态实例化后，同一走廊绘制调用895→555；8次重开后319几何资源/42纹理稳定，短时120帧约60.26fps。不是所有设备或整局最低帧率保证。音频信号/暂停/静音验证不代表主观听感质量认证。诊断相机近景用于美术检查，不充当普通玩家截图。

## 未完成与真实限制
- 高级商业游戏级美术、建模、音乐仍需完善与体验评价，目前为程序化独立游戏风格。
- 20—30分钟首次游玩目标未实测，需要继续完善探索节奏并进行独立玩家体验测试。
- Windows/Linux/Intel Mac缺少本次实体设备试玩，已明确限定为构建与包内容检查。
- 未提供代码签名、公证证书；不会伪造。使用官方单应用确认方式，见[安装说明](docs/INSTALL.md)，不关闭全局安全保护。
- 原创代码MIT；第三方软件保留自身许可，见THIRD_PARTY_NOTICES.md。没有购买资产、付费API、云主机、域名或加入遥测。
