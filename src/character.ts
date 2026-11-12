import * as T from 'three';
import {portraitGeometry,wovenCloth} from './portrait';
/** Original adult duty proctor. All geometry is authored in metres, facing +Z. */
export function proctor(){
 const root=new T.Group();
 const cloth=wovenCloth('#283338'),twill=wovenCloth('#2f3a3d'),seam=new T.MeshStandardMaterial({color:'#465052',roughness:.95}),skin=new T.MeshStandardMaterial({color:'#b59b83',roughness:.68}),hair=new T.MeshStandardMaterial({color:'#252a29',roughness:.9}),metal=new T.MeshStandardMaterial({color:'#a29b7b',metalness:.7,roughness:.35}),leather=new T.MeshStandardMaterial({color:'#202726',roughness:.5}),sole=new T.MeshStandardMaterial({color:'#151816',roughness:.85}),band=new T.MeshStandardMaterial({color:'#6a2b2b',roughness:.8}),shirt=new T.MeshStandardMaterial({color:'#d8d2c4',roughness:.86}),belt=new T.MeshStandardMaterial({color:'#2a2420',roughness:.55});
 skin.userData.authoredSurface=true;shirt.userData.authoredSurface=true;
 const eyeWhite=new T.MeshStandardMaterial({color:'#989990',roughness:.65}),iris=new T.MeshStandardMaterial({color:'#292824',roughness:.5});
 const part=(g:T.BufferGeometry,m:T.Material,x:number,y:number,z:number,parent:T.Object3D=root)=>{const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh};
 const block=(w:number,h:number,d:number,m:T.Material,x:number,y:number,z:number,parent:T.Object3D=root)=>part(new T.BoxGeometry(w,h,d),m,x,y,z,parent);
 const ellipse=(r:number,sx:number,sy:number,sz:number,m:T.Material,x:number,y:number,z:number,parent:T.Object3D=root)=>{const mesh=part(new T.SphereGeometry(r,24,16),m,x,y,z,parent);mesh.scale.set(sx,sy,sz);return mesh};
 const limb=(top:number,bottom:number,h:number,m:T.Material,x:number,y:number,z:number,parent:T.Object3D)=>part(new T.CylinderGeometry(top,bottom,h,16),m,x,y,z,parent);
 // Long duty coat: shoulders, pinched waist, weighted hem and a back vent.
 const profile=[new T.Vector2(.22,-.32),new T.Vector2(.31,-.3),new T.Vector2(.3,-.2),new T.Vector2(.248,.08),new T.Vector2(.27,.4),new T.Vector2(.345,.58),new T.Vector2(.3,.66),new T.Vector2(.13,.73)];
 const coat=part(new T.LatheGeometry(profile,36),cloth,0,0,0);coat.scale.z=.7;
 block(.03,.96,.02,seam,0,.16,.2);block(.02,.34,.02,hair,0,-.14,.198);
 for(const y of [-.14,.04,.22,.4,.58])part(new T.SphereGeometry(.017,12,8),metal,.02,y,.216);
 for(const x of [-.185,.185]){block(.14,.15,.03,cloth,x,.4,.2);block(.15,.02,.04,seam,x,.48,.21);block(.12,.01,.01,seam,x,.33,.218)}
 part(new T.CylinderGeometry(.11,.13,.07,24),cloth,0,.7,0);
 part(new T.CylinderGeometry(.075,.085,.06,16),shirt,0,.755,0);
 for(const x of [-.05,.05]){const collar=block(.065,.08,.016,shirt,x,.735,.1);collar.rotation.z=x>0?-.5:.5;collar.rotation.x=-.7}
 block(.032,.18,.012,seam,0,.6,.2);
 for(const x of [-.1,.1]){const lapel=block(.1,.26,.018,seam,x,.52,.21);lapel.rotation.z=x>0?-.38:.38;lapel.rotation.x=-.1}
 block(.1,.03,.012,metal,-.185,.43,.224);
 part(new T.TorusGeometry(.16,.018,8,24,Math.PI),belt,0,.02,.02).rotation.x=Math.PI/2;
 block(.05,.035,.02,metal,0,.02,.2);
 block(.04,.34,.01,seam,0,-.14,-.2);
 // Narrow jaw, ears, sockets and wire spectacles; no gore.
 const head=new T.Group();head.position.set(0,1.01,0);root.add(head);
 part(portraitGeometry(),skin,0,0,0,head);
 part(new T.CylinderGeometry(.065,.08,.14,16),skin,0,-.22,0,head);
 for(const x of [-.17,.17]){const ear=ellipse(.048,.48,1.1,.7,skin,x,-.02,-.01,head);ear.rotation.z=x>0?.12:-.12;ear.rotation.y=x>0?-.25:.25;part(new T.TorusGeometry(.018,.004,6,12,Math.PI),skin,x,-.02,.01,head).rotation.y=x>0?-.3:.3}
 const hairGeometry=new T.SphereGeometry(1,56,36,0,Math.PI*2,0,Math.acos(-.55)),hairVertices=hairGeometry.getAttribute('position');
 for(let i=0;i<hairVertices.count;i++){
  let hx=hairVertices.getX(i),hy=hairVertices.getY(i),hz=hairVertices.getZ(i);
  const wave=1+.012*Math.sin(hx*9)+.01*Math.sin(hz*8+hy*5);
  if(hz>.25&&hy<.2){
   const t=Math.min(1,(.2-hy)/.55);
   hz=hz*(1-t*.88);
   hy=hy+t*.05;
  }
  const side=hz<=.15&&hy<.15?1.07:1;
  hairVertices.setXYZ(i,hx*.186*wave*side,hy*.255,hz*.18*wave);
 }
 hairGeometry.computeVertexNormals();part(hairGeometry,hair,0,.02,-.006,head);
 for(const x of [-.16,.16])ellipse(.05,.75,1.15,.5,hair,x,-.04,-.04,head);
 for(const x of [-.073,.073]){
  for(const upper of [true,false]){const lid=new T.CatmullRomCurve3([new T.Vector3(x-.022,upper?.03:.01,.158),new T.Vector3(x,upper?.036:.006,.168),new T.Vector3(x+.022,upper?.03:.01,.158)]);part(new T.TubeGeometry(lid,14,.002,6,false),skin,0,0,0,head)}
 }
 const mouth=new T.CatmullRomCurve3([new T.Vector3(-.03,-.112,.142),new T.Vector3(0,-.108,.152),new T.Vector3(.03,-.112,.142)]);part(new T.TubeGeometry(mouth,14,.0022,6,false),hair,0,0,0,head);
 for(const x of [-.073,.073]){
  ellipse(.017,1,.42,.34,eyeWhite,x,.02,.162,head);ellipse(.0052,1,1,.45,iris,x,.02,.169,head);
  const brow=block(.07,.01,.016,hair,x,.074,.166,head);brow.rotation.z=x>0?.12:-.12;
  const rim=part(new T.TorusGeometry(.05,.004,8,28),metal,x,.027,.182,head);rim.scale.y=.66;
  block(.006,.006,.13,metal,x<0?-.126:.126,.028,.118,head);
 }
 block(.046,.005,.006,metal,0,.028,.185,head);
 const hips:T.Group[]=[],knees:T.Group[]=[],ankles:T.Group[]=[],arms:T.Group[]=[],forearms:T.Group[]=[];
 for(const [i,x]of [-.145,.145].entries()){
  const hip=new T.Group();hip.position.set(x,-.2,0);root.add(hip);hips.push(hip);
  part(new T.SphereGeometry(.1,16,12),twill,0,0,0,hip);
  limb(.1,.086,.3,twill,0,-.15,0,hip);
  const knee=new T.Group();knee.position.y=-.34;hip.add(knee);knees.push(knee);
  part(new T.SphereGeometry(.086,16,12),twill,0,0,0,knee);
  limb(.086,.068,.26,twill,0,-.15,0,knee);
  limb(.07,.074,.045,twill,0,-.28,0,knee);
  const ankle=new T.Group();ankle.position.y=-.305;knee.add(ankle);ankles.push(ankle);
  block(.13,.05,.25,leather,0,-.025,.055,ankle);
  block(.124,.02,.23,sole,0,-.055,.045,ankle);
  block(.09,.045,.075,leather,0,-.025,-.07,ankle);
  block(.11,.008,.08,leather,0,.003,.12,ankle);
  const arm=new T.Group();arm.position.set(i===0?-.33:.33,.58,0);arm.rotation.z=i===0?-.08:.08;root.add(arm);arms.push(arm);
  part(new T.SphereGeometry(.09,16,12),cloth,0,0,0,arm);
  limb(.088,.078,.26,cloth,0,-.15,0,arm);
  if(i===0){part(new T.CylinderGeometry(.09,.09,.07,16),band,0,-.12,0,arm);block(.045,.02,.003,seam,0,-.12,.091,arm)}
  const forearm=new T.Group();forearm.position.y=-.33;forearm.rotation.x=-.1;arm.add(forearm);forearms.push(forearm);
  part(new T.SphereGeometry(.075,16,12),cloth,0,0,0,forearm);
  limb(.075,.066,.22,cloth,0,-.13,0,forearm);
  part(new T.CylinderGeometry(.07,.068,.04,16),seam,0,-.25,0,forearm);
  const hand=new T.Group();hand.position.set(0,-.32,.02);forearm.add(hand);
  block(.07,.09,.035,skin,0,-.02,0,hand);
  const thumb=part(new T.CapsuleGeometry(.01,.04,4,8),skin,-.04,-.01,.02,hand);thumb.rotation.z=.7;thumb.rotation.x=-.3;
  for(let digit=0;digit<4;digit++){const finger=part(new T.CapsuleGeometry(.009,.045,4,8),skin,-.028+digit*.019,-.075,.01,hand);finger.rotation.x=.25}
  if(i===0){block(.28,.4,.035,new T.MeshStandardMaterial({color:'#68563d',roughness:.85}),-.025,-.45,.075,forearm);block(.24,.33,.008,new T.MeshStandardMaterial({color:'#c8bc9e',roughness:1}),-.025,-.44,.097,forearm);block(.075,.025,.015,metal,-.025,-.267,.105,forearm);for(let row=0;row<6;row++)block(.16,.003,.002,seam,-.025,-.34-row*.037,.103,forearm)}
  else for(let key=0;key<3;key++){const kx=-.025+key*.025;part(new T.TorusGeometry(.024,.005,6,16),metal,kx,-.43,.03,forearm);block(.008,.075,.008,metal,kx,-.485,.03,forearm);block(.025,.009,.008,metal,kx+.008,-.515,.03,forearm)}
 }
 let lastT=0,phase=0,walk=0;
 return{root,animate:(t:number,moving:boolean,state='巡逻')=>{
  const dt=Math.max(0,Math.min(.05,lastT?t-lastT:0));lastT=t;
  const chase=state==='追逐',search=state==='搜索',listen=state==='听铃';
  walk+=(Number(moving&&!listen)-walk)*Math.min(1,(moving?7:5.2)*dt);
  if(walk>.01)phase+=(chase?8.1:search?3.5:4.7)*dt*walk;
  const bob=Math.abs(Math.sin(phase))*(chase?.026:.018)*walk,breath=Math.sin(t*1.35)*.006*(1-walk*.7);
  root.position.y=bob+breath;
  root.rotation.x=(listen?.03:chase?.15:search?.06:.07)*walk+(listen?.04:0);
  root.rotation.z=Math.sin(phase)*.034*walk+Math.sin(t*.7)*.01*(1-walk);
  root.rotation.y=Math.sin(phase)*-.05*walk;
  hips.forEach((hip,i)=>{
   const stride=Math.sin(phase+i*Math.PI),recover=Math.cos(phase+i*Math.PI);
   hip.rotation.x=stride*(chase?.55:.42)*walk;
   hip.rotation.z=(i===0?-1:1)*.03*walk;
   knees[i].rotation.x=Math.max(0,-stride)*(chase?.88:.68)*walk+Math.max(0,stride)*.1*walk;
   ankles[i].rotation.x=-hip.rotation.x*.28-knees[i].rotation.x*.18+recover*.08*walk;
   const swing=(i===0?.2:.62)*(chase?1.2:1);
   arms[i].rotation.x=-stride*swing*walk-.1;
   arms[i].rotation.z=(i===0?-.08:.08)+(i===0?-1:1)*.02*walk;
   forearms[i].rotation.x=-.12-Math.max(0,stride)*.28*walk*(i===0?.25:1);
  });
  if(walk>.05){
   root.updateMatrixWorld(true);
   let lowest=Infinity;
   const tip=new T.Vector3();
   for(const ankle of ankles){tip.set(0,-.065,.04);ankle.localToWorld(tip);if(tip.y<lowest)lowest=tip.y}
   root.position.y-=lowest;
  }
  if(listen){head.rotation.set(.14,Math.sin(t*.8)*.1,.09)}
  else if(search){const look=Math.sin(t*1.15)*.55;head.rotation.set(.08+Math.sin(t*.7)*.12,look,-look*.18)}
  else if(chase){head.rotation.set(-.05,-root.rotation.y*.5,0)}
  else head.rotation.set(.02+Math.sin(t*1.35)*.016,Math.sin(t*.55)*.09-Math.sin(phase)*.05*walk,0);
 }};
}
