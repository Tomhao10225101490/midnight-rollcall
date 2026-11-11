import {circuitLabels,circuitClue,circuitSolved,records} from './puzzles';
import { Score } from './score';
import { upgradeMaterials } from './materials';
const score = new Score();
import { decorate } from './decor';
import { options, persist } from './settings';
import * as T from 'three';
import './style.css';
import { scene, init, clear, box, label } from './world';
import { Enemy } from './enemy';
import { read, save } from './save';
import { tone, setVolume, broadcast, stopSpeech, pauseAudio, resumeAudio } from './audio';
init();
decorate();
upgradeMaterials(scene);
setVolume(options.volume);
const renderer = new T.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(options.quality);
document.body.append(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
const camera = new T.PerspectiveCamera(75, innerWidth / innerHeight, .1, 60);
camera.rotation.order = 'YXZ';
let enemy = new Enemy(), stage = 0, playing = false, hidden = false, alert = 0, time = 0, sens = options.sensitivity / 1000, last = 0, step = 0;
const keys = new Set<string>(), ui = document.querySelector<HTMLElement>('#ui')!;
const names = ['阅读一班试卷', '打开办公室档案柜', '校准广播频率', '修复侧门配电并领取通行证', '趁铃声离开出口'];
const points = [[-8, -19], [-8, -8], [-8, 3], [-8, 13], [8, 18]];
points.forEach((p, i) => { box(p[0], .7, p[1], 1, 1.4, 1, i === 4 ? '#596c56' : '#b29156'); label(['试卷：按分数从低到高排列 语文3 数学1 英语2', '档案柜：输入学科顺序（数学英语语文）', '广播台：档案写着频率 731', '通行证：完成广播后领取', '校门：铃响期间开放'][i], p[0], p[1] - .6); });
box(8, 1, -7, 2, 2, 1, '#40535a');
label('藏身柜 H · 被目击藏入会被搜查', 8, -8);
function menu(title = '末铃点名', text = '昭川中学 · 第零次晚自习。你的名字仍在广播名单上。') { score.pause(); playing = false; document.exitPointerLock(); ui.innerHTML = `<section><h1>${title}</h1><p>${text}</p><p>虚构校园恐怖，无血腥。建议低音量；无镜头晃动与闪烁。</p><button id="new">新游戏</button><button id="load">继续游戏</button><button id="settings">设置 / 操作</button><button id="quit">退出</button></section>`; document.querySelector<HTMLElement>('#new')!.onclick = () => start(0); document.querySelector<HTMLElement>('#load')!.onclick = () => start(read()?.stage || 0); document.querySelector<HTMLElement>('#settings')!.onclick = settings; document.querySelector<HTMLElement>('#quit')!.onclick = () => window.close(); }
function settings() { ui.innerHTML = '<section><h2>操作与设置</h2><p>WASD 移动 · 鼠标观察 · Shift 奔跑 · Ctrl 潜行 · E 互动 · H 藏身 · Esc 暂停。奔跑增加纪律值；安静移动降低纪律值。每60秒响铃，开放出口12秒并减慢巡逻。</p><p>音量 <input id="vol" type="range" min="0" max="1" step=".01" value=".3"></p><p>灵敏度 <input id="sens" type="range" min="1" max="5" value="2"></p><button id="quality">切换低画质</button><button id="full">全屏</button><button id="back">返回</button></section>'; (document.querySelector<HTMLElement>('#vol') as HTMLInputElement).value = String(options.volume); (document.querySelector<HTMLElement>('#sens') as HTMLInputElement).value = String(options.sensitivity); document.querySelector<HTMLElement>('#vol')!.oninput = e => { options.volume = +(e.target as HTMLInputElement).value; setVolume(options.volume); persist(); }; document.querySelector<HTMLElement>('#sens')!.oninput = e => { options.sensitivity = +(e.target as HTMLInputElement).value; sens = options.sensitivity / 1000; persist(); }; document.querySelector<HTMLElement>('#quality')!.onclick = () => { options.quality = options.quality === 1 ? .75 : 1; renderer.setPixelRatio(options.quality); persist(); }; document.querySelector<HTMLElement>('#full')!.onclick = () => document.documentElement.requestFullscreen(); document.querySelector<HTMLElement>('#back')!.onclick = () => menu(); }
function start(s: number) { broadcast("晚自习结束。请安静行走。请到一班检查遗留试卷。"); stage = s; save(stage); camera.position.set(0, 1.65, -19); camera.rotation.set(0, Math.PI, 0); enemy.body.position.set(0, 1, 15); enemy.memory = 0; enemy.wasHidden=false; enemy.sawHide=false; enemy.path = []; enemy.timer = 0; enemy.index = 0; alert = 0; hidden = false; time = 0; resume(); }
function resume() { resumeAudio(); score.start(); playing = true; keys.clear(); renderer.domElement.requestPointerLock(); tone(440); }
function pause() { if (!playing)
    return; pauseAudio(); score.pause(); playing = false; keys.clear(); document.exitPointerLock(); ui.innerHTML = '<section><h2>暂停</h2><button id="resume">恢复</button><button id="menu">主菜单</button></section>'; document.querySelector<HTMLElement>('#resume')!.onclick = resume; document.querySelector<HTMLElement>('#menu')!.onclick = () => menu(); }
function interact() { const p = points[stage]; if (!p || Math.hypot(camera.position.x - p[0], camera.position.z - p[1]) > 2.4)
    return; if (stage === 0) {
    show('试卷背面：分数低者先离校。数学1、英语2、语文3。办公室密码为123。', () => advance());
    return;
} if (stage === 1 || stage === 2) {
    score.pause();
    playing = false;
    document.exitPointerLock();
    const code = stage === 1 ? '123' : '731';
    ui.innerHTML = `<section><h2>${stage === 1 ? '档案柜密码' : '广播频率'}</h2><input id="code" maxlength="3" aria-label="密码"><button id="ok">确认</button><button id="cancel">离开</button><p id="error"></p></section>`;
    document.querySelector<HTMLElement>('#ok')!.onclick = () => { if ((document.querySelector<HTMLElement>('#code') as HTMLInputElement).value === code) {
        if (stage === 1)
            show('档案：将广播调到731，播放空白名单。', advance);
        else
            show(circuitClue, advance);
    }
    else
        document.querySelector<HTMLElement>('#error')!.textContent = '不正确，请核对试卷或档案。'; };
    document.querySelector<HTMLElement>('#cancel')!.onclick = resume;
    return;
} if (stage === 3) {
    score.pause(); playing=false; document.exitPointerLock(); const bits=[false,false,false,false];
    ui.innerHTML=`<section><h2>侧门配电箱</h2><p>${circuitClue}</p><div id="breakers"></div><p id="error">合闸前核对广播记录。</p><button id="power">检查并领取通行证</button><button id="cancel">暂时离开</button></section>`;
    const redraw=()=>{document.querySelector<HTMLElement>('#breakers')!.innerHTML=circuitLabels.map((n,i)=>`<button data-breaker="${i}" aria-pressed="${bits[i]}">${n}：${bits[i]?'通电':'断开'}</button>`).join('');document.querySelectorAll<HTMLButtonElement>('[data-breaker]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.breaker);bits[i]=!bits[i];tone(bits[i]?350:170);redraw()})};redraw();
    document.querySelector<HTMLElement>('#power')!.onclick=()=>{if(circuitSolved(bits))advance();else{tone(90,.3);document.querySelector<HTMLElement>('#error')!.textContent='回路仍不正确：照明和门锁需要电源，点名和循环铃线必须断开。'}};
    document.querySelector<HTMLElement>('#cancel')!.onclick=resume; return;
} if (stage === 4) {
    if (time % 60 < 12)
        menu('天亮之前', '你走出了昭川中学。最后一声点名消散在晨雾里。没有人应答。');
    return;
} advance(); }
function advance() { stage++; save(stage); tone(660, .4); resume(); }
function show(text: string, next: () => void) { score.pause(); broadcast(text); playing = false; document.exitPointerLock(); ui.innerHTML = `<section><h2>校园记录</h2><p>${text}</p><button id="ok">记下并继续</button></section>`; document.querySelector<HTMLElement>('#ok')!.onclick = next; }
function notebook(){show(records.slice(0,stage+1).join('\n\n'),resume)}
addEventListener('keydown', e => { if(playing&&!e.repeat&&e.code==='KeyJ')notebook(); if (['Control', ' '].includes(e.key))
    e.preventDefault(); keys.add(e.code); if (e.code === 'Escape')
    pause(); if (playing && !e.repeat && e.code === 'KeyE')
    interact(); if (playing && !e.repeat && e.code === 'KeyH' && Math.hypot(camera.position.x - 8, camera.position.z + 7) < 2.6)
    hidden = !hidden; });
addEventListener('keyup', e => keys.delete(e.code));
addEventListener('blur', pause);
document.addEventListener('pointerlockchange', () => { if (!document.pointerLockElement)
    pause(); });
addEventListener('mousemove', e => { if (playing && document.pointerLockElement) {
    camera.rotation.y -= e.movementX * sens;
    camera.rotation.x = T.MathUtils.clamp(camera.rotation.x - e.movementY * sens, -1.4, 1.4);
} });
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
function frame(ms: number) { requestAnimationFrame(frame); const dt = Math.min((ms - last) / 1000, .05); last = ms; if (playing) {
    score.update(dt, enemy.state === '追逐', options.volume);
    const before = time;
    time += dt;
    if (Math.floor(before / 60) !== Math.floor(time / 60)) {
        tone(880, 2);
        broadcast("铃声期间，侧门开放十二秒。请勿奔跑。");
    }
    const run = keys.has('ShiftLeft'), crouch = keys.has('ControlLeft');
    const v = new T.Vector3(Number(keys.has('KeyD')) - Number(keys.has('KeyA')), 0, Number(keys.has('KeyS')) - Number(keys.has('KeyW'))).normalize().applyAxisAngle(new T.Vector3(0, 1, 0), camera.rotation.y);
    const moving = v.length() > 0 && !hidden;
    const speed = crouch ? 1.4 : run ? 4 : 2.5;
    if (moving) {
        const p = camera.position, x = p.x + v.x * speed * dt, z = p.z + v.z * speed * dt;
        if (clear(x, p.z))
            p.x = x;
        if (clear(p.x, z))
            p.z = z;
        step += dt;
        if (step > (run ? .28 : .55)) {
            tone(crouch ? 70 : 100, .07);
            step = 0;
        }
    }
    camera.position.y = hidden ? .8 : crouch ? 1 : 1.65;
    alert = T.MathUtils.clamp(alert + dt * (run && moving ? 4 : -1), 0, 100);
    if (enemy.update(dt, camera.position, run && moving, hidden, alert, time % 60 < 12)) {
        tone(65, 1);
        menu('点名未结束', '值班人将你带回了座位。可继续检查点或重新开始。');
    }
    else
        ui.innerHTML = `<div class="hud">末铃点名 · ${names[stage]}<br>纪律 ${Math.round(alert)} · ${time % 60 < 12 ? '铃响：侧门开放' : '下次铃声 ' + Math.ceil(60 - time % 60) + '秒'}<br>随身记录：${['空', '已记下试卷', '频率档案', '广播已解除', '侧门通行证'][stage]}<br>${hidden ? (enemy.sawHide?'藏身被目击！值班人正在搜查 · H 离开':'已藏身 · H 离开') : ''}</div><div class="cross">·</div><div class="bottom">${stage === 0 ? '广播：请到一班检查遗留试卷。' : stage === 1 ? '线索：数学1 英语2 语文3；办公室在一班北侧。' : stage === 2 ? '档案记录：广播频率731。' : stage === 3 ? '广播：空白名单已接收，领取侧门通行证。' : '等铃声响起，前往东侧出口。'}<br>${Math.hypot(camera.position.x - points[stage][0], camera.position.z - points[stage][1]) < 2.4 ? '【E】' + names[stage] : '寻找金色任务台'} · H 储物间躲藏 · J 线索记录</div>`;
} renderer.render(scene, camera); }
menu();
requestAnimationFrame(frame);
// Opt-in read-only telemetry for automated keyboard-driven traversal. No state mutation.
if (new URLSearchParams(location.search).has('qa'))
    Object.defineProperty(window, 'rollcallQA', { get: () => Object.freeze({ stage, playing, hidden, alert, time, position: camera.position.toArray(), yaw: camera.rotation.y, enemy: enemy.body.position.toArray(), enemyState: enemy.state }) });
