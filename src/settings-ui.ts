import{options,persist}from './settings';
export function settingsView(ui:HTMLElement,back:()=>void,apply:()=>void){
 ui.innerHTML=`<section class="settings-panel"><h2>操作与设置</h2><p class="controls">WASD 移动 · 鼠标/方向键观察 · Shift 奔跑 · Ctrl 潜行<br>E 互动 · H 藏身 · J 记录与提示 · Esc 暂停</p>
 <div class="setting-row"><label for="vol">总音量</label><input id="vol" type="range" min="0" max="1" step=".01"><output id="vol-value"></output></div>
 <div class="setting-row"><label for="sens">鼠标灵敏度</label><input id="sens" type="range" min="1" max="5" step=".1"><output id="sens-value"></output></div>
 <div class="setting-row"><label for="fov">视野角度</label><input id="fov" type="range" min="65" max="100" step="1"><output id="fov-value"></output></div>
 <div class="setting-row"><label for="quality">画面精细度</label><select id="quality"><option value="0.75">节能 · 0.75倍</option><option value="1">标准 · 1倍</option><option value="1.5">精细 · 1.5倍</option><option value="2">超清 · 2倍</option></select></div>
 <div class="setting-row"><label for="ao">接触阴影</label><select id="ao"><option value="on">开启</option><option value="off">关闭</option></select></div>
 <p class="setting-help">视野角度可按舒适程度调整。游戏无镜头晃动与刻意闪烁；高精细度会增加显卡负载。<br>奔跑会引起警戒。铃响12秒内，值班人停步听令，侧门开放。</p>
 <button id="full">全屏</button><button id="back">返回</button></section>`;
 const inputs=[['vol','volume'],['sens','sensitivity'],['fov','fov']] as const;
 for(const[id,key]of inputs){const input=ui.querySelector<HTMLInputElement>('#'+id)!,output=ui.querySelector<HTMLOutputElement>('#'+id+'-value')!;input.value=String(options[key]);const refresh=()=>{output.value=key==='volume'?Math.round(options[key]*100)+'%':key==='fov'?options[key]+'°':options[key].toFixed(1)};refresh();input.oninput=()=>{options[key]=Number(input.value);refresh();persist();apply()}}
 const ao=ui.querySelector<HTMLSelectElement>('#ao')!;ao.value=options.ambientOcclusion?'on':'off';ao.onchange=()=>{options.ambientOcclusion=ao.value==='on';persist();apply()};
 const quality=ui.querySelector<HTMLSelectElement>('#quality')!;quality.value=String(options.quality);quality.onchange=()=>{options.quality=Number(quality.value);persist();apply()};
 ui.querySelector<HTMLButtonElement>('#back')!.onclick=back;
 ui.querySelector<HTMLButtonElement>('#full')!.onclick=()=>{if(document.fullscreenElement)void document.exitFullscreen();else void document.documentElement.requestFullscreen()};
}
