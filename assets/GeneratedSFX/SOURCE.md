# 《末铃之后》结局曲

0.7开发版将此音频复制到dist/audio并用于逃生结局。现有探索与追逐配乐仍由原来的实时合成系统提供。

- 文件：after_last_rollcall.wav，44.1 kHz、16-bit、双声道，33.41034秒，5893628字节。
- SHA256：78b620040ae3a706ef6aee52c3a7bc4916d087c6fec17114513f074e5d27cbac。
- 本次编排：B小调、63 BPM，钢琴、木管、铺底与低音分段进入和退出；完整和声元数据与事件保存在同名JSON。
- 使用已安装的 Specs `build-music` / `build-sfx` 技能引擎进行本地算法合成。引擎标注 Copyright 2026 Specs Inc.、Apache-2.0；本仓库未复制或重新许可该引擎代码。没有外部录音、采样库、模型权重或付费服务。
- 本项目编写的编排脚本及生成音频按项目MIT许可提供；第三方生成工具保留其原许可。
- 生成脚本：tempAssetGen/gen_music_after_last_rollcall.js。需本机已有上述技能引擎，以环境变量ROLLCALL_MUSIC_ENGINE指定其tools目录；Node 22运行。该脚本每次生成新的曲目，当前交付音频以提交文件与哈希为准，普通游戏构建不重新生成。
- FFmpeg volumedetect测得峰值-0.4 dB；PCM检查无满幅削波，首尾淡变，RMS约0.15054。这些只是声学检查，不是主观听感或商业品质验收。
- 验证用imageio-ffmpeg 0.6.0安装在项目artifacts下的隔离环境；工具二进制不进入游戏或源码发布。
