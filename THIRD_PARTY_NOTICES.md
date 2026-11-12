# 资产与第三方软件许可
原创源码、程序化几何（校园、人物、部分道具）、自适应合成配乐及材质生成算法由本项目制作，使用项目MIT许可。没有购买付费模型、照片、音乐或语音素材。课桌与课椅在资源就绪时使用 Poly Haven 的 School Desk 01 与 School Chair 01（CC0 1.0，2K glTF，未改动官方网格与贴图；许可与哈希见 `assets/models/`）。加载失败时回退到 `src/furniture.ts` 的程序化桌椅。人声为项目原创台词的离线录音；部分音效使用已注明来源的 Kenney CC0 免费录音。

Three.js 0.187.0：MIT，运行时渲染依赖，包括 EffectComposer、GTAOPass、OutputPass 及其递归依赖的 addons 模块；保留上游源码头部。完整许可随构建放在dist/licenses/THREE-LICENSE.txt。
Electron 43.8.8：MIT，包含Chromium及其他各自许可的第三方组件。完整Electron许可和Chromium许可清单随桌面资源附带在dist/licenses/。
TypeScript、Vite和electron-builder：构建工具，MIT。Playwright：测试工具，Apache-2.0。版本及全部传递依赖锁定在package-lock.json，包内保留上游许可。

0.5及以前仅使用系统字体。0.6开发版新增随包携带的Noto Sans SC Regular，保留原始OTF、SIL OFL 1.1许可及Adobe版权元数据，未修改字体。原始来源、固定提交、大小与SHA256见assets/fonts/SOURCE.md；许可、版权与来源同时复制到dist/licenses/NOTO-*。字体属于第三方作品，不使用本项目MIT许可。对白音频位于 assets/voice/，为本项目原创台词的离线录音，随包分发；来源、语音名、时长与 SHA256 见同目录 SOURCE.md 与 manifest.json，并复制到 dist/licenses/VOICE-SOURCE.md。录音由本机构建脚本调用 macOS 系统语音渲染，不包含、也不再分发系统语音模型或语音包。必要线索同时显示为字幕。若录音未就绪，才回退到运行时本机中文离线语音。

0.8 开发版起，脚步、开门/关门、敲门与铃声优先播放 `assets/sfx/` 中的 Kenney 官方 CC0 录音（Impact Sounds 与 RPG Audio，作者 Kenney Vleugels）。仅收录实际使用的 OGG 文件，未修改采样；许可、来源与 SHA256 见同目录 SOURCE.md、LICENSE-KENNEY-*.txt 与 manifest.json，并复制到 dist/licenses/。录音未就绪时回退到 `src/sfx.ts` 的程序化音效。广播提示音与 `src/score.ts` 的拨弦、缓起弦音、环境底音与混响响应仍由本项目在本机生成，遵循项目 MIT 许可。

`src/furniture.ts`的课桌、钢架课椅和储物铁柜为本项目原创共享几何。`src/strings.ts`为本项目实现的阻尼弦波导合成器，激励噪声本地生成，不含录音或音色库。

0.5开发版新增三次轻敲音效由同一原创波形合成模块产生；虚构角色林序及途中叙事文本为本项目原创。

`src/architecture.ts`包含原创双管荧光灯、暖气片、管路阀门和校钟几何，使用共享网格实例化，无外部模型或纹理。

`src/windows.ts`的闭合窗户几何与磨砂纹理、`src/decor.ts`的档案柜细节和分类牌为本项目原创程序化资产，无外部素材。

`src/composition.ts`的五段探索乐句与追逐动机为本项目原创编排，以程序合成音色播放，无外部录音或曲谱引用。

architectural-surfaces.ts 的抹灰和水磨石颜色、凹凸及粗糙度均由本项目原创算法生成，遵循项目 MIT 许可，无第三方照片或扫描材质。

`src/door-model.ts`的木框、压条、把手、锁孔、踢脚板和合页为原创程序化模型，按材质合并并共享，无外部模型素材。

0.7结局音乐assets/GeneratedSFX/after_last_rollcall.wav由项目编排脚本调用Specs本地算法合成工具生成，无外部采样；该第三方工具为Apache-2.0且未复制进本仓库。曲目随离线游戏构建分发，详情见同目录SOURCE.md。

`src/courtyard.ts`的铺石矿物噪声、分叉树干与折面叶片、长椅、围栏、外门和远景建筑均为本项目原创程序化资产，按MIT提供，无第三方模型、纹理或扫描数据。

0.8开发版的`src/exam-paper.ts`试卷印刷、纸纤维、红笔复核标记与卷边，以及`src/desk-tools.ts`钢笔/手持印章几何均为项目原创程序化资产，使用项目MIT许可。印刷文字使用上述已授权的Noto Sans SC字体。

`src/prop-surfaces.ts`的木纹、漆面颗粒、划痕及独立颜色/高度/粗糙度贴图由项目确定性生成，MIT许可，无照片、外部材质库或付费资源。

`src/record-print.ts`的三份校园文件排版为项目原创；实体纸面的线索文字直接来自`src/clues.ts`，与交互弹窗共用数据，字体继续使用随包Noto Sans SC及其SIL OFL许可。

## Poly Haven school furniture (CC0)

0.8 开发版起，教室课桌与课椅优先使用 `assets/models/` 中的 Poly Haven 官方 CC0 模型：

- [School Desk 01](https://polyhaven.com/a/SchoolDesk_01)
- [School Chair 01](https://polyhaven.com/a/SchoolChair_01)

仅收录 2K glTF 实际使用的网格、二进制缓冲与 JPEG 贴图，未修改采样或网格。许可与 SHA256 见同目录 SOURCE.md、LICENSE-CC0-POLYHAVEN.txt 与 manifest.json，并复制到 dist/licenses/ 与 dist/models/。模型未就绪时回退到程序化课桌椅。值班人、储物柜、门与建筑仍为项目原创程序化模型。
