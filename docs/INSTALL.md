# 安装与安全提示
本项目的发行包不需要安装Node、Python或浏览器。游戏离线运行，无账号、后端或遥测。

## macOS
Apple Silicon（M系列）选arm64；Intel机器选x64。打开DMG，把“末铃点名.app”拖到“应用程序”，或解压ZIP后移动应用。

本项目没有Apple Developer证书和公证凭据，不能承诺无系统提示。仅在核实来源为本项目Release、SHA256匹配并愿意信任后，按Apple提供的单应用操作：先尝试打开，再到“系统设置 → 隐私与安全性”查看该应用的“仍要打开”。不要关闭全局安全保护，也不要运行不明绕过脚本。系统报告损坏、恶意软件或管理员限制时，不要强行绕过；先检查文件和来源。参考：[Apple：在Mac上安全打开App](https://support.apple.com/en-us/102445)。

## Windows
选择setup.exe安装版，或portable.exe便携版。没有Windows代码签名证书，可能遇到应用信誉提示。仅在确认来源和校验值后使用系统提供的单次运行选项；如果设备策略不允许，保留保护并联系管理员。不要关闭Defender或Smart App Control。参考：[Microsoft：SmartScreen应用信誉](https://learn.microsoft.com/windows/apps/package-and-deploy/smartscreen-reputation)。

## Linux
优先选择tar.gz，解压后运行其中的midnight-rollcall程序；AppImage需要发行版支持相应运行依赖。文件可能需要在文件属性中允许执行。不要以root运行，也不要添加关闭沙盒的参数。当前只做CI构建，未在Linux实体设备试玩。

## 校验
Release附带SHA256SUMS.txt。macOS可使用`shasum -a 256 文件名`，Linux使用`sha256sum 文件名`，Windows PowerShell使用`Get-FileHash 文件名 -Algorithm SHA256`，与清单逐字比较。校验只能证明文件与发布清单一致，不等同于代码签名或独立安全审计。
