# 资产与第三方软件许可
原创源码、程序化几何（校园、人物、道具）、自适应合成配乐及材质生成算法由本项目制作，使用项目MIT许可。没有购买或下载外部模型、照片、音乐及语音素材。

Three.js 0.187.0：MIT，运行时渲染依赖，包括 EffectComposer、GTAOPass、OutputPass 及其递归依赖的 addons 模块；保留上游源码头部。完整许可随构建放在dist/licenses/THREE-LICENSE.txt。
Electron 43.8.8：MIT，包含Chromium及其他各自许可的第三方组件。完整Electron许可和Chromium许可清单随桌面资源附带在dist/licenses/。
TypeScript、Vite和electron-builder：构建工具，MIT。Playwright：测试工具，Apache-2.0。版本及全部传递依赖锁定在package-lock.json，包内保留上游许可。

0.5及以前仅使用系统字体。0.6开发版新增随包携带的Noto Sans SC Regular，保留原始OTF、SIL OFL 1.1许可及Adobe版权元数据，未修改字体。原始来源、固定提交、大小与SHA256见assets/fonts/SOURCE.md；许可、版权与来源同时复制到dist/licenses/NOTO-*。字体属于第三方作品，不使用本项目MIT许可。语音仅调用运行时可用的本机中文离线语音，不下载、导出或再分发系统语音资产；必要线索同时显示为字幕。

音效实现 `src/sfx.ts`：脚步、门轴/门闩、机械校铃、广播提示全部由本项目的确定性波形与噪声合成，遵循项目MIT许可，无外部采样。`src/score.ts`的拨弦、缓起弦音、环境底音与混响响应亦在本机生成。

`src/furniture.ts`的课桌、钢架课椅和储物铁柜为本项目原创共享几何。`src/strings.ts`为本项目实现的阻尼弦波导合成器，激励噪声本地生成，不含录音或音色库。

0.5开发版新增三次轻敲音效由同一原创波形合成模块产生；虚构角色林序及途中叙事文本为本项目原创。

`src/architecture.ts`包含原创双管荧光灯、暖气片、管路阀门和校钟几何，使用共享网格实例化，无外部模型或纹理。

`src/windows.ts`的闭合窗户几何与磨砂纹理、`src/decor.ts`的档案柜细节和分类牌为本项目原创程序化资产，无外部素材。

`src/composition.ts`的五段探索乐句与追逐动机为本项目原创编排，以程序合成音色播放，无外部录音或曲谱引用。

architectural-surfaces.ts 的抹灰和水磨石颜色、凹凸及粗糙度均由本项目原创算法生成，遵循项目 MIT 许可，无第三方照片或扫描材质。

`src/door-model.ts`的木框、压条、把手、锁孔、踢脚板和合页为原创程序化模型，按材质合并并共享，无外部模型素材。
