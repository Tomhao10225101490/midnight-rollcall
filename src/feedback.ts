export function threatCue(state:string,hidden:boolean,sawHide:boolean){
 if(hidden&&sawHide)return{level:'danger',text:'藏身已被目击 · 值班人正在搜查'};
 if(state==='追逐')return{level:'danger',text:'值班人正在追查动静 · 利用转角遮挡视线'};
 if(state==='搜索')return{level:'caution',text:'值班人仍在搜索 · 安静离开刚才的位置'};
 return null;
}
/** A short, skippable outcome beat, driven by the game loop rather than timers. */
export class Defeat{
 active=false;elapsed=0;private layer:HTMLElement|null=null;
 constructor(private ui:HTMLElement,private done:()=>void){}
 begin(){this.active=true;this.elapsed=0;this.ui.innerHTML='<div class="capture-scene"><div class="capture-card"><div class="capture-stamp">离校复核 / 未通过</div><p class="capture-quote">“林序，你的名字还在名单上。”</p><p>走廊的脚步停在了你面前。<br>值班人合上记录夹，示意你回到座位。</p><button id="skip-capture">跳过 · 查看结果</button><small>Esc 跳过 · 检查点会保留已完成的谜题</small></div></div>';this.layer=this.ui.querySelector('.capture-scene');this.ui.querySelector<HTMLButtonElement>('#skip-capture')!.onclick=()=>this.finish()}
 update(dt:number,focused:boolean){if(!this.active||!focused)return;this.elapsed+=dt;if(this.layer)this.layer.style.setProperty('--capture-shade',String(.25+Math.min(this.elapsed/1.3,1)*.55));if(this.elapsed>=2.6)this.finish()}
 finish(){if(!this.active)return;this.active=false;this.layer=null;this.done()}
 reset(){this.active=false;this.elapsed=0;this.layer=null}
}
