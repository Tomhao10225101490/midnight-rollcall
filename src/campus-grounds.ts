import * as T from 'three';
import {architecturalMaps} from './architectural-surfaces';
import {courtMap,grassMaps,rubberMaps,tileMaps} from './campus-surfaces';
import {propSurface} from './prop-surfaces';
import {scene,walls,floors,label} from './world';

/** Original code-authored annex with trim, fixtures and authored surfaces. Units are metres. */
export function campusGrounds(){
 const plasterMaps=architecturalMaps('plaster'), terraMaps=architecturalMaps('terrazzo');
 const dryTile=tileMaps(false), wetTile=tileMaps(true), rubber=rubberMaps(), grass=grassMaps();
 const plaster=new T.MeshStandardMaterial({color:'#8a948b',roughness:1,map:plasterMaps.map,bumpMap:plasterMaps.bumpMap,roughnessMap:plasterMaps.roughnessMap,bumpScale:.012});
 const trim=new T.MeshStandardMaterial({color:'#5c675f',roughness:.86});
 const dado=new T.MeshStandardMaterial({color:'#4e5b54',roughness:.88,map:plasterMaps.map,bumpMap:plasterMaps.bumpMap,bumpScale:.01});
 const terrazzo=new T.MeshStandardMaterial({color:'#c8c3b0',roughness:1,map:terraMaps.map,bumpMap:terraMaps.bumpMap,roughnessMap:terraMaps.roughnessMap,bumpScale:.004});
 const tile=new T.MeshStandardMaterial({color:'#d8d6c8',roughness:1,map:dryTile.map,bumpMap:dryTile.bumpMap,roughnessMap:dryTile.roughnessMap,bumpScale:.008});
 const tileWet=new T.MeshStandardMaterial({color:'#9aa399',roughness:1,map:wetTile.map,bumpMap:wetTile.bumpMap,roughnessMap:wetTile.roughnessMap,bumpScale:.006,metalness:.04});
 const ceramic=new T.MeshStandardMaterial({color:'#eceae0',roughness:.28});
 const porcelain=new T.MeshStandardMaterial({color:'#e4e2d8',roughness:.2,metalness:.08});
 const metal=new T.MeshStandardMaterial({color:'#6a746c',roughness:.42,metalness:.72});
 const dark=new T.MeshStandardMaterial({color:'#2a332f',roughness:.65,metalness:.4});
 const enamel=new T.MeshStandardMaterial({color:'#a5afa3',roughness:.55,metalness:.16});
 const wood=propSurface('timber');
 const rust=new T.MeshStandardMaterial({color:'#6a4336',roughness:.8});
 const track=new T.MeshStandardMaterial({color:'#9a5148',roughness:1,map:rubber.map,bumpMap:rubber.bumpMap,roughnessMap:rubber.roughnessMap,bumpScale:.01});
 const lane=new T.MeshStandardMaterial({color:'#e8e2c8',roughness:.62});
 const court=new T.MeshStandardMaterial({color:'#4d5a48',roughness:.82,map:courtMap()});
 const earth=new T.MeshStandardMaterial({color:'#3a4538',roughness:1,map:grass.map,bumpMap:grass.bumpMap,bumpScale:.02});
 const soil=new T.MeshStandardMaterial({color:'#4a4034',roughness:1});
 const paint=new T.MeshStandardMaterial({color:'#d4cbb0',roughness:.7});
 const cream=new T.MeshStandardMaterial({color:'#cfc6a4',roughness:.68});
 const glass=new T.MeshStandardMaterial({color:'#8fb4c0',roughness:.08,metalness:.12,emissive:'#1a333c',emissiveIntensity:.08,transparent:true,opacity:.38,side:T.DoubleSide});
 const tube=new T.MeshStandardMaterial({color:'#e8f0d8',emissive:'#d7e4c0',emissiveIntensity:1.6,roughness:.28});
 const net=new T.MeshStandardMaterial({color:'#d8d3c4',roughness:.55,metalness:.08});
 const foliage=new T.MeshStandardMaterial({color:'#4f6a45',roughness:.95});
 const warning=new T.MeshStandardMaterial({color:'#c9a13a',roughness:.7});
 for(const m of [plaster,trim,dado,terrazzo,tile,tileWet,ceramic,porcelain,metal,dark,enamel,wood,rust,track,lane,court,earth,soil,paint,cream,glass,tube,net,foliage,warning])m.userData.authoredSurface=true;

 const unit=new T.BoxGeometry(1,1,1),peg=new T.CylinderGeometry(1,1,1,16),up=new T.Vector3(0,1,0);
 const boxes=new Map<T.Material,T.Matrix4[]>(),cyls=new Map<T.Material,T.Matrix4[]>();
 const solids:{x:number;y:number;z:number;w:number;h:number;d:number}[]=[];
 function add(mat:T.Material,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){
  const list=boxes.get(mat)||[];list.push(new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(w,h,d)));boxes.set(mat,list);
 }
 function shaft(mat:T.Material,x:number,y:number,z:number,r:number,h:number,rx=0,ry=0,rz=0){
  const list=cyls.get(mat)||[];list.push(new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(r,h,r)));cyls.set(mat,list);
 }
 function bar(mat:T.Material,ax:number,ay:number,az:number,bx:number,by:number,bz:number,r:number){
  const a=new T.Vector3(ax,ay,az),b=new T.Vector3(bx,by,bz),d=b.clone().sub(a);
  const list=cyls.get(mat)||[];list.push(new T.Matrix4().compose(a.clone().add(b).multiplyScalar(.5),new T.Quaternion().setFromUnitVectors(up,d.clone().normalize()),new T.Vector3(r,d.length(),r)));cyls.set(mat,list);
 }
 function solid(x:number,y:number,z:number,w:number,h:number,d:number,mat:T.Material=plaster){
  add(mat,x,y,z,w,h,d);solids.push({x,y,z,w,h,d});
 }
 function patch(minX:number,maxX:number,minZ:number,maxZ:number,height:(x:number,z:number)=>number){floors.push({minX,maxX,minZ,maxZ,height})}
 function stepped(a:number,b:number,steps:number,y0:number,y1:number,coord:number){
  const t=(coord-a)/(b-a);if(t<=0)return y0;if(t>=1)return y1;
  return y0+(y1-y0)*(Math.min(steps-1,Math.floor(t*steps))+1)/steps;
 }
 function skirting(x:number,z:number,w:number,d:number){add(trim,x,.05,z,w,.1,d)}
 function cornice(x:number,z:number,w:number,d:number,y=3.28){add(trim,x,y,z,w,.08,d)}
 function wainscot(x:number,z:number,w:number,d:number){add(dado,x,.62,z,w,1.16,d)}
 function portal(x:number,y:number,z:number,w:number,h:number,axis:'x'|'z',thick=.08,depth=.22){
  const jamb=thick,head=y+h/2+jamb/2;
  if(axis==='z'){
   add(trim,x-w/2-jamb/2,y,z,depth,h+jamb,jamb);add(trim,x+w/2+jamb/2,y,z,depth,h+jamb,jamb);
   add(trim,x,head,z,w+jamb*2,jamb,depth);
  }else{
   add(trim,x,y,z-w/2-jamb/2,jamb,h+jamb,depth);add(trim,x,y,z+w/2+jamb/2,jamb,h+jamb,depth);
   add(trim,x,head,z,depth,jamb,w+jamb*2);
  }
 }
 function fixture(x:number,y:number,z:number,rotY=0){
  const c=Math.cos(rotY),s=Math.sin(rotY);
  const lx=(lx:number,lz:number)=>x+lx*c-lz*s, lz=(lx:number,lz:number)=>z+lx*s+lz*c;
  add(metal,x,y+.02,z,1.44,.05,.34,0,rotY,0);add(enamel,x,y-.01,z,1.36,.02,.28,0,rotY,0);
  for(const side of [-1,1])add(metal,lx(0,side*.16),y-.02,lz(0,side*.16),1.44,.08,.02,0,rotY,0);
  for(const tz of [-.08,.08]){
   bar(tube,lx(-.59,tz),y-.06,lz(-.59,tz),lx(.59,tz),y-.06,lz(.59,tz),.022);
   for(const tx of [-.58,.58])bar(dark,lx(tx-.025,tz),y-.06,lz(tx-.025,tz),lx(tx+.025,tz),y-.06,lz(tx+.025,tz),.028);
  }
 }
 function lamp(x:number,y:number,z:number,intensity:number,distance:number,angle=Math.PI*.4){
  const light=new T.SpotLight('#f0dfb5',intensity,distance,angle,.75,2);
  light.name='南翼灯具照明';light.position.set(x,y,z);light.target.position.set(x,0,z);
  light.castShadow=true;light.shadow.mapSize.set(256,256);light.shadow.bias=-.0002;
  const spill=new T.PointLight('#f0dfb5',intensity*.04,distance*.45,2);spill.position.set(x,y-.08,z);
  scene.add(light,light.target,spill);
 }
 function plate(text:string,x:number,y:number,z:number,rotY:number,w=1.15,h=.38){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=160;
  const g=canvas.getContext('2d')!;g.fillStyle='#1c2a26';g.fillRect(0,0,512,160);
  g.strokeStyle='#c4b896';g.lineWidth=10;g.strokeRect(12,12,488,136);
  g.fillStyle='#eadfb9';g.font=`${Math.min(64,Math.floor(440/Math.max(4,text.length)))}px RollcallText`;g.textAlign='center';g.textBaseline='middle';g.fillText(text,256,84);
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
  const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,roughness:.7,metalness:.05}));
  mesh.position.set(x,y,z);mesh.rotation.y=rotY;scene.add(mesh);
  add(dark,x,y,z+(rotY===0?.01:rotY===Math.PI?-.01:0),w+.06,h+.06,.03,0,rotY,0);
 }

 // Floors: unique xz only. Ground under the upper wing is fenced, not walkable.
 patch(-10.25,7.35,-28.15,-22.02,()=>0);
 patch(-16.55,-10.25,-28.15,-22.02,()=>0);
 patch(7.35,11.4,-22.55,-22.02,()=>0);
 patch(7.35,11.4,-27.15,-22.55,(x,z)=>stepped(-22.55,-27.15,11,0,1.76,z));
 patch(7.45,11.4,-28.2,-27.15,()=>1.76);
 patch(8.45,11.4,-32.05,-28.2,(x,z)=>stepped(-28.2,-32.05,11,1.76,3.52,z));
 patch(7.45,16.25,-38.05,-32.05,()=>3.52);
 patch(-16.55,7.2,-32.25,-28.15,()=>0);
 patch(-22,7.2,-68,-32.25,()=>0);
 patch(-22,22,-68,-38.2,()=>0);
 patch(16.35,22,-38.2,-32.25,()=>0);

 // Lobby shell. Floor and ceiling stop at the stair doorway so the landing stays clear.
 solid(-1.45,-.08,-25.1,17.6,.16,6.3,trim);
 solid(-1.45,3.42,-25.1,17.6,.16,6.3,plaster);
 add(tile,9.375,-.02,-22.28,4.05,.04,.54);
 solid(-16.4,1.7,-22.05,8.4,3.4,.3);
 solid(-6.9,1.7,-28.2,10.2,3.4,.3);solid(6.9,1.7,-28.2,10.2,3.4,.3);solid(0,3.15,-28.2,3.6,.5,.3);
 solid(0,.04,-22.05,3.4,.08,.4,trim);
 solid(-10.25,1.7,-23.15,.3,3.4,2.2);solid(-10.25,1.7,-27.15,.3,3.4,2.1);solid(-10.25,3.15,-25.1,.3,.5,1.8);
 solid(7.35,1.7,-25.9,.3,3.4,4.6);
 solid(7.35,3.15,-22.9,.3,.5,1.4);
 // Lobby trim, dado and ceiling beams — kept off the door openings
 wainscot(-6.9, -22.18, 10.0, .04);wainscot(6.9, -22.18, 10.0, .04);
 wainscot(-6.9, -28.02, 10.0, .04);wainscot(6.9, -28.02, 10.0, .04);
 wainscot(-10.07, -23.15, .04, 2.1);wainscot(-10.07, -27.15, .04, 2.0);
 wainscot(7.17, -25.9, .04, 4.4);
 skirting(0,-22.18,24.4,.06);skirting(0,-28.02,20.6,.06);
 cornice(0,-25.1,24.4,6.1);
 for(const x of [-8,-2.5,2.5,7])add(trim,x,3.3,-25.1,.08,.12,6.1);
 portal(0,1.45,-22.05,3.4,2.9,'z',.07,.28);
 portal(0,1.45,-28.2,3.4,2.9,'z',.07,.28);
 portal(-10.25,1.45,-25.1,1.7,2.9,'x',.07,.26);
 portal(7.35,1.45,-22.9,1.3,2.9,'x',.07,.26);
 // Terrazzo pavers
 for(let col=-20;col<20;col++)for(let row=-4;row<5;row++){
  const x=col*.6,z=-25.1+row*.62;
  if(x<-10||x>7.1||z<-28||z>-22.15)continue;
  add(terrazzo,x,.012,z,.56,.02,.58);
 }
 fixture(-4.6,3.12,-25.1);fixture(1.2,3.12,-25.1);fixture(4.8,3.12,-25.1);lamp(-4.6,3.08,-25.1,22,9);lamp(1.2,3.08,-25.1,22,9);lamp(4.8,3.08,-25.1,20,9);
 // Props: umbrella stand, shoe cabinet, notice, radiator-style bench, wall clock
 solid(-3.5,.22,-26.85,.7,.44,.55,wood);
 for(const x of [-3.68,-3.5,-3.32]){
  shaft(dark,x,.7,-26.85,.012,.7);
  const tilt=x+3.5;
  shaft(paint,x+.12,.95,-26.85,.22,.04,tilt*.4,0,0);
 }
 for(let i=0;i<4;i++)for(let j=0;j<3;j++)add(wood,3.2+i*.28,.2+j*.28,-26.9,.24,.04,.5);
 solid(3.6,.35,-26.9,1.2,.08,.55,wood);solid(3.6,.02,-26.9,1.16,.04,.52,wood);
 add(wood,3.6,1.15,-23.1,1.5,.9,.06);add(dark,3.6,1.15,-23.14,1.42,.82,.02);
 for(const z of [-23.6,-25.1,-26.6]){shaft(enamel,-9.85,.55,z,.04,.7);shaft(metal,-9.85,.2,z,.025,1.1,0,0,Math.PI/2)}
 shaft(dark,-6.4,2.55,-22.22,.28,.06,Math.PI/2,0,0);shaft(cream,-6.4,2.55,-22.18,.24,.02,Math.PI/2,0,0);
 add(dark,-6.4,2.62,-22.16,.01,.12,.01);add(dark,-6.48,2.52,-22.16,.01,.08,.01);

 // Toilet annex
 solid(-16.55,1.7,-25.1,.3,3.4,6.3);solid(-13.4,-.08,-25.1,6.4,.16,6.3,tile);
 solid(-13.4,3.42,-25.1,6.4,.16,6.3);solid(-13.4,1.7,-28.2,6.4,3.4,.3);
 add(tile,-13.4,1.7,-22.22,6.2,3.2,.02);add(tile,-16.38,1.7,-25.1,.02,3.2,6.1);
 add(tile,-13.4,1.7,-28.02,6.2,3.2,.02);
 skirting(-13.4,-22.22,6.1,.05);skirting(-13.4,-28.02,6.1,.05);
 cornice(-13.4,-25.1,6.1,6.1);
 // Stall partitions, overhead braces, inward-swinging middle door
 for(const z of [-23.35,-25.1,-26.85]){
  solid(-14.85,1.05,z,2.3,2.1,.04,paint);
  add(metal,-14.85,2.14,z,2.3,.04,.05);
  bar(metal,-13.72,2.2,z,-13.2,2.2,z,.01);
 }
 solid(-13.7,1.05,-27.55,.04,2.1,1.4,paint);
 for(const z of [-22.55,-24.25,-26]){
  shaft(porcelain,-15.55,.05,z,.16,.04);add(porcelain,-15.55,.07,z,.34,.03,.5);
  add(ceramic,-15.55,.045,z-.2,.15,.07,.18);add(ceramic,-15.55,.045,z+.2,.15,.07,.18);
  for(const s of [-1,1])for(const k of [-.06,.06])add(dark,-15.55+s*.04,.08,z+s*.2+k,.1,.01,.02);
  solid(-15.92,.78,z,.18,1.2,.34,ceramic);
  shaft(porcelain,-15.92,1.42,z,.08,.08);add(metal,-15.92,1.38,z,.1,.04,.16);
  bar(metal,-15.92,1.3,z,-15.92,.95,z,.012);
  add(metal,-13.72,.2,z,.05,.04,.05);add(metal,-13.72,1.85,z,.05,.04,.05);
  if(z===-24.25){
   add(paint,-14.12,.95,z+.36,.78,1.86,.04,0,-.15,0);
   add(metal,-13.78,1.05,z+.34,.03,.05,.03);
  }else{
   add(paint,-13.72,.95,z,.04,1.86,.78);
   add(metal,-13.7,1.1,z+.28,.03,.05,.04);
  }
  add(dark,-13.7,1.55,z-(z===-24.25?0:.3),.02,.04,.02);
 }
 // Sinks, gooseneck taps, mirrors, plumbing — kept to the east wall
 for(const z of [-23.2,-24.7,-26.2]){
  add(porcelain,-11.2,.98,z,.5,.06,.38);shaft(porcelain,-11.2,.98,z,.16,.05);
  add(ceramic,-11.2,.58,z,.16,.72,.14);
  bar(metal,-11.2,1.06,z,-11.2,1.28,z,.012);bar(metal,-11.2,1.28,z,-11.02,1.28,z,.012);bar(metal,-11.02,1.28,z,-11.02,1.1,z,.01);
  shaft(metal,-11.2,.45,z,.025,.5);shaft(metal,-11.2,.22,z,.04,.08,0,0,Math.PI/2);
  add(glass,-10.48,1.72,z,.02,.78,.48);add(metal,-10.48,1.72,z,.03,.86,.56);
  add(enamel,-10.55,1.28,z,.08,.03,.48);
 }
 add(tileWet,-14.6,.02,-23.8,1.8,.008,1.1);add(tileWet,-14.4,.02,-26.1,1.6,.008,.9);add(tileWet,-12.4,.02,-25.6,1.2,.008,1.4);
 shaft(dark,-12.6,.02,-25.1,.08,.01);
 solid(-11.75,.2,-27.4,.4,.4,.28,dark);shaft(metal,-11.75,.48,-27.4,.14,.06);add(paint,-11.75,1.15,-27.55,.04,1.1,.04);add(cream,-11.75,1.0,-27.55,.08,.08,.08);
 add(warning,-12.55,.42,-23.15,.32,.02,.38,0,.4,0);add(warning,-12.55,.22,-23.0,.32,.38,.04);add(warning,-12.7,.22,-23.28,.04,.38,.32);
 fixture(-13.4,3.14,-23.6);fixture(-13.4,3.14,-26.6);lamp(-13.4,3.08,-23.6,14,7);lamp(-13.4,3.08,-26.6,14,7);
 plate('男厕所',-10.08,2.35,-25.1,Math.PI/2,.7,.28);

 // Stairs
 const rise=1.76/11,run1=Math.abs(-22.55-(-27.15))/11,run2=Math.abs(-28.2-(-32.05))/11;
 for(let i=0;i<11;i++){
  const z=-22.55-(i+.5)*run1,y=(i+1)*rise;
  add(tile,9.4,y-.025,z,3.7,.05,.34);add(trim,9.4,y+.012,z-.15,3.7,.018,.05);
  add(plaster,9.4,y-rise/2,z+.16,3.7,rise,.05);
  for(const s of [-.08,0,.08])add(dark,9.4,y+.016,z+s,3.4,.004,.018);
  if(i===0||i===5||i===10)add(warning,9.4,y+.018,z,3.5,.005,.06);
 }
 solid(7.7,.9,-25.5,.18,1.76,3.3,trim);solid(11.15,.9,-24.85,.18,1.76,4.7,trim);
 for(const x of [7.78,11.08]){
  bar(metal,x,.92,-22.7,x,.92+1.76,-27.1,.02);
  shaft(dark,x,.55,-22.65,.035,1.1);shaft(dark,x,1.76+.55,-27.15,.035,1.1);
  for(let i=0;i<11;i++){const z=-22.55-(i+.5)*run1,y=(i+1)*rise;bar(metal,x,y+.02,z,x,y+.92,z,.01)}
 }
 solid(9.45,.88,-27.68,3.9,.08,1.05,tile);
 add(terrazzo,9.45,1.78,-27.68,3.7,.02,.95);
 bar(metal,7.78,1.76+.92,-27.15,7.78,1.76+.92,-28.2,.02);
 bar(metal,11.08,1.76+.92,-27.15,11.08,1.76+.92,-28.2,.02);
 for(let i=0;i<11;i++){
  const z=-28.2-(i+.5)*run2,y=1.76+(i+1)*rise;
  add(tile,9.9,y-.025,z,2.9,.05,.3);add(trim,9.9,y+.012,z-.14,2.9,.018,.05);
  add(plaster,9.9,y-rise/2,z+.15,2.9,rise,.05);
  for(const s of [-.07,0,.07])add(dark,9.9,y+.016,z+s,2.6,.004,.016);
 }
 for(const x of [8.65,11.08]){
  bar(metal,x,1.76+.92,-28.2,x,3.52+.92,-32.05,.02);
  shaft(dark,x,1.76+.55,-28.2,.035,1.1);shaft(dark,x,3.52+.55,-32.05,.035,1.1);
  for(let i=0;i<11;i++){const z=-28.2-(i+.5)*run2,y=1.76+(i+1)*rise;bar(metal,x,y+.02,z,x,y+.92,z,.01)}
 }
 // Shaft walls. The volume under the upper flight is blocked only at ground height
 // so the mid landing and second flight stay walkable.
 solid(7.45,3.2,-30.1,.2,4.2,4.2);solid(11.45,1.7,-27.1,.25,5.2,10.2);
 solid(9.9,.8,-30.1,2.9,1.6,4);
 solid(9.45,6.7,-28.6,4.1,.16,12.2);
 wainscot(7.62,-24.9,.04,4.4);wainscot(11.28,-24.85,.04,4.6);
 fixture(9.4,4.9,-25.0,Math.PI/2);lamp(9.4,4.85,-25.0,18,8);
 add(glass,7.58,2.6,-27.7,.03,1.2,.8);add(metal,7.58,2.6,-27.7,.04,1.32,.9);

 // Floor-two corridor
 solid(11.85,3.44,-35.05,8.8,.16,6.1,tile);
 solid(11.85,6.7,-35.05,8.8,.16,6.1);
 solid(7.45,5.1,-35.05,.25,3.2,6.1);solid(16.25,5.1,-35.05,.25,3.2,6.1);
 // North wall opens onto the top of the second flight.
 solid(13.825,5.1,-32.05,4.85,3.2,.25);solid(7.975,5.1,-32.05,1.05,3.2,.25);solid(9.95,6.55,-32.05,2.9,.3,.25);
 solid(16.1,5.1,-38.05,8.3,3.2,.25);
 solid(8.6,5.1,-38.05,2.3,3.2,.25);
 for(let col=0;col<14;col++)for(let row=0;row<10;row++){
  const x=7.7+col*.6,z=-32.3-row*.55;
  if(x>16||z<-37.9)continue;
  add(tile,x,3.54,z,.54,.02,.5);
 }
 cornice(11.85,-35.05,8.6,5.9,6.55);
 wainscot(11.85,-32.22,8.6,.04);
 for(const z of [-33.2,-35.1,-36.9]){
  add(glass,7.62,5.2,z,.03,1.7,1.35);add(metal,7.62,5.2,z,.04,1.86,1.5);
  add(metal,7.62,5.2,z,.04,1.86,.04);
 }
 solid(11.85,.6,-35.05,8.9,1.2,6.2,trim);
 for(const x of [8,11.8,15.6])for(const z of [-33.2,-35.1,-36.9]){
  add(soil,x,.12,z,.75,.24,.75);
  shaft(foliage,x,.5,z,.28,.55);shaft(foliage,x+.12,.62,z-.08,.18,.4);shaft(foliage,x-.1,.58,z+.1,.16,.36);
 }
 for(let slat=0;slat<6;slat++)add(wood,14.6,4.52,-33.9-.12+slat*.12,1.5,.05,.1);
 for(const dx of [-.55,.55]){add(metal,14.6+dx,4.15,-34.15,.04,.7,.5);add(metal,14.6+dx,4.15,-33.7,.04,.7,.08)}
 solid(15.9,4.85,-36.7,.08,2.6,1.4,wood);add(metal,15.68,4.85,-36.15,.05,.1,.08);add(metal,15.9,6.18,-36.7,1.5,.08,.08);
 add(dark,9.2,4.35,-33.1,.36,1.45,.18);add(rust,9.2,4.72,-33.1,.1,.32,.1);shaft(metal,9.2,5.15,-33.1,.02,.5);
 fixture(11.8,6.38,-34.2);fixture(11.8,6.38,-36.2);lamp(11.8,6.32,-34.2,16,8);lamp(11.8,6.32,-36.2,16,8);
 plate('理科楼 2F',9.6,5.35,-32.2,Math.PI,1.2,.32);

 // Playground
 add(soil,0,-.14,-50,44,.2,36);
 const field=new T.Mesh(new T.CircleGeometry(11.85,72),earth);
 field.rotation.x=-Math.PI/2;field.position.set(0,.002,-50);field.receiveShadow=true;scene.add(field);
 for(let laneN=0;laneN<6;laneN++){
  const outer=18.2-laneN*1.05,inner=outer-1.0;
  const ring=new T.Mesh(new T.RingGeometry(inner,outer,96),track);
  ring.rotation.x=-Math.PI/2;ring.position.set(0,.018,-50);ring.receiveShadow=true;scene.add(ring);
  if(laneN===0||laneN===5){
   const line=new T.Mesh(new T.RingGeometry(outer-.04,outer+.02,96),lane);
   line.rotation.x=-Math.PI/2;line.position.set(0,.028,-50);scene.add(line);
  }
 }
 const courtMesh=new T.Mesh(new T.PlaneGeometry(11,11),court);
 courtMesh.rotation.x=-Math.PI/2;courtMesh.position.set(-8,.026,-50);courtMesh.receiveShadow=true;scene.add(courtMesh);
 // Basketball hoop
 solid(-8,1.55,-55.62,.16,3.1,.16,metal);add(dark,-8,1.1,-55.62,.28,2.2,.1);
 add(metal,-8,3.28,-55.2,1.85,.06,.1);add(cream,-8,3.3,-55.06,1.72,1.08,.05);
 add(metal,-8,3.3,-55.03,1.76,1.14,.02);add(paint,-8,3.58,-55.01,.62,.42,.01);
 const rim=new T.Mesh(new T.TorusGeometry(.23,.018,10,24),rust);
 rim.position.set(-8,2.95,-54.82);rim.rotation.x=Math.PI/2;rim.castShadow=true;scene.add(rim);
 for(let i=0;i<12;i++){
  const a=i*Math.PI*2/12;
  bar(net,-8+.22*Math.cos(a),2.95,-54.82+.22*Math.sin(a),-8+.12*Math.cos(a),2.55,-54.82+.12*Math.sin(a),.006);
 }
 for(const y of [2.82,2.68]){
  const loop=new T.Mesh(new T.TorusGeometry(y===2.82?.18:.14,.006,8,16),net);
  loop.position.set(-8,y,-54.82);loop.rotation.x=Math.PI/2;scene.add(loop);
 }
 // Soccer goal
 for(const x of [-3.2,3.2]){solid(x,1.15,-66.4,.07,2.3,.07,metal);bar(metal,x,2.3,-66.4,x,0.08,-65.7,.02)}
 bar(metal,-3.2,2.3,-66.4,3.2,2.3,-66.4,.03);
 for(let i=0;i<=8;i++)bar(net,-3.2+i*.8,2.28,-66.4,-3.2+i*.8,.08,-66.55,.006);
 for(let i=0;i<=4;i++)bar(net,-3.2,i*.45,-66.4,3.2,i*.45,-66.55,.006);
 // Flagpole
 shaft(metal,0,3.4,-36.45,.035,6.8);shaft(cream,0,6.85,-36.45,.05,.08);
 add(paint,.42,6.15,-36.45,.82,.5,.02,0,.15,.2);add(rust,.42,5.88,-36.45,.82,.08,.02,0,.15,.2);
 add(paint,.28,6.05,-36.42,.5,.42,.015,0,-.2,.15);
 // Bleachers: planks, risers, stringers
 for(let row=0;row<5;row++){
  const z=-48.4-row*.48,y=.16+row*.3;
  add(wood,-18,y,z,6.2,.05,1.05);add(trim,-18,y-.14,z+.4,6.2,.26,.08);
  for(const x of [-20.8,-18,-15.2])add(metal,x,y/2,z,.05,y,.9);
 }
 solid(-18,.8,-51.0,6.4,1.6,.12,trim);
 // Hurdles, tyre, rack, equipment cage
 for(const z of [-45.6,-47]){
  add(metal,-2,.58,z,1.25,.04,.04);shaft(metal,-2.55,.3,z,.02,.6);shaft(metal,-1.45,.3,z,.02,.6);
 }
 shaft(dark,3.1,.28,-44.2,.42,.56,Math.PI/2,0,.2);shaft(dark,4.35,.55,-43.4,.04,1.1);
 solid(18,.95,-58,3.1,1.9,2.1,metal);for(const y of [.4,1.5])for(const z of [-57.2,-58.8])bar(metal,16.5,y,z,19.5,y,z,.015);
 // Fence with caps and three rails
 for(const x of [-22,22])for(let z=-66;z<-38;z+=2.8){
  shaft(metal,x,1.15,z,.035,2.3);shaft(dark,x,2.32,z,.05,.06);
 }
 for(const z of [-38.2,-67.5])for(let x=-21;x<=21;x+=2.8){
  if(z===-38.2&&Math.abs(x)<2.1)continue;
  shaft(metal,x,1.15,z,.035,2.3);shaft(dark,x,2.32,z,.05,.06);
 }
 for(const y of [.55,1.2,1.9]){
  add(metal,0,y,-38.2,44,.03,.03);add(metal,0,y,-67.5,44,.03,.03);
  add(metal,-22,y,-52.8,.03,.03,29);add(metal,22,y,-52.8,.03,.03,29);
 }
 // Floodlights and school name
 for(const [x,z] of [[-16,-40.5],[16,-62],[16,-40.5],[-16,-62]] as const){
  shaft(metal,x,3.2,z,.07,6.4);add(dark,x,6.35,z,.7,.16,.4,0.5,0,0);add(tube,x,6.28,z,.5,.08,.22,0.5,0,0);
  const light=new T.SpotLight('#e8d9a8',42,36,Math.PI*.34,.6,1.4);
  light.position.set(x,6.2,z);light.target.position.set(x*.25,0,-50);
  light.castShadow=false;
  scene.add(light,light.target);
 }
 solid(0,.55,-38.9,3.6,1.1,.55,trim);add(cream,0,1.15,-38.62,3.2,.55,.06);plate('华东师范附属中学',0,1.15,-38.58,0,3.0,.5);

 // Corridor clutter inside the teaching building
 solid(2.4,.45,-18.6,1.1,.9,.55,wood);add(paint,2.4,.95,-18.6,.7,.08,.4);add(metal,2.55,.55,-18.35,.08,.08,.08);
 solid(-3.2,.55,8.4,.7,1.1,.45,wood);add(dark,-3.2,1.15,8.4,.5,.08,.2);
 add(paint,-2.2,.02,16.4,1.6,.05,.8,0,.4,0);add(wood,-1.6,.08,16.1,.5,.12,.35);
 solid(3.15,.4,-6.2,.85,.8,.5,wood);

 plate('门厅',-7.2,2.45,-22.08,Math.PI,1.1,.32);
 plate('操场',0,2.45,-28.05,Math.PI,1.0,.3);
 const stairSign=label('楼梯',9.6,-22.15);stairSign.position.set(9.6,2.45,-22.15);stairSign.rotation.y=Math.PI;stairSign.scale.set(.7,.7,.7);

 for(const [mat,list] of boxes){
  const mesh=new T.InstancedMesh(unit,mat,list.length);mesh.name='原创南翼盒体';
  list.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);
 }
 for(const [mat,list] of cyls){
  const mesh=new T.InstancedMesh(peg,mat,list.length);mesh.name='原创南翼管件';
  list.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);
 }
 for(const s of solids)walls.push(new T.Box3().setFromCenterAndSize(new T.Vector3(s.x,s.y,s.z),new T.Vector3(s.w,s.h,s.d)));
}
