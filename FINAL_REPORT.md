# 当前交付报告

《末铃点名》是可离线运行的中文第一人称校园恐怖桌面游戏。已具备探索、追捕/搜索、躲藏、四段谜题、铃声门禁、警戒、广播、胜败、检查点、菜单和设置。完整普通键鼠通关通过；美术/音乐的高端商业品质及首次玩家20—30分钟目标仍未验收，不能宣布整体目标完成。

## 可用版本与路径
- [源码仓库](https://github.com/Tomhao10225101490/midnight-rollcall)。本地项目目录midnight-rollcall，`npm ci`、`node node_modules/electron/install.js`后`npm run desktop`；测试`npm test`和`npm run typecheck`，打包`npm run dist`。完整操作与启动说明见README。
- [已公开0.6.0 Release](https://github.com/Tomhao10225101490/midnight-rollcall/releases/tag/v0.6.0)，九个安装/网页包真实大小和SHA256见[0.6产物清单](docs/ARTIFACTS-0.6.0.md)。未部署Pages。
- 最新0.7.0音频修复候选本机安装包：release/fixed-0.7中的Mac arm64 DMG、应用ZIP、网页ZIP。真实大小和SHA256见[新本机产物清单](docs/FIXED-LOCAL-ARTIFACTS-0.7.0.md)，同目录SHA256SUMS.txt。可执行应用在release/audio-fix-0.7/mac-arm64/末铃点名.app，ZIP实际解压应用在artifacts/fixed-0.7-extracted/末铃点名.app。
- 0.7.0尚未公开Release。草稿不提供公开下载入口；旧release/local-0.7及其清单仅保留历史候选，不含后续音频修复。

## 0.7候选验证范围
| 平台 | 构建产物 | 实际验证 |
|---|---|---|
| macOS Apple Silicon | 本机DMG、应用ZIP已完成 | 修复app完整断网键鼠通关，3次捕获后正常检查点续玩；DMG只读挂载/入口/版本/Applications链接，ZIP CRC/实际解压启动；两包app.asar与整局app逐字节一致 |
| macOS Intel | 0.7未完成；0.6公开包仍可用 | 0.6 macOS runner构建及包检查通过，未实机试玩 |
| Windows x64 | 0.7未完成；0.6安装/便携EXE仍可用 | 0.6 Windows runner构建及包检查通过，未实机试玩 |
| Linux x64 | 0.7未完成；0.6 AppImage/tar.gz仍可用 | 0.6 Linux runner构建及包检查通过，未实机试玩 |
| 浏览器 | 0.7独立静态ZIP已完成 | 实际ZIP单独解压，可见Mac Chrome普通键鼠完成第一道谜题、鼠标锁定/观察、音频暂停/静音、设置/全屏/刷新读档；未整局试玩 |

修复源提交e411ca05f9eea347de25e527c450c98c08ec0080。31项逻辑测试/typecheck通过，实际桌面音频/静音、20次记录开关及真正Esc/最小化检查通过；完整断网路线HTTP/页面错误0。没有瞬移、无敌或物品注入。57个递归运行模块、入口、字体和音频来源检查通过。

首次启用晨光的卡顿已通过稳定阴影配置/预热修复。实际修复app逃生界面7ms可见，结局120帧1989.2ms约60FPS，仅本机短时视点，不代表整局最低性能。音频信号检查不等于主观听感验收。

## 真实阻塞与下一步
- 原生运行43096405685首次及重试均在GitHub服务启动阶段失败，零job、无构建日志。运行页报告GitHub内部临时错误，没有预算不足提示；未通过购买服务处理。
- 新修复源的[原生构建43098439265](https://github.com/Tomhao10225101490/midnight-rollcall/actions/runs/43098439265)目前排队。0.7草稿固定到修复源且无资产。仍需实际九包构建、检查/上传、远端大小和哈希核验、下载Mac包复验后公开，不把workflow提交称为发布成功。
- 未提供Developer ID、苹果公证或Windows代码签名。按[安装说明](docs/INSTALL.md)允许单个可信应用，不关闭全局安全保护。
- 仍需更高美术/音乐完成度和独立首次玩家体验/时长验收；尚无可选试玩反馈回复。

原创代码及程序化资产按MIT；Noto Sans SC按SIL OFL 1.1保留版权，第三方软件保留各自许可，见THIRD_PARTY_NOTICES.md。无账号、后端、遥测、付费API或购买素材。
