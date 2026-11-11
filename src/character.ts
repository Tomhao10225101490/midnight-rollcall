import * as T from 'three';
import {portraitGeometry,wovenCloth} from './portrait';
/** Original adult duty proctor. All geometry is authored in metres, facing +Z. */
export function proctor(){
 const root=new T.Group();
 const cloth=wovenCloth('#283338'),seam=new T.MeshStandardMaterial({color:'#465052',roughness:.95}),skin=new T.MeshStandardMaterial({color:'#b59b83',roughness:.7}),hair=new T.MeshStandardMaterial({color:'#252a29',roughness:.9}),metal=new T.MeshStandardMaterial({color:'#a29b7b',metalness:.7,roughness:.35}),leather=new T.MeshStandardMaterial({color:'#202726',roughness:.5});
 skin.userData.authoredSurface=true;
 const eyeWhite=new T.MeshStandardMaterial({color:'#989990',roughness:.65}),iris=new T.MeshStandardMaterial({color:'#292824',roughness:.5});
 const part=(g:T.BufferGeometry,m:T.Material,x:number,y:number,z:number,parent:T.Object3D=root)=>{const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh};
 const block=(w:number,h:number,d:number,m:T.Material,x:number,y:number,z:number,parent:T.Object3D=root)=>part(new T.BoxGeometry(w,h,d),m,x,y,z,parent);
 const ellipse=(r:number,sx:number,sy:number,sz:number,m:T.Material,x:number,y:number,z:number,parent:T.Object3D=root)=>{const mesh=part(new T.SphereGeometry(r,24,16),m,x,y,z,parent);mesh.scale.set(sx,sy,sz);return mesh};
 // Coat profile has shoulders, a fitted waist and a split-looking hem, rather than a cone.
 const profile=[new T.Vector2(.27,-.28),new T.Vector2(.29,-.22),new T.Vector2(.245,.12),new T.Vector2(.28,.43),new T.Vector2(.34,.58),new T.Vector2(.3,.65),new T.Vector2(.14,.72)];
 const coat=part(new T.LatheGeometry(profile,32),cloth,0,0,0);coat.scale.z=.68;
 block(.025,.86,.018,seam,0,.18,.191);block(.018,.3,.018,hair,0,-.13,.19);
 for(const y of [-.12,.06,.24,.42,.6])part(new T.SphereGeometry(.018,12,8),metal,.018,y,.207);
 for(const x of [-.18,.18]){block(.13,.14,.025,cloth,x,.41,.19);block(.14,.025,.035,seam,x,.48,.2);block(.13,.008,.008,seam,x,.34,.208)}
 part(new T.CylinderGeometry(.12,.14,.11,24),cloth,0,.73,0);
 for(const x of [-.085,.085]){const collar=block(.1,.13,.025,seam,x,.68,.11);collar.rotation.z=x>0?-.32:.32}
 block(.09,.035,.01,metal,-.18,.435,.214);
 // A narrow jaw, ears, nose, brows and wire spectacles define the face without gore.
 const head=new T.Group();head.position.set(0,.99,0);root.add(head);
 part(portraitGeometry(),skin,0,0,0,head);
 for(const x of [-.17,.17])ellipse(.05,.5,1,.65,skin,x,-.005,0,head);
 const hairGeometry=new T.SphereGeometry(1,40,24,0,Math.PI*2,0,Math.acos(.28)),hairVertices=hairGeometry.getAttribute('position');
 for(let i=0;i<hairVertices.count;i++){hairVertices.setXYZ(i,hairVertices.getX(i)*.174,hairVertices.getY(i)*.23,hairVertices.getZ(i)*.173)}hairGeometry.computeVertexNormals();part(hairGeometry,hair,0,0,0,head);
 // Eyelid contours sit over the recessed sockets; no detached nose primitives.
 for(const x of [-.073,.073]){
  for(const upper of [true,false]){const lid=new T.CatmullRomCurve3([new T.Vector3(x-.02,.018,.157),new T.Vector3(x,upper?.027:.011,.166),new T.Vector3(x+.02,.018,.157)]);part(new T.TubeGeometry(lid,12,.0015,6,false),skin,0,0,0,head)}
 }
 const mouth=new T.CatmullRomCurve3([new T.Vector3(-.032,-.109,.14),new T.Vector3(0,-.105,.15),new T.Vector3(.032,-.109,.14)]);part(new T.TubeGeometry(mouth,12,.0025,6,false),hair,0,0,0,head);
 for(const x of [-.073,.073]){ellipse(.018,1,.4,.35,eyeWhite,x,.018,.16,head);ellipse(.0055,1,1,.45,iris,x,.018,.167,head);const brow=block(.068,.011,.018,hair,x,.068,.165,head);brow.rotation.z=x>0?.1:-.1;const rim=part(new T.TorusGeometry(.051,.004,8,28),metal,x,.025,.18,head);rim.scale.y=.68;block(.006,.006,.12,metal,x<0?-.129:.129,.026,.12,head)}
 block(.044,.005,.006,metal,0,.026,.183,head);
 const hips:T.Group[]=[],knees:T.Group[]=[],arms:T.Group[]=[];
 for(const [i,x]of [-.145,.145].entries()){
  const hip=new T.Group();hip.position.set(x,-.2,0);root.add(hip);hips.push(hip);
  part(new T.CapsuleGeometry(.093,.24,8,16),cloth,0,-.16,0,hip);
  const knee=new T.Group();knee.position.y=-.34;hip.add(knee);knees.push(knee);
  part(new T.CapsuleGeometry(.08,.23,8,16),cloth,0,-.15,0,knee);ellipse(.1,.91,.62,1.65,leather,0,-.38,.07,knee);
  const arm=new T.Group();arm.position.set(i===0?-.33:.33,.58,0);arm.rotation.z=i===0?-.08:.08;root.add(arm);arms.push(arm);
  part(new T.CapsuleGeometry(.085,.23,8,16),cloth,0,-.16,0,arm);
  const forearm=new T.Group();forearm.position.y=-.33;forearm.rotation.x=-.1;arm.add(forearm);
  part(new T.CapsuleGeometry(.069,.22,8,16),cloth,0,-.145,0,forearm);part(new T.CylinderGeometry(.071,.069,.04,16),seam,0,-.27,0,forearm);
  ellipse(.07,.8,1.15,.52,skin,0,-.335,.015,forearm);
  for(let digit=0;digit<4;digit++)part(new T.CapsuleGeometry(.012,.04,4,8),skin,-.035+digit*.023,-.395,.018,forearm);
  if(i===0){block(.28,.4,.035,new T.MeshStandardMaterial({color:'#68563d',roughness:.85}),-.025,-.45,.075,forearm);block(.24,.33,.008,new T.MeshStandardMaterial({color:'#c8bc9e',roughness:1}),-.025,-.44,.097,forearm);block(.075,.025,.015,metal,-.025,-.267,.105,forearm);for(let row=0;row<6;row++)block(.16,.003,.002,seam,-.025,-.34-row*.037,.103,forearm)}
  else for(let key=0;key<3;key++){const kx=-.025+key*.025;part(new T.TorusGeometry(.024,.005,6,16),metal,kx,-.43,.03,forearm);block(.008,.075,.008,metal,kx,-.485,.03,forearm);block(.025,.009,.008,metal,kx+.008,-.515,.03,forearm)}
 }
 return{root,animate:(t:number,moving:boolean,state='巡逻')=>{
  const speed=state==='追逐'?7:4.6,phase=t*speed;
  hips.forEach((hip,i)=>{const stride=Math.sin(phase+i*Math.PI);hip.rotation.x=moving?stride*.32:0;knees[i].rotation.x=moving?Math.max(0,-stride)*.42:0;arms[i].rotation.x=moving?-stride*(i===0?.1:.23):-.035});
  root.position.y=moving?Math.abs(Math.sin(phase))*.014:Math.sin(t*1.1)*.004;
  head.rotation.y=state==='搜索'?Math.sin(t*1.4)*.3:Math.sin(t*.6)*.035;
  head.rotation.z=state==='听铃'?.06:0;
 }};
}
