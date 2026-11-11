import {codePanel,circuitPanel} from './puzzle-ui';
import {architecturalDetails} from './architecture';
import {Narrative} from './narrative';
const narrative=new Narrative();
import {HidingSpot} from './hiding';
import {storageCabinet} from './furniture';
import{Rendering}from './rendering';
import{settingsView}from './settings-ui';
import{notebookView}from './notebook-ui';
import{batchStaticBoxes}from './batching';
import{clues,type ClueId}from './clues';
import{station}from './stations';
import{initDoors,nearestDoor,resetDoors}from './doors';
import {Ending} from './ending';
import {props} from './props';
import {Player} from './player';
import {circuitClue,records} from './puzzles';
import { Score } from './score';
import { upgradeMaterials } from './materials';
const score = new Score();
import { decorate } from './decor';
import { options, persist } from './settings';
import * as T from 'three';
import './style.css';
import { scene, init, clear, visible, box, label, walls } from './world';
import { Enemy } from './enemy';
import { read, save } from './save';
import { tone, effect, measureEffects, setVolume, broadcast, stopSpeech, pauseAudio, resumeAudio } from './audio';
init();
decorate();props();initDoors();architecturalDetails(scene,walls);
upgradeMaterials(scene);batchStaticBoxes(scene);
setVolume(options.volume);
const renderer = new T.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(options.quality);
document.body.append(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
const camera = new T.PerspectiveCamera(options.fov, innerWidth / innerHeight, .1, 60);
const rendering=new Rendering(renderer,scene,camera);rendering.configure(options.ambientOcclusion);
camera.rotation.order = 'YXZ';const player=new Player(camera);const ending=new Ending();camera.position.set(0,1.65,-19);camera.rotation.y=Math.PI;
let closeOverlay:(()=>void)|null=null;let enemyStride=0;let notes:ClueId[]=[];let doorNoise=0;let enemy = new Enemy(), stage = 0, playing = false, hidden = false, alert = 0, time = 0, sens = options.sensitivity / 1000, last = 0, step = 0;
const keys = new Set<string>(), ui = document.querySelector<HTMLElement>('#ui')!;
const names = ['阅读一班试卷', '打开办公室档案柜', '校准广播频率', '修复侧门配电并领取通行证', '趁铃声离开出口'];
const points = [[-8, -19], [-8, -8], [-8, 3], [-8, 13], [8, 18]];
points.forEach((p, i) => station(i,p[0],p[1]));
clues.forEach(c=>station(0,c.x,c.z));
function nearbyClue(){return clues.find(c=>Math.hypot(camera.position.x-c.x,camera.position.z-c.z)<2.2)}
const hidingSpot=new HidingSpot();walls.push(hidingSpot.bounds);
const hideCabinet=storageCabinet();hideCabinet.position.set(8,0,-7);scene.add(hideCabinet);
const hideSign=label('储物柜 · H 藏身',8,-6.49);hideSign.position.y=1.88;hideSign.position.z=-6.46;hideSign.scale.set(.5,.22,1);
function menu(title = '末铃点名', text = '昭川中学 · 第零次晚自习。你的名字仍在广播名单上。') { closeOverlay=null;score.pause(); playing = false; document.exitPointerLock(); ui.innerHTML = `<section><h1>${title}</h1><p>${text}</p><p>虚构校园恐怖，无血腥。建议低音量；无镜头晃动与闪烁。</p><button id="new">新游戏</button><button id="load">继续游戏</button><button id="settings">设置 / 操作</button><button id="quit">退出</button></section>`; document.querySelector<HTMLElement>('#new')!.onclick = () => start(0); document.querySelector<HTMLElement>('#load')!.onclick = () => {const checkpoint=read();start(checkpoint?.stage||0,checkpoint?.notes||[])}; document.querySelector<HTMLElement>('#settings')!.onclick = ()=>settings(); document.querySelector<HTMLElement>('#quit')!.onclick = () => window.close(); }
function settings(back:()=>void=()=>menu()){closeOverlay=back;settingsView(ui,back,()=>{setVolume(options.volume);sens=options.sensitivity/1000;renderer.setPixelRatio(options.quality);rendering.configure(options.ambientOcclusion);camera.fov=options.fov;camera.updateProjectionMatrix()})}
function announce(text:string){narrative.defer();broadcast(text)}
function start(s: number,restoredNotes:ClueId[]=[]) { notes=[...restoredNotes]; enemyStride=0;resetDoors();doorNoise=0; ending.reset(); player.reset();hidingSpot.reset();narrative.reset(s===0?"你叫林序。晚自习结束后，整栋楼只剩下你的名字。校门没有打开。":"你回到了走廊。已记录的线索仍在，按 J 回看。"); announce(s===0?"林序同学，晚自习结束。请安静行走。请到一班检查遗留试卷。":"检查点已恢复。当前任务："+names[s]+"。按J查看已经收集的记录。"); stage = s; save(stage,notes); camera.position.set(0, 1.65, -19); camera.rotation.set(0, Math.PI, 0); enemy.body.position.set(0, 1, 15); enemy.memory = 0; enemy.wasHidden=false; enemy.sawHide=false; enemy.path = []; enemy.timer = 0; enemy.index = 0; alert = 0; hidden = false; time = 0; resume(); }
function resume() { closeOverlay=null;resumeAudio(); score.start(); playing = true; keys.clear(); renderer.domElement.requestPointerLock(); tone(440); }
function pausedMenu(){closeOverlay=resume;ui.innerHTML='<section><h2>暂停</h2><button id="resume">恢复</button><button id="paused-settings">设置 / 操作</button><button id="menu">主菜单</button></section>';ui.querySelector<HTMLButtonElement>('#resume')!.onclick=resume;ui.querySelector<HTMLButtonElement>('#paused-settings')!.onclick=()=>settings(pausedMenu);ui.querySelector<HTMLButtonElement>('#menu')!.onclick=()=>menu()}
function pause(){if(!playing)return;pauseAudio();score.pause();playing=false;keys.clear();document.exitPointerLock();pausedMenu()}
function interact() { const door=nearestDoor(camera.position);if(door){door.set(!door.open);doorNoise=1;effect('door');return} const clue=nearbyClue();if(clue){show(clue.text,()=>{if(!notes.includes(clue.id))notes.push(clue.id);save(stage,notes);resume()});return} const p = points[stage]; if (!p || Math.hypot(camera.position.x - p[0], camera.position.z - p[1]) > 2.4)
    return; if (stage === 0) {
    show(records[1], () => advance());
    return;
 } if (stage === 1 || stage === 2) {
    score.pause();pauseAudio();playing=false;closeOverlay=resume;document.exitPointerLock();
    codePanel(ui,stage===1?'archive':'radio',()=>show(stage===1?records[2]:circuitClue,advance),resume);return;
} if (stage === 3) {
    score.pause();pauseAudio();playing=false;closeOverlay=resume;document.exitPointerLock();circuitPanel(ui,advance,resume);return;
} if (stage === 4) {
    if (time % 60 < 12) {ending.begin(camera);menu('天亮之前', '你走出了昭川中学。最后一声点名消散在晨雾里。没有人应答。');broadcast('本次点名结束。你的名字，已从名单中划去。');}
    return;
} advance(); }
function advance() { stage++; save(stage,notes); tone(660, .4); resume(); }
function show(text: string, next: () => void) { closeOverlay=next;narrative.clearSubtitle();score.pause(); announce(text); playing = false; document.exitPointerLock(); ui.innerHTML = `<section class="record-panel"><div class="record-stamp">昭川中学 · 留存件</div><h2>校园记录</h2><p>${text}</p><button id="ok">记下并继续</button></section>`; document.querySelector<HTMLElement>('#ok')!.onclick = next; }
function notebook(){pauseAudio();score.pause();playing=false;document.exitPointerLock();closeOverlay=resume;notebookView(ui,stage,notes,resume,narrative.records)}
addEventListener('keydown', e => {if(playing&&e.code.startsWith('Arrow'))e.preventDefault(); if(playing&&!e.repeat&&e.code==='KeyJ')notebook(); if (playing && ['Control', ' '].includes(e.key))
    e.preventDefault(); keys.add(e.code); if(e.code==='Escape'){e.preventDefault();if(closeOverlay)closeOverlay();else pause()} if (playing && !e.repeat && e.code === 'KeyE')
    interact(); if(playing&&!e.repeat&&e.code==='KeyH'){if(hidden){hidingSpot.leave(camera);hidden=false;effect('door',.3)}else if(hidingSpot.enter(camera)){hidden=true;effect('door',.3)}} });
addEventListener('keyup', e => keys.delete(e.code));
addEventListener('blur', pause);
document.addEventListener('pointerlockchange', () => { if (!document.pointerLockElement)
    pause(); });
addEventListener('mousemove', e => { if (playing && document.pointerLockElement) {
    camera.rotation.y -= e.movementX * sens;
    camera.rotation.x = T.MathUtils.clamp(camera.rotation.x - e.movementY * sens, -1.4, 1.4);
} });
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight);rendering.resize(); });
function frame(ms: number) { requestAnimationFrame(frame); const dt = Math.min((ms - last) / 1000, .05); last = ms; ending.update(dt,camera); if (playing) {
    camera.rotation.y+=((keys.has('ArrowLeft')?1:0)-(keys.has('ArrowRight')?1:0))*dt*1.4;camera.rotation.x=T.MathUtils.clamp(camera.rotation.x+((keys.has('ArrowUp')?1:0)-(keys.has('ArrowDown')?1:0))*dt*1.1,-1.4,1.4);
    doorNoise=Math.max(0,doorNoise-dt);score.update(dt, enemy.state === '追逐', options.volume,stage);
    const before = time;
    time += dt;
    if (Math.floor(before / 60) !== Math.floor(time / 60)) {
        narrative.clearSubtitle();effect('bell');
        announce("铃声期间，侧门开放十二秒。值班人员原地听令。请保持距离。");
    }
    hidingSpot.constrain(camera);
    const {run,crouch,moving,footstep}=player.update(dt,keys,hidden);if(footstep)effect('step',crouch?.18:run?.7:.45);
    alert = T.MathUtils.clamp(alert + dt * (run && moving ? 4 : -1), 0, 100);
    const story=narrative.update(dt,stage,camera.position.x,camera.position.z,hidden||enemy.state==='追逐'||time%60<12||('speechSynthesis' in window&&speechSynthesis.speaking));
    if(story){if(story.kind==='radio')broadcast(story.text);else{const dx=story.x-camera.position.x,dz=story.z-camera.position.z,distance=Math.hypot(dx,dz);effect(story.kind,.3,(Math.cos(camera.rotation.y)*dx-Math.sin(camera.rotation.y)*dz)/Math.max(1,distance),true)}}
    const oldEnemy=enemy.body.position.clone();
    if (enemy.update(dt, hidingSpot.target(camera), (run && moving)||doorNoise>0, hidden, alert, time % 60 < 12)) {
        tone(65, 1);
        menu('点名未结束', '值班人将你带回了座位。可继续检查点或重新开始。');
    }
    else
        ui.innerHTML = `<div class="hud">末铃点名 · ${names[stage]}<br>纪律 ${Math.round(alert)} · ${time % 60 < 12 ? '铃响：侧门开放' : '下次铃声 ' + Math.ceil(60 - time % 60) + '秒'}<br>随身记录：${['空', '已记下试卷', '频率档案', '广播已解除', '侧门通行证'][stage]}<br>${hidden ? (enemy.sawHide?'藏身被目击！值班人正在搜查 · H 离开':'已藏身 · H 离开') : ''}</div><div class="cross">·</div><div class="bottom">${narrative.subtitle || (stage === 0 ? '广播：请到一班检查遗留试卷。' : stage === 1 ? '试卷已收好。先核对二班登记，再前往办公室；J键回看线索。' : stage === 2 ? '档案已收好。去纪律室查找频道索引，再到广播室；J键回看线索。' : stage === 3 ? '广播：空白名单已接收，领取侧门通行证。' : '等铃声响起，前往东侧出口。')}<br>${nearbyClue()?'【E】阅读'+nearbyClue()!.name:Math.hypot(camera.position.x - points[stage][0], camera.position.z - points[stage][1]) < 2.4 ? '【E】' + names[stage] : nearestDoor(camera.position)?'【E】'+(nearestDoor(camera.position)!.open?'关门（会发出声音）':'开门（会发出声音）'):'靠近设备查看互动提示'} · ${hidden?'H 离开储物柜':hidingSpot.canEnter(camera.position)?'H 藏入储物柜（被目击会遭搜查）':'藏身点：储物间铁柜'} · J 线索记录</div>`;
    enemyStride+=enemy.body.position.distanceTo(oldEnemy);
    if(playing&&enemyStride>1.25){enemyStride=0;const dx=enemy.body.position.x-camera.position.x,dz=enemy.body.position.z-camera.position.z,distance=Math.hypot(dx,dz);effect('step',Math.max(0,1-distance/18)*.55,(Math.cos(camera.rotation.y)*dx-Math.sin(camera.rotation.y)*dz)/Math.max(1,distance),!visible(camera.position,enemy.body.position));}
} rendering.render(); }
menu();
requestAnimationFrame(frame);
// Opt-in read-only telemetry for automated keyboard-driven traversal. No state mutation.
if (new URLSearchParams(location.search).has('qa'))
    Object.defineProperty(window, 'rollcallQA', { get: () => Object.freeze({ stage, notes:[...notes], storyRecords:narrative.records.map(r=>r.text), subtitle:narrative.subtitle, playing, hidden, hideAvailable:hidingSpot.canEnter(camera.position), alert, time, fov:camera.fov,pixelRatio:renderer.getPixelRatio(),ambientOcclusion:rendering.enabled,audio:score.measure(),effects:measureEffects(), position: camera.position.toArray(), yaw: camera.rotation.y,pitch:camera.rotation.x, enemy: enemy.body.position.toArray(), enemyState: enemy.state, door:nearestDoor(camera.position)?{open:nearestDoor(camera.position)!.open}:null, render:{calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures} }) });
