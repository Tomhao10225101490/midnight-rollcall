# 0.7.0 本机产物（尚未公开发布）

这些文件位于release/local-0.7，由本机Apple Silicon Mac实际构建，不是GitHub CI下载产物。运行代码对应候选源5af7512db849bee459d9acdf6de484bb1ab5772e；打包时HEAD为后续文档提交d4b6f84。无开发者签名或苹果公证。

| 文件 | 大小（字节） | SHA256 |
|---|---:|---|
| midnight-rollcall-0.7.0-mac-arm64.dmg | 140080183 | `de0ea935f0bf08c2752ea5231fae591c03280d8390b572512c39bdfb6034d41a` |
| midnight-rollcall-0.7.0-mac-arm64.zip | 135544842 | `a30f9c5250f61ab51f9d54bc77d2e1612979b01bd2a4a92110cf04099839cf6c` |
| midnight-rollcall-0.7.0-web.zip | 12403006 | `11ebde9dab72a8586a906af3ac98031b7b4edcb9bd21aaae78c426659e630904` |

同目录SHA256SUMS.txt可用`LC_ALL=C shasum -a 256 -c SHA256SUMS.txt`核验。DMG只读挂载、0.7.0版本、可执行入口、Applications链接和56运行模块检查通过；ZIP通过CRC、资源检查并实际解压启动。独立网页ZIP已单独解压，通过本地HTTP在无头Google Chrome验证启动、菜单和暂停，未整局试玩。Mac ZIP已实际解压并完整断网键鼠通关，3次被捕后通过真实菜单读取已获得检查点；HTTP/页面错误0，全部谜题、铃声出口、音乐、最小化暂停/恢复及重开清理通过。没有瞬移、无敌或物品注入。

0.7跨平台原生构建43096405685仍排队；公开下载仍为0.6.0，不将上述本机文件冒充远端Release资产。

后续发现快速记录返回再暂停时的浏览器音频上下文竞态。此表保留修复前本机文件的真实校验值；源码修复已通过可见Chrome回归，新的桌面候选仍在整局验证，不能把这些旧包称为已包含修复。
