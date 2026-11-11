# 0.7.0 音频修复后本机产物

固定游戏源提交：e411ca05f9eea347de25e527c450c98c08ec0080。本机Apple Silicon Mac实际构建，文件位于release/fixed-0.7；不是GitHub CI下载产物，未做Developer ID签名或苹果公证。

| 文件 | 字节数 | SHA256 |
|---|---:|---|
| midnight-rollcall-0.7.0-mac-arm64.dmg | 140080526 | `b59f853e19db09ccf87c07f160be0fa76f23aa9ebd6100d1957e956478cd4c99` |
| midnight-rollcall-0.7.0-mac-arm64.zip | 135540861 | `1e3dffae894cdebebef9a0bef4278a673d2d93b6a514d4b72225c88abf81cd7a` |
| midnight-rollcall-0.7.0-web.zip | 12403475 | `c8f0076c6963857fca6705d9c1d2fd73373bd26cbd7ac5513ef0027119ea61c1` |

在该目录执行`LC_ALL=C shasum -a 256 -c SHA256SUMS.txt`。DMG只读挂载、版本、入口、Applications链接及57运行模块检查通过并正常卸载；ZIP通过CRC、模块检查及实际解压启动。两种桌面包的app.asar与完整断网键鼠通关的实际app逐字节一致；通关3次捕获后正常检查点续玩，无瞬移/无敌/物品注入，HTTP和页面错误均0。

独立网页ZIP已单独解压，在可见Mac Chrome通过普通键鼠取得第一份试卷/检查点、鼠标锁定和观察、音频暂停/静音、窗口设置、全屏和刷新读档；未做浏览器整局或主观听感验收。

此清单替代旧候选作为当前本机交付；旧release/local-0.7及其[历史清单](LOCAL-ARTIFACTS-0.7.0.md)保留原哈希，不声称含音频修复。原生新构建43098439265尚在排队，0.7公开Release未完成。
