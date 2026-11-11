import{tone}from './audio';import{circuitClue,circuitLabels,circuitSolved}from './puzzles';
export function codePanel(ui:HTMLElement,kind:'archive'|'radio',solved:()=>void,leave:()=>void){
 const archive=kind==='archive',answer=archive?'618':'731';
 ui.innerHTML=`<section class="device-panel ${kind}" aria-label="${archive?'档案柜控制面板':'广播控制面板'}"><div class="device-label">昭川中学 / ${archive?'年级档案保管':'校内广播系统'}</div><h2>${archive?'档案柜密码':'广播频率'}</h2><p class="device-instruction">${archive?'请输入三位座位尾号。登记次序见一班试卷，成绩与座次见二班登记。':'请输入三个频道编号。次序见办公室档案，编号见纪律室广播索引。'}</p><label for="code">${archive?'归档编号':'注销频道'}</label><input id="code" class="device-display" maxlength="3" inputmode="numeric" autocomplete="off" spellcheck="false" aria-label="密码" placeholder="— — —"><div class="device-keypad" aria-label="数字键盘">${[1,2,3,4,5,6,7,8,9,'清除',0,'退格'].map(n=>`<button type="button" data-digit="${n}" aria-label="${typeof n==='number'?'数字 '+n:n}">${n}</button>`).join('')}</div><p id="error" role="status" aria-live="polite">${archive?'档案柜锁定 · 等待核验':'广播待机 · 未发送'}</p><div class="device-actions"><button id="ok">确认</button><button id="cancel">离开</button></div><small>可用数字键输入 · Enter 确认 · Esc 离开</small></section>`;
 const input=ui.querySelector<HTMLInputElement>('#code')!,error=ui.querySelector<HTMLElement>('#error')!;
 const editing=()=>{error.textContent=archive?'档案柜锁定 · 等待核验':'广播待机 · 未发送'};
 const submit=()=>{if(input.value===answer){tone(620,.18);solved()}else{tone(130,.12);error.textContent=archive?'编号不符。请核对科目分数排序，再取座位尾号。':'频道不符。请核对办公室的顺序和纪律室的编号。';input.select()}};
 input.oninput=()=>{input.value=input.value.replace(/\D/g,'').slice(0,3);editing()};input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();submit()}};
 ui.querySelectorAll<HTMLButtonElement>('[data-digit]').forEach(b=>b.onclick=()=>{const digit=b.dataset.digit!;input.value=digit==='清除'?'':digit==='退格'?input.value.slice(0,-1):(input.value+digit).slice(0,3);editing();tone(260,.035);input.focus()});
 ui.querySelector<HTMLButtonElement>('#ok')!.onclick=submit;ui.querySelector<HTMLButtonElement>('#cancel')!.onclick=leave;input.focus();
}
export function circuitPanel(ui:HTMLElement,solved:()=>void,leave:()=>void){
 const bits=[false,false,false,false];
 ui.innerHTML='<section class="device-panel power"><div class="device-label">昭川中学 / 侧门联锁</div><h2>侧门配电箱</h2><p class="device-instruction">根据已接收的广播，设置四条回路。灯亮表示通电。</p><div id="breakers" class="circuit-grid"></div><details class="circuit-record"><summary>查看已接收的广播记录</summary><p></p></details><p id="error" role="status" aria-live="polite">联锁待检 · 通行证尚未签发</p><div class="device-actions"><button id="power">检查并领取通行证</button><button id="cancel">暂时离开</button></div><small>点击开关或用 Tab / 空格操作 · Esc 离开</small></section>';
 ui.querySelector('.circuit-record p')!.textContent=circuitClue;
 const grid=ui.querySelector('#breakers')!;
 for(const [i,label]of circuitLabels.entries()){const button=document.createElement('button');button.type='button';button.dataset.breaker=String(i);const update=()=>{button.setAttribute('aria-pressed',String(bits[i]));button.innerHTML=`<span class="circuit-number">0${i+1}</span><span class="circuit-name">${label}</span><span class="circuit-switch" aria-hidden="true"></span><span class="circuit-state">${bits[i]?'通电':'断开'}</span>`};button.onclick=()=>{bits[i]=!bits[i];tone(bits[i]?350:170,.08);update();ui.querySelector('#error')!.textContent='回路已调整 · 请重新检查联锁'};update();grid.append(button)}
 ui.querySelector<HTMLButtonElement>('#power')!.onclick=()=>{if(circuitSolved(bits))solved();else{tone(90,.18);ui.querySelector('#error')!.textContent='联锁未通过。请展开广播记录，逐项核对保留和断开的回路。'}};
 ui.querySelector<HTMLButtonElement>('#cancel')!.onclick=leave;
}
