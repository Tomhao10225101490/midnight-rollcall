/** Spatial story beats advance only with the active game clock; no wall-clock timers. */
export type StoryEvent={id:string;text:string;kind:'radio'|'knock'|'step';x:number;z:number};
export class Narrative{
 private fired=new Set<string>();private cooldown=25;private remaining=0;private line='';
 readonly records:{title:string;text:string}[]=[];
 reset(opening:string){this.fired.clear();this.records.length=0;this.cooldown=25;this.remaining=12;this.line=opening}
 clearSubtitle(){this.remaining=0;this.line=''}
 defer(seconds=18){this.cooldown=Math.max(this.cooldown,seconds)}
 get subtitle(){return this.remaining>0?this.line:''}
 update(dt:number,stage:number,x:number,z:number,blocked:boolean):StoryEvent|null{
  this.remaining=Math.max(0,this.remaining-dt);this.cooldown=Math.max(0,this.cooldown-dt);
  if(blocked||this.cooldown>0)return null;
  const events:[boolean,StoryEvent][]=[
   [stage===0&&x< -4&&z< -12,{id:'empty-class',kind:'knock',x:8,z:-19,text:'隔壁传来三声轻敲。教室里没有应答，门也没有打开。'}],
   [stage===1&&x>4&&z< -12,{id:'name',kind:'radio',x:0,z:-18,text:'广播：林序。林序。应到一人，实到零人。请不要替空座位上的人应答。'}],
   [stage===2&&Math.abs(x)<4&&z> -8&&z<8,{id:'office',kind:'step',x:-8,z:-5,text:'身后的档案室传来脚步声。你刚才离开时，里面没有第二个人。'}],
   [stage===3&&x< -4&&z>0,{id:'unlisted',kind:'radio',x:-8,z:3,text:'广播：名单接收失败……名单接收成功。林序，这次请按你自己的名字离校。'}],
   [stage===4&&z>10,{id:'dawn',kind:'radio',x:8,z:18,text:'广播：最后一位同学，请保留走廊照明。有人还需要看见回去的路。'}]
  ];
  const event=events.find(([near,e])=>near&&!this.fired.has(e.id))?.[1];if(!event)return null;
  this.fired.add(event.id);this.line=event.text;this.remaining=10;this.cooldown=35;this.records.push({title:'途中记录 '+(this.records.length+1),text:event.text});return event;
 }
}
