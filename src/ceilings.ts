import * as T from 'three';

/** Original acoustic-tile ceilings and service fittings, just under the structural slabs. */
function tileMaps(){
 const size=256,color=new Uint8Array(size*size*4),height=new Uint8Array(color.length),rough=new Uint8Array(color.length);
 let seed=8441;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const bar=14;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const grid=x<bar||y<bar||x>size-bar||y>size-bar;
  const n=rnd(),stain=Math.pow(rnd(),4),i=(y*size+x)*4;
  const v=grid?78+n*10:214+n*8-stain*32;
  color[i]=v;color[i+1]=v*(grid?.98:1.01);color[i+2]=v*(grid?.94:.96);color[i+3]=255;
  const h=grid?70:148+n*18-stain*24;
  height[i]=height[i+1]=height[i+2]=h;height[i+3]=255;
  const r=grid?90:200+n*20+stain*30;
  rough[i]=rough[i+1]=rough[i+2]=r;rough[i+3]=255;
 }
 const tex=(pixels:Uint8Array,srgb=false)=>{const t=new T.DataTexture(pixels,size,size);t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=8;if(srgb)t.colorSpace=T.SRGBColorSpace;t.needsUpdate=true;return t};
 return{map:tex(color,true),bumpMap:tex(height),roughnessMap:tex(rough)};
}

export function ceilings(scene:T.Scene){
 const maps=tileMaps();
 const tile=new T.MeshStandardMaterial({color:'#d8d4c6',roughness:.86,metalness:0,emissive:'#2c2a24',emissiveIntensity:.05,map:maps.map,bumpMap:maps.bumpMap,roughnessMap:maps.roughnessMap,bumpScale:.01,side:T.FrontSide,depthWrite:true});
 tile.userData.authoredSurface=true;
 const metal=new T.MeshStandardMaterial({color:'#6d7570',roughness:.45,metalness:.65});
 const dark=new T.MeshStandardMaterial({color:'#2c3330',roughness:.7,metalness:.3});
 const enamel=new T.MeshStandardMaterial({color:'#8b948c',roughness:.55,metalness:.2});
 for(const m of [metal,dark,enamel])m.userData.authoredSurface=true;

 function plane(x:number,y:number,z:number,w:number,d:number){
  const g=new T.PlaneGeometry(w,d,1,1),uv=g.getAttribute('uv');
  for(let i=0;i<uv.count;i++)uv.setXY(i,(g.getAttribute('position').getX(i)+w/2)/.6,(g.getAttribute('position').getY(i)+d/2)/.6);
  uv.needsUpdate=true;
  const mesh=new T.Mesh(g,tile);mesh.rotation.x=Math.PI/2;mesh.position.set(x,y,z);
  mesh.receiveShadow=true;mesh.castShadow=false;mesh.name='原创吊顶扣板';scene.add(mesh);
 }
 // Underside of each known structural slab. Tiles sit just below so looking up reads the grid.
 plane(0,3.16,0,23.6,43.6);
 plane(-1.45,3.20,-25.1,17.2,6.0);
 plane(-13.4,3.20,-25.1,6.1,6.0);
 plane(9.45,6.48,-28.6,3.9,12.0);
 plane(11.85,6.48,-35.05,8.5,5.9);

 const box=new T.BoxGeometry(1,1,1),peg=new T.CylinderGeometry(1,1,1,12);
 const boxes=new Map<T.Material,T.Matrix4[]>(),cyls=new Map<T.Material,T.Matrix4[]>();
 function add(mat:T.Material,x:number,y:number,z:number,w:number,h:number,d:number){
  const list=boxes.get(mat)||[];list.push(new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion(),new T.Vector3(w,h,d)));boxes.set(mat,list);
 }
 function shaft(mat:T.Material,x:number,y:number,z:number,r:number,h:number,rx=0,rz=0){
  const list=cyls.get(mat)||[];list.push(new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,0,rz)),new T.Vector3(r,h,r)));cyls.set(mat,list);
 }
 function vent(x:number,y:number,z:number){
  add(metal,x,y,z,.62,.04,.42);add(dark,x,y-.02,z,.54,.02,.34);
  for(const s of [-.12,0,.12])add(metal,x,y-.03,z+s,.5,.01,.03);
 }
 function sprinkler(x:number,y:number,z:number){
  shaft(metal,x,y,z,.03,.08);shaft(dark,x,y-.05,z,.06,.02);shaft(enamel,x,y-.07,z,.045,.01);
 }
 // Service run along the main corridor edges, plus vents and sprinklers on a regular grid.
 for(const x of [-3.6,3.6]){
  shaft(metal,x,3.11,0,.045,42,Math.PI/2,0);
  shaft(dark,x+.12,3.08,0,.03,42,Math.PI/2,0);
 }
 for(let z=-20;z<=20;z+=4){
  vent(-10.6,3.13,z);vent(10.6,3.13,z);
  if(Math.abs(z)%8===0)vent(0,3.13,z+1.6);
 }
 for(let x=-10;x<=10;x+=4)for(let z=-18;z<=18;z+=6){
  if(Math.abs(x)<3&&Math.abs(z%10)<1)continue;
  sprinkler(x,3.13,z);
 }
 // Annex ceilings
 for(const x of [-8,5])shaft(metal,x,3.15,-25.1,.035,5.6,Math.PI/2,0);
 vent(-4.2,3.15,-23.6);vent(3.8,3.15,-26.4);
 sprinkler(-6,3.15,-25.1);sprinkler(2.2,3.15,-25.1);
 vent(-13.4,3.15,-25.1);sprinkler(-14.8,3.15,-23.8);sprinkler(-12.2,3.15,-26.4);
 vent(11.8,6.43,-35.1);sprinkler(9.4,6.43,-33.4);sprinkler(14.2,6.43,-36.6);
 shaft(metal,10.2,6.41,-35.05,.03,5.4,Math.PI/2,0);

 for(const [mat,list] of boxes){
  const mesh=new T.InstancedMesh(box,mat,list.length);mesh.name='原创吊顶配件';
  list.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);
 }
 for(const [mat,list] of cyls){
  const mesh=new T.InstancedMesh(peg,mat,list.length);mesh.name='原创吊顶管线';
  list.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);
 }
}
