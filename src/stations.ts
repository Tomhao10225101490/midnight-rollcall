import * as T from 'three';
import {scene} from './world';
// Original multi-part props in metres. Interaction coordinates stay unchanged.
const metal=new T.MeshStandardMaterial({color:'#54665e',metalness:.55,roughness:.48});
const dark=new T.MeshStandardMaterial({color:'#192321',metalness:.35,roughness:.55});
const brass=new T.MeshStandardMaterial({color:'#b9a16b',metalness:.7,roughness:.32});
const wood=new T.MeshStandardMaterial({color:'#785839',roughness:.74});
const paper=new T.MeshStandardMaterial({color:'#d9cba6',roughness:.96});
const green=new T.MeshStandardMaterial({color:'#9ccd9d',emissive:'#36734a',emissiveIntensity:.8,roughness:.45});
function block(g:T.Group,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;g.add(mesh);return mesh}
function knob(g:T.Group,x:number,y:number,z:number,r=.04){const m=new T.Mesh(new T.CylinderGeometry(r,r,.035,16),brass);m.rotation.x=Math.PI/2;m.position.set(x,y,z);g.add(m)}
function artwork(g:T.Group,text:string[],w:number,h:number,x:number,y:number,z:number,flat=false){
 const c=document.createElement('canvas');c.width=512;c.height=512;const a=c.getContext('2d')!;
 a.fillStyle='#d3c7a6';a.fillRect(0,0,512,512);a.fillStyle='#303e37';a.textAlign='center';a.font='bold 36px serif';text.forEach((t,i)=>a.fillText(t,256,85+i*75,470));a.strokeStyle='#8b493b';a.lineWidth=4;a.strokeRect(25,25,462,462);
 const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
 const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,roughness:.9}));mesh.position.set(x,y,z);if(flat)mesh.rotation.x=-Math.PI/2;g.add(mesh);
}
export function station(index:number,x:number,z:number){const g=new T.Group();g.position.set(x,0,z);scene.add(g);
 if(index===0){
  block(g,0,.78,0,1.5,.08,.95,wood);for(const dx of [-.64,.64])for(const dz of [-.35,.35])block(g,dx,.38,dz,.055,.76,.055,metal);
  for(let i=0;i<4;i++){const sheet=block(g,-.18,.83+i*.006,0,.43,.005,.6,paper);sheet.rotation.y=i*.025}
  artwork(g,['昭川中学','离校复核试卷','姓名：未归档','请翻阅背面'],.43,.6,-.18,.856,0,true);
  const pen=block(g,.32,.837,.03,.015,.015,.3,dark);pen.rotation.y=.3;
  block(g,.5,.85,-.25,.15,.035,.1,brass);
 }else if(index===1){
  block(g,0,.92,0,1.05,1.84,.6,metal);
  for(let i=0;i<4;i++){const y=.29+i*.42;block(g,0,y,.311,.97,.38,.025,dark);block(g,0,y,.33,.93,.35,.018,metal);block(g,0,y+.04,.36,.28,.04,.05,brass);artwork(g,[['未归档','待复核','空白名单','离校许可'][i]],.2,.085,0,y-.07,.345)}
  block(g,.38,1.68,.36,.13,.18,.04,dark);for(let r=0;r<3;r++)for(let c=0;c<3;c++)knob(g,.345+c*.033,1.72-r*.04,.39,.011);
 }else if(index===2){
  block(g,0,.55,0,1.6,1.1,.9,wood);block(g,0,1.2,0,1.5,.28,.84,metal);
  for(const dx of [-.48,-.16,.16,.48]){block(g,dx,1.35,0,.015,.008,.42,dark);block(g,dx,1.37,(dx+.5)*.15-.1,.09,.045,.055,brass)}
  block(g,0,1.58,-.28,1.48,.4,.25,dark);artwork(g,['调谐 / TUNING','昭川广播 731'],.72,.24,0,1.58,-.144);
  for(const dx of [-.58,.58])knob(g,dx,1.58,-.13,.08);
  // Curved gooseneck microphone, with no external mesh dependencies.
  const curve=new T.CatmullRomCurve3([new T.Vector3(.6,1.36,.2),new T.Vector3(.6,1.65,.2),new T.Vector3(.45,1.86,.14),new T.Vector3(.3,1.83,.1)]);
  g.add(new T.Mesh(new T.TubeGeometry(curve,16,.012,8,false),dark));const mic=block(g,.26,1.83,.1,.15,.055,.055,dark);mic.rotation.z=.2;
 }else if(index===3){
  block(g,0,.6,0,.18,1.2,.18,metal);block(g,0,1.37,0,1.2,.82,.35,metal);block(g,0,1.37,.181,1.05,.67,.018,dark);
  for(let i=0;i<4;i++){const dx=-.36+i*.24;block(g,dx,1.38,.22,.18,.32,.08,paper);block(g,dx,1.42,.28,.1,.1,.08,i%2?dark:green);knob(g,dx,1.25,.27,.025);
   const cable=new T.CatmullRomCurve3([new T.Vector3(dx,1.8,0),new T.Vector3(dx,1.92,-.04),new T.Vector3(dx*.4,2.06,-.06)]);g.add(new T.Mesh(new T.TubeGeometry(cable,8,.014,6,false),i%2?dark:brass));}
  artwork(g,['侧门联锁','先核对广播，再合闸'],.65,.16,0,1.67,.195);block(g,.47,1.03,.23,.16,.02,.24,paper);
 }else{
  block(g,0,.65,0,.12,1.3,.12,metal);block(g,0,1.37,0,.35,.36,.19,dark);block(g,0,1.44,.101,.23,.08,.01,green);artwork(g,['通行证感应区'],.25,.12,0,1.3,.101);block(g,0,.04,0,.5,.08,.4,metal);
 }
 const light=new T.PointLight('#ead5a2',1.8,3);light.position.set(0,2.15,.4);g.add(light);return g;
}
