// Component-only UI checks. Directly mounts panels; never counted as a player playthrough.
import{_electron as electron}from '@playwright/test';import assert from 'node:assert/strict';import fs from 'node:fs';
const app=await electron.launch({executablePath:'node_modules/electron/dist/Electron.app/Contents/MacOS/Electron',args:['.'],env:{...process.env,ROLLCALL_QA:'1'}});
try{const p=await app.firstWindow(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.getByRole('button',{name:'新游戏',exact:true}).waitFor();fs.mkdirSync('artifacts',{recursive:true});
 for(const width of [1280,800]){await app.evaluate(({BrowserWindow},width)=>BrowserWindow.getAllWindows()[0].setSize(width,width===800?600:800),width);
 for(const kind of ['archive','radio','power']){
 await p.evaluate(async kind=>{const {codePanel,circuitPanel}=await import('./puzzle-ui.js');const ui=document.querySelector('#ui');ui.dataset.solved='false';const solve=()=>{ui.dataset.solved='true'};if(kind==='power')circuitPanel(ui,solve,()=>{});else codePanel(ui,kind,solve,()=>{})},kind);
 if(kind!=='power'){await p.locator('#code').fill('999');await p.locator('#code').press('Enter');assert.match(await p.locator('#error').innerText(),/不符/);await p.getByRole('button',{name:'清除',exact:true}).click();assert.doesNotMatch(await p.locator('#error').innerText(),/不符/);for(const n of kind==='archive'?[6,1,8]:[7,3,1])await p.getByRole('button',{name:'数字 '+n,exact:true}).click();await p.locator('#code').press('Enter')}
 else{await p.locator('[data-breaker="0"]').focus();await p.keyboard.press('Space');await p.locator('[data-breaker="2"]').click();await p.locator('summary').click();await p.locator('#power').click()}
 assert.equal(await p.locator('#ui').getAttribute('data-solved'),'true');const button=p.locator('#cancel');await button.scrollIntoViewIfNeeded();const box=await button.boundingBox(),height=await p.evaluate(()=>innerHeight);assert.ok(box.y>=0&&box.y+box.height<=height);await p.screenshot({path:`artifacts/panel-${kind}-${width}.png`});
 }}assert.deepEqual(errors,[]);console.log('PASS component-only panels 1280/800, keypad, Enter, Space, editable errors, scrollable controls; not gameplay-route evidence');
}finally{await app.close()}
