import{floorMap}from './floor-map';
import{clues,type ClueId}from './clues';import{records}from './puzzles';import{hintSteps}from './hints';
export function notebookView(ui:HTMLElement,stage:number,notes:ClueId[],close:()=>void,storyRecords:{title:string;text:string}[]=[],position:[number,number]=[0,-19]){
 const titles=['值班规则','一班试卷','办公室档案','广播记录','侧门通行证'];
 const entries=records.slice(0,stage+1).map((text,i)=>({title:titles[i],text}));
 entries.push(...clues.filter(c=>notes.includes(c.id)).map(c=>({title:c.name,text:c.text})));
 ui.innerHTML='<section class="notebook-panel"><h2>随身记录</h2><nav aria-label="已收集记录"></nav><article><h3 id="record-title"></h3><div id="record-text"></div></article><aside><button id="hint-button">需要一点提示</button><p id="hint-text" aria-live="polite"></p></aside><button id="close-book">返回探索</button></section>';
 entries.push(...storyRecords);
 const nav=ui.querySelector('nav')!,title=ui.querySelector('#record-title')!,text=ui.querySelector('#record-text')!;
 const select=(i:number)=>{title.textContent=entries[i].title;text.textContent=entries[i].text;Array.from(nav.children).forEach((button,n)=>button.setAttribute('aria-pressed',String(i===n)))};
 entries.forEach((entry,i)=>{const button=document.createElement('button');button.textContent=entry.title;button.onclick=()=>select(i);nav.append(button)});select(entries.length-1);
 const map=document.createElement('button');map.textContent='楼层示意图';map.onclick=()=>{title.textContent='昭川中学 · 教学楼疏散图';text.innerHTML=floorMap(...position);Array.from(nav.children).forEach(button=>button.setAttribute('aria-pressed',String(button===map)))};nav.append(map);
 let level=0;const hint=ui.querySelector<HTMLButtonElement>('#hint-button')!;hint.onclick=()=>{ui.querySelector('#hint-text')!.textContent=hintSteps[stage][Math.min(level++,2)];hint.textContent=level>=3?'显示完整提示':'再具体一点'};
 ui.querySelector<HTMLButtonElement>('#close-book')!.onclick=close;
}
