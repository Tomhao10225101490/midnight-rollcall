# 原创对白语音来源

本目录中的 WAV 文件是《末铃点名》的原创对白录音，由项目脚本在 macOS 上调用系统语音合成后导出，仅包含游戏自己的台词音频，不包含、也不再分发系统语音模型或语音包文件。

- 格式：WAVE，16-bit PCM，单声道，22050 Hz
- 广播/校内通知：`Flo (Chinese (China mainland))`
- 值班人：`Reed (Chinese (China mainland))`
- 隔壁教室低语：`Sandy (Chinese (China mainland))`
- 未调用付费语音 API，未使用许可不明的第三方语音数据集
- 清单、校验和与逐条台词见 `manifest.json`

生成命令：`python3 scripts/render-voices.py`（仅在本机构建资源时使用，运行时不依赖 `say`）。
