import * as T from 'three';import{box,scene}from './world';
function notice(title:string,lines:string[],color:string,x:number,y:number,z:number,rotation=0){const c=document.createElement('canvas');c.width=512;c.height=640;const a=c.getContext('2d')!;a.fillStyle='#c9bea0';a.fillRect(0,0,512,640);a.strokeStyle=color;a.lineWidth=12;a.strokeRect(20,20,472,600);a.fillStyle=color;a.textAlign='center';a.font='bold 44px RollcallText';a.fillText(title,256,105);a.font='26px RollcallText';lines.forEach((line,i)=>a.fillText(line,256,185+i*65));a.font='20px RollcallText';a.fillText('昭川中学 · 校务档案',256,575);const p=new T.Mesh(new T.PlaneGeometry(1.1,1.4),new T.MeshStandardMaterial({map:new T.CanvasTexture(c),roughness:.9,side:T.DoubleSide}));p.position.set(x,y,z);p.rotation.y=rotation;scene.add(p)}
export function props(){
 for(const x of [-3.83,3.83]){box(x,1.05,0,.07,.07,43,'#9a9a7f');box(x,.09,0,.09,.18,43,'#293c36')}
 for(const z of [-20,-10,0,10,20])box(0,3.25,z,7.8,.25,.2,'#4b5a50');
 notice('纪律通报',['走廊禁止奔跑','发现异常，请保持安静','铃响期间，值班员听令','未经批准不得应答点名'],'#8a3931',-3.78,1.95,-9,Math.PI/2);
 notice('离校须知',['试卷归档后方可离校','广播负责名单注销','配电箱与侧门联锁','保管好你的通行证'],'#354d42',3.78,1.95,9,-Math.PI/2);
 notice('优秀班集体',['文明 · 克己 · 守时','本周扣分：零','本周应到：一人','本周实到：——'],'#8b6331',8,2,-21.6);
 // Office desk with drawers, a reading lamp, stacked records and ceramic cup.
 box(-8,.74,-2.3,3.2,.12,1.1,'#6d5035',true);for(const x of [-9.25,-6.75]){box(x,.35,-2.3,.6,.7,1,'#584936',true);for(const y of [.15,.38,.6]){box(x,y,-1.78,.5,.015,.03,'#272d29');box(x,y+.06,-1.75,.15,.025,.025,'#a19c7c')}}
 for(let i=0;i<5;i++)box(-8.5,.83+i*.035,-2.3,.6,.025,.75,i%2?'#c9c0a3':'#69705e');
 const brass=new T.MeshStandardMaterial({color:'#82775a',metalness:.65,roughness:.4});const lamp=new T.Mesh(new T.CylinderGeometry(.2,.23,.06,24),brass);lamp.position.set(-7,.84,-2.3);scene.add(lamp);box(-7,1.1,-2.3,.04,.5,.04,'#7d7757');const shade=new T.Mesh(new T.ConeGeometry(.32,.24,24,1,true),new T.MeshStandardMaterial({color:'#42634c',side:T.DoubleSide}));shade.position.set(-7,1.4,-2.3);scene.add(shade);const light=new T.PointLight('#efce8d',4,4);light.position.set(-7,1.25,-2.3);scene.add(light);
 const cup=new T.Mesh(new T.CylinderGeometry(.09,.075,.18,20),new T.MeshStandardMaterial({color:'#c2cbbb',roughness:.3}));cup.position.set(-7.6,.9,-2.2);scene.add(cup);
 for(const x of [-8,8])for(const z of [-17,-7,3,13]){const l=new T.PointLight(z===3?'#a9c5c2':'#d4c7a1',6,10);l.position.set(x,2.9,z);scene.add(l)}
}
