# 0.7.0交付报告

《末铃点名》已有完整可玩的中文第一人称校园恐怖单机流程：探索、追捕/搜索、躲藏、四段谜题、铃声门禁、纪律警戒、广播、胜败、检查点、菜单和设置。新增原创门体细节、结局音乐和晨光庭院；修复打开门扇无碰撞、快速恢复/暂停音频竞争以及晨光切换卡顿。完整正常键鼠通关通过。整体品质目标仍未最终验收。

## 运行与下载
- [源码仓库](https://github.com/Tomhao10225101490/midnight-rollcall)。项目目录midnight-rollcall，`npm ci`、`node node_modules/electron/install.js`后执行`npm run desktop`。测试：`npm test`、`npm run typecheck`；构建：`npm run build`、`npm run dist`、`npm run dist:web`。完整操作与配置见README。
- [实际公开0.7.0 Release](https://github.com/Tomhao10225101490/midnight-rollcall/releases/tag/v0.7.0)，九个安装/网页包以及SHA256SUMS.txt、ARTIFACTS-0.7.0.md已上传并验证。未部署Pages，没有网页试玩链接。
- 本机Release下载DMG/ZIP位于release/downloads-0.7.0，实际解压应用为artifacts/downloaded-0.7.0/末铃点名.app，可双击运行。完整通关使用的CI下载应用位于artifacts/ci-0.7-mac-extracted/末铃点名.app。
- [每个发布产物的真实字节数与SHA256](docs/ARTIFACTS-0.7.0.md)。本机历史fixed-0.7/local-0.7清单不是发布包校验值，保留作验证记录。

## 平台与验证矩阵
| 平台 | 实际产物 | 验证范围 |
|---|---|---|
| macOS Apple Silicon | DMG、应用ZIP | CI ZIP实际下载解压并完整断网正常键鼠通关；DMG只读挂载/版本/入口/Applications链接通过；Release下载DMG/ZIP与CI文件逐字节一致，Release ZIP实际解压启动通过 |
| macOS Intel | DMG、应用ZIP | macOS runner构建、包检查与哈希通过；未实机试玩 |
| Windows x64 | 安装EXE、便携EXE | Windows runner构建、包检查与哈希通过；未实机试玩 |
| Linux x64 | AppImage、tar.gz | Linux runner构建、包检查与哈希通过；未实机试玩 |
| 浏览器 | 独立静态ZIP | 普通键鼠第一道谜题、鼠标锁定/观察、音频暂停/静音、设置/全屏及刷新读档通过；Release包67个文件与实际可见Mac Chrome测试包内容一致；未整局 |

固定源码和v0.7.0标签均为e411ca05f9eea347de25e527c450c98c08ec0080。[原生构建43098439265](https://github.com/Tomhao10225101490/midnight-rollcall/actions/runs/43098439265)五个job成功，[检查上传43100202536](https://github.com/Tomhao10225101490/midnight-rollcall/actions/runs/43100202536)成功。31项逻辑测试/typecheck通过；九包版本、入口、字体/音频来源及57个递归运行模块检查通过。公开前后远端11项资产的大小与SHA256均匹配，isDraft=false，标签源提交确认一致。

实际CI下载app整局经历3次捕获后通过真实菜单恢复已获得检查点；所有谜题、铃声出口、结局音乐、最小化暂停/恢复与重开通过。没有瞬移、无敌或物品注入；Playwright会话离线模式下HTTP/页面错误均0。逃生界面19ms可见，结局120帧1998.4ms约60FPS，仅本机短时视点，不是整局最低性能保证。此前8次重开330几何/59纹理稳定。

## 未完成项与边界
- 高级商业美术、音乐品质和独立首次玩家体验仍需改善与验收。20—30分钟为设计目标，不是已测游玩时长；尚无首次玩家反馈，自动熟练操作不能代替。
- Windows、Linux和Intel Mac没有实机试玩，不能写成全平台已验证。音频信号测试不等于主观听感评价。
- 无Developer ID、苹果公证或Windows代码签名。按[安装说明](docs/INSTALL.md)允许单个可信应用，不关闭全局安全保护。
- 两次GitHub服务startup_failure的阻塞已由后续成功构建解除；当前无构建或发布阻塞。0.7仍为开发预览，不据此宣布整体目标完成。
- 原创代码与程序化资产按MIT；Noto Sans SC按SIL OFL 1.1保留原版权，第三方软件保留各自许可，见THIRD_PARTY_NOTICES.md。无账号、后端、遥测、付费API或购买素材。
