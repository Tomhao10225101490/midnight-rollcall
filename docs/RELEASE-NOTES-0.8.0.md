# 末铃点名 0.8.0 开发预览

原创中文校园恐怖逃生单机游戏。桌面包内置运行环境，下载后安装或解压即可离线玩，无需Node、账号或联网服务。

本版新增原创卷边试卷、钢笔、印章和木纹/漆面材质；二班监考登记、广播索引、值班日记显示对应纸面内容，与弹窗使用同一份线索数据。广播、配电和出口设备会随谜题进度与铃声改变状态。修复交互家具没有实体碰撞的问题，玩家与敌人均须绕行，站在设备外仍可正常解谜。

## 选择下载
- Apple Silicon Mac：mac-arm64.dmg或mac-arm64.zip。
- Intel Mac：mac-x64.dmg或mac-x64.zip。
- Windows x64：win-x64-setup.exe安装版，或win-x64-portable.exe便携版。
- Linux x64：linux-x86_64.AppImage或linux-x64.tar.gz。
- 独立浏览器构建：web.zip，用于静态HTTP托管；桌面用户不需要它。

九个包的真实字节数与SHA256见附件ARTIFACTS-0.8.0.md和SHA256SUMS.txt。启动与单个可信应用的未签名处理见[安装说明](https://github.com/Tomhao10225101490/midnight-rollcall/blob/main/docs/INSTALL.md)。未提供Developer ID、苹果公证或Windows代码签名，不保证没有系统提示，不要求关闭全局安全保护。

## 实际验证
固定源码5f22c5f1aec8b698b6470197098d5e3f871f1eb6。[原生构建](https://github.com/Tomhao10225101490/midnight-rollcall/actions/runs/43105561085)五个任务成功；[九包检查与上传](https://github.com/Tomhao10225101490/midnight-rollcall/actions/runs/43106264989)成功。33项测试和类型检查通过，九包版本/入口/63递归运行模块、字体与音频授权资源及SHA256通过，11个Release附件逐个匹配独立检查清单。

Mac arm64：实际下载CI ZIP、解压后完成断网正常键鼠通关，3次捕获后用真实检查点继续，无瞬移/无敌/道具注入；HTTP与页面错误0，设备外侧互动、结局音乐、最小化暂停/恢复、重开通过。DMG只读挂载、版本、入口与Applications链接通过，内含应用与ZIP一致。Release下载的DMG/ZIP与已测CI文件逐字节一致；Release ZIP另行解压并实际启动通过，后者是启动检查而非第二次整局。

Windows、Linux、Intel Mac：对应系统runner构建、包内部检查和校验通过，未实机试玩。独立CI网页ZIP在可见Mac Chrome通过正常键鼠首个谜题、鼠标锁定、音频暂停、设置/全屏与刷新读档；Release网页ZIP与已测文件逐字节一致，未进行浏览器整局试玩。没有部署网页试玩页面。

## 范围与许可
这是持续打磨的开发预览，不代表顶级商业美术或音乐品质已验收。20—30分钟是首次玩家设计目标，尚无独立首次玩家时长实测；熟悉答案的自动操作不能替代该验收。

虚构学校与角色，无血腥；建议先调低音量，晕动不适时暂停。WASD移动、鼠标/方向键观察、Shift奔跑、Ctrl潜行、E互动、H藏身、J记录与提示、Esc暂停。

原创代码与程序化资产MIT；Noto Sans SC字体保留SIL OFL 1.1许可与版权，其他依赖保留各自声明。没有购买素材或使用付费图像/语音服务。
