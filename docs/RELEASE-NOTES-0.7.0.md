# 末铃点名 0.7.0 开发预览

原创中文第一人称校园恐怖逃生单机游戏。桌面包内置运行环境，下载后安装或解压即可离线玩，无需Node、账号或联网服务。

本次新增门扇近景建模与打开后的实体碰撞、原创结局曲《末铃之后》和晨光出口庭院；修复快速从线索返回再暂停时的音频上下文竞争，以及首次开启晨光时的切换卡顿。

## 选择下载
- Apple Silicon Mac：`mac-arm64.dmg`或`mac-arm64.zip`。
- Intel Mac：`mac-x64.dmg`或`mac-x64.zip`。
- Windows x64：`win-x64-setup.exe`安装版，或`win-x64-portable.exe`便携版。
- Linux x64：`linux-x86_64.AppImage`或`linux-x64.tar.gz`。
- 独立浏览器构建：`web.zip`，用于静态HTTP托管；桌面用户不需要下载它。

九个包的真实字节数与SHA256在本页附件`ARTIFACTS-0.7.0.md`和`SHA256SUMS.txt`中。完整运行和单个可信应用的系统提示处理见[安装说明](https://github.com/Tomhao10225101490/midnight-rollcall/blob/main/docs/INSTALL.md)。未提供Developer ID、苹果公证或Windows代码签名，不保证没有安全提示，不要求关闭全局安全保护。

## 实际验证
固定源码：`e411ca05f9eea347de25e527c450c98c08ec0080`。[原生构建](https://github.com/Tomhao10225101490/midnight-rollcall/actions/runs/43098439265)五个job成功；[九包检查与上传](https://github.com/Tomhao10225101490/midnight-rollcall/actions/runs/43100202536)成功。31项逻辑测试/typecheck通过，九包版本、入口及57个递归运行模块检查通过，远端11项资产大小与SHA256逐一匹配。

Mac arm64：实际下载CI ZIP并解压，正常键鼠完整断网通关，3次捕获后通过真实检查点续玩，无瞬移、无敌或物品注入；HTTP/页面错误0，结局音乐、最小化暂停/恢复、重开通过。DMG只读挂载、版本、可执行入口与Applications链接检查通过。另从Release下载的DMG/ZIP与上述CI文件逐字节一致。

Windows、Linux、Intel Mac：对应系统runner构建、实际包内部检查及哈希通过，未实机试玩。浏览器：独立包普通键鼠第一道谜题、音频暂停/静音、设置/全屏与刷新读档通过，未整局；Release网页ZIP全部67个文件与实际可见Mac Chrome测试包内容一致。

## 范围与许可
这是持续打磨的开发预览，不代表顶级商业美术或音乐品质已验收。20—30分钟是首次玩家设计目标，尚无独立首次玩家时长实测；熟悉答案的自动操作不能替代该验收。没有部署网页试玩页面。

所有角色与学校均虚构，无血腥；建议先调低音量，晕动不适时暂停。WASD移动、鼠标/方向键观察、Shift奔跑、Ctrl潜行、E互动、H藏身、J记录与提示、Esc暂停。

原创代码与程序化几何/音乐按MIT；Noto Sans SC字体按SIL OFL 1.1保留原版权，第三方软件保留各自声明。没有购买素材或调用付费图像/语音服务。
