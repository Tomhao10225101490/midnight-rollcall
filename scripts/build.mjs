import{createHash}from 'node:crypto';
import{auditFont}from './font-audit.mjs';
import ts from 'typescript';import fs from 'node:fs';import path from 'node:path';
fs.mkdirSync('dist',{recursive:true});for(const name of fs.readdirSync('src').filter(n=>n.endsWith('.ts'))){let source=fs.readFileSync('src/'+name,'utf8').replace("import './style.css';",'');const result=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022},reportDiagnostics:true});const errors=result.diagnostics||[];if(errors.length)throw Error(ts.formatDiagnosticsWithColorAndContext(errors,{getCanonicalFileName:x=>x,getCurrentDirectory:()=>process.cwd(),getNewLine:()=> '\n'}));fs.writeFileSync('dist/'+name.replace('.ts','.js'),result.outputText.replace(/from (['"])(\.\/[^'"]+)\1/g,(_,q,p)=>`from ${q}${p}.js${q}`))}fs.copyFileSync('src/style.css','dist/style.css');for(const name of ['three.module.js','three.core.js'])fs.copyFileSync('node_modules/three/build/'+name,'dist/'+name);fs.writeFileSync('dist/index.html',`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>末铃点名</title><link rel="stylesheet" href="./style.css"><script type="importmap">{"imports":{"three":"./three.module.js","three/addons/":"./addons/"}}</script><body><div id="ui"></div><script type="module" src="./main.js"></script></body></html>`);console.log('Built offline static WebGL game');
fs.mkdirSync('dist/licenses',{recursive:true});for(const [from,to] of [['node_modules/three/LICENSE','THREE-LICENSE.txt'],['node_modules/electron/LICENSE','ELECTRON-LICENSE.txt'],['node_modules/electron/dist/LICENSES.chromium.html','CHROMIUM-LICENSES.html']]){if(fs.existsSync(from))fs.copyFileSync(from,'dist/licenses/'+to)}fs.copyFileSync('LICENSE','dist/licenses/PROJECT-LICENSE.txt');

// Copy only the dependency closure of the post-processing modules, not unrelated example assets.
const addonRoot=path.resolve('node_modules/three/examples/jsm'),copied=new Set();
function copyAddon(name){const sourcePath=path.resolve(addonRoot,name);if(!sourcePath.startsWith(addonRoot+path.sep))throw Error('Addon path escapes root');if(copied.has(sourcePath))return;copied.add(sourcePath);const source=fs.readFileSync(sourcePath,'utf8'),relative=path.relative(addonRoot,sourcePath),target=path.join('dist/addons',relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,source);for(const match of source.matchAll(/(?:from|import)\s*['"](\.[^'"]+\.js)['"]/g))copyAddon(path.relative(addonRoot,path.resolve(path.dirname(sourcePath),match[1])))}
for(const name of ['EffectComposer','RenderPass','GTAOPass','UnrealBloomPass','OutputPass'])copyAddon('postprocessing/'+name+'.js');
copyAddon('loaders/GLTFLoader.js');
console.log('Bundled local post-processing modules:',copied.size);

console.log('Bundled font audit:',auditFont());fs.mkdirSync('dist/fonts',{recursive:true});fs.copyFileSync('assets/fonts/NotoSansSC-Regular.otf','dist/fonts/NotoSansSC-Regular.otf');fs.copyFileSync('assets/fonts/OFL.txt','dist/licenses/NOTO-OFL.txt');
fs.copyFileSync('assets/fonts/COPYRIGHT.txt','dist/licenses/NOTO-COPYRIGHT.txt');
fs.copyFileSync('assets/fonts/SOURCE.md','dist/licenses/NOTO-SOURCE.md');

// Local ending cue is an asset, not a runtime service or synthesis dependency.
if(createHash('sha256').update(fs.readFileSync('assets/GeneratedSFX/after_last_rollcall.wav')).digest('hex')!=='78b620040ae3a706ef6aee52c3a7bc4916d087c6fec17114513f074e5d27cbac')throw Error('Ending music asset hash mismatch');
fs.mkdirSync('dist/audio',{recursive:true});fs.copyFileSync('assets/GeneratedSFX/after_last_rollcall.wav','dist/audio/after_last_rollcall.wav');fs.copyFileSync('assets/GeneratedSFX/SOURCE.md','dist/licenses/ENDING-MUSIC-SOURCE.md');

const voiceManifest=JSON.parse(fs.readFileSync('assets/voice/manifest.json','utf8'));
fs.mkdirSync('dist/audio/voice',{recursive:true});
for(const [id,meta] of Object.entries(voiceManifest.files)){
 const file='assets/voice/'+meta.file;
 if(createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==meta.sha256)throw Error('Voice asset hash mismatch: '+id);
 fs.copyFileSync(file,'dist/audio/voice/'+meta.file);
}
fs.copyFileSync('assets/voice/SOURCE.md','dist/licenses/VOICE-SOURCE.md');
console.log('Bundled spoken lines:',Object.keys(voiceManifest.files).length);

const sfxManifest=JSON.parse(fs.readFileSync('assets/sfx/manifest.json','utf8'));
fs.mkdirSync('dist/audio/sfx',{recursive:true});
for(const [name,meta] of Object.entries(sfxManifest.files)){
 const file='assets/sfx/'+name;
 if(createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==meta.sha256)throw Error('Foley asset hash mismatch: '+name);
 fs.copyFileSync(file,'dist/audio/sfx/'+name);
}
fs.copyFileSync('assets/sfx/SOURCE.md','dist/licenses/FOLEY-SOURCE.md');
fs.copyFileSync('assets/sfx/LICENSE-KENNEY-IMPACT-SOUNDS.txt','dist/licenses/LICENSE-KENNEY-IMPACT-SOUNDS.txt');
fs.copyFileSync('assets/sfx/LICENSE-KENNEY-RPG-AUDIO.txt','dist/licenses/LICENSE-KENNEY-RPG-AUDIO.txt');
console.log('Bundled foley recordings:',Object.keys(sfxManifest.files).length);

const modelManifest=JSON.parse(fs.readFileSync('assets/models/manifest.json','utf8'));
function copyTree(from,to){
 fs.mkdirSync(to,{recursive:true});
 for(const name of fs.readdirSync(from)){
  const src=path.join(from,name),dest=path.join(to,name);
  if(fs.statSync(src).isDirectory())copyTree(src,dest);else fs.copyFileSync(src,dest);
 }
}
for(const [file,sha] of Object.entries(modelManifest.files)){
 const full='assets/models/'+file;
 if(createHash('sha256').update(fs.readFileSync(full)).digest('hex')!==sha)throw Error('Model asset hash mismatch: '+file);
}
copyTree('assets/models','dist/models');
fs.copyFileSync('assets/models/SOURCE.md','dist/licenses/MODELS-SOURCE.md');
fs.copyFileSync('assets/models/LICENSE-CC0-POLYHAVEN.txt','dist/licenses/LICENSE-CC0-POLYHAVEN.txt');
console.log('Bundled furniture models:',Object.keys(modelManifest.files).length);
