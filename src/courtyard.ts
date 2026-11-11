import * as T from 'three';

/** Original, deterministic courtyard, in metres. The six-metre exit walk stays clear. */
export function courtyard() {
 const root = new T.Group(); root.name = '出口庭院';
 let seed = 73421;
 const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
 const stone = new T.MeshStandardMaterial({color:'#8b938a', roughness:.88});
 const darkStone = new T.MeshStandardMaterial({color:'#505c57', roughness:.94});
 const iron = new T.MeshStandardMaterial({color:'#334a43', roughness:.62, metalness:.65});
 const wood = new T.MeshStandardMaterial({color:'#77694d', roughness:.86});
 const earth = new T.MeshStandardMaterial({color:'#3c483b', roughness:1});
 const bark = new T.MeshStandardMaterial({color:'#635d4e', roughness:.95});
 const foliage = new T.MeshStandardMaterial({color:'#77906a', roughness:.9, side:T.DoubleSide});
 for (const material of [stone,darkStone,iron,wood,earth,bark,foliage]) material.userData.authoredSurface = true;
 // Small mineral variation, kept in physical metre-sized paving units rather than stretched over the site.
 const texels = new Uint8Array(128*128*4);
 for(let i=0;i<128*128;i++) { const n=155+Math.floor(random()*70);texels.set([n,n,n,255],i*4); }
 const grain = new T.DataTexture(texels,128,128,T.RGBAFormat);grain.needsUpdate=true;
 grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.magFilter=T.LinearFilter;
 grain.minFilter=T.LinearMipmapLinearFilter;grain.generateMipmaps=true;grain.anisotropy=4;
 stone.bumpMap=grain;stone.bumpScale=.012;stone.roughnessMap=grain;
 const unitBox = new T.BoxGeometry(1,1,1);
 const quaternion = new T.Quaternion(), scale = new T.Vector3();
 const batches = new Map<T.Material,{matrix:T.Matrix4,color?:T.Color}[]>();
 function block(x:number,y:number,z:number,w:number,h:number,d:number,material:T.Material,color?:T.Color) {
  const entries=batches.get(material)||[];
  entries.push({matrix:new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion(),new T.Vector3(w,h,d)),color});
  batches.set(material,entries);
 }
 block(8,-.13,50,40,.2,56,earth);
 // Individually jointed slabs and two contrasting drainage courses frame the route to the outer gate.
 for(let row=0;row<83;row++)for(let col=0;col<10;col++) {
  const brightness=.9+random()*.16;
  block(5.3+col*.6,-.012,22.3+row*.6,.587,.05,.587,stone,new T.Color(brightness,brightness,brightness));
 }
 for(const x of [4.85,11.15])for(let row=0;row<43;row++) {
  block(x,.004,22.3+row*.6,.21,.07,.587,darkStone);
  if(row%6===0) for(let slot=0;slot<5;slot++)block(x,.045,22.1+row*.6+slot*.075,.15,.008,.025,iron);
 }
 for(const x of [3.7,12.3])for(let row=0;row<26;row++)block(x,.1,22.5+row,.22,.26,.985,stone);
 // Low beds retain sight lines; benches have real seat slats, backs and steel supports.
 for(const x of [1,15])for(const z of [30.5,38.5]) {
  for(let slat=0;slat<5;slat++)block(x,.47,z-.27+slat*.135,2,.07,.105,wood);
  for(let slat=0;slat<3;slat++)block(x,.72+slat*.14,z+.31,2,.1,.055,wood);
  for(const dx of [-.72,.72]) {
   block(x+dx,.26,z,.055,.5,.62,iron);block(x+dx,.65,z+.32,.055,.8,.055,iron);
   block(x+dx,.38,z,.075,.075,.7,iron);
  }
 }
 // Boundary masonry and railings give the dawn view a distant scale reference.
 for(const x of [-4,20]) {
  block(x,.22,35,.28,.45,26,darkStone);
  for(let z=22;z<=48;z+=2.6) {block(x,.85,z,.38,1.7,.38,stone);block(x,1.73,z,.46,.1,.46,darkStone);}
  for(let z=22.3;z<48;z+=.32)block(x,.99,z,.035,1.1,.035,iron);
  for(const y of [.55,1.42])block(x,y,35,.06,.06,26,iron);
 }
 for(const [x,w] of [[.5,9],[15.5,9]]) {
  block(x,.3,47,w,.6,.35,darkStone);block(x,1.25,47,w,.065,.065,iron);
  for(let offset=-w/2+.2;offset<w/2;offset+=.32)block(x+offset,.95,47,.04,1.1,.04,iron);
 }
 for(const x of [5.1,10.9]) {block(x,1.65,47,.65,3.3,.65,stone);block(x,3.33,47,.82,.14,.82,darkStone);}
 // A pair of open gate leaves sit outside the line of travel.
 for(const x of [4.8,11.2]) {
  for(const y of [.45,2.2])block(x,y,45.8,.06,.07,2.3,iron);
  for(let z=44.7;z<47;z+=.24)block(x,1.3,z,.045,1.85,.045,iron);
 }
 // Distant neighbourhood silhouettes keep the open gate from ending at an empty ground edge.
 for(const [x,z,w,h] of [[-10,68,10,7],[12,77,12,8],[28,70,11,6]]) {
  block(x,h/2,z,w,h,6,stone);block(x,h+.12,z,w+.3,.24,6.3,darkStone);
  for(let row=0;row<3;row++)for(let col=0;col<4;col++)block(x-w*.34+col*w*.22,1.2+row*1.7,z-3.02,.85,1,.04,iron);
 }
 const branches:T.Matrix4[]=[], leaves:{matrix:T.Matrix4,color:T.Color}[]=[];
 const up=new T.Vector3(0,1,0);
 function branch(a:T.Vector3,b:T.Vector3,r:number) {
  const delta=b.clone().sub(a);quaternion.setFromUnitVectors(up,delta.clone().normalize());
  branches.push(new T.Matrix4().compose(a.clone().add(b).multiplyScalar(.5),quaternion,new T.Vector3(r,delta.length(),r)));
 }
 // Forked broadleaf trees: tapered branch hierarchy and folded individual leaves, not solid cone crowns.
 for(const x of [1,15])for(const z of [26.5,34.5,42.5]) {
  const base=new T.Vector3(x,0,z), fork=new T.Vector3(x+.1,2.7+random()*.4,z+.08);
  branch(base,fork,.24);
  for(let arm=0;arm<5;arm++) {
   const angle=arm*Math.PI*2/5+random()*.35;
   const tip=fork.clone().add(new T.Vector3(Math.cos(angle)*1.35,1.05+random()*.7,Math.sin(angle)*1.35));
   branch(fork,tip,.085);
   for(let twig=0;twig<3;twig++) {
    const a=angle+(twig-1)*.75;
    const end=tip.clone().add(new T.Vector3(Math.cos(a)*.75,.35+random()*.55,Math.sin(a)*.75));
    branch(tip,end,.03);
    for(let leaf=0;leaf<90;leaf++) {
     const az=random()*Math.PI*2,vertical=random()*2-1,r=Math.cbrt(random());
     const spread=Math.sqrt(1-vertical*vertical)*r;
     const p=end.clone().add(new T.Vector3(Math.cos(az)*spread*.85,vertical*r*.6,Math.sin(az)*spread*.85));
     quaternion.setFromEuler(new T.Euler(random()*Math.PI,random()*Math.PI*2,random()*Math.PI));
     const size=.75+random()*.65;scale.setScalar(size);
     leaves.push({matrix:new T.Matrix4().compose(p,quaternion,scale),color:new T.Color().setHSL(.22+random()*.04,.23+random()*.15,.32+random()*.2)});
    }
   }
  }
  // Tree surround with an open soil centre; supports read clearly at eye level.
  for(const dx of [-.9,.9])block(x+dx,.08,z,.12,.16,1.9,darkStone);
  for(const dz of [-.9,.9])block(x,.08,z+dz,1.7,.16,.12,darkStone);
 }
 for(const [material,entries] of batches) {
  const batch=new T.InstancedMesh(unitBox,material,entries.length);
  entries.forEach((e,i)=>{batch.setMatrixAt(i,e.matrix);if(e.color)batch.setColorAt(i,e.color)});
  batch.castShadow=material!==earth;batch.receiveShadow=true;batch.computeBoundingSphere();root.add(batch);
 }
 const branchMesh=new T.InstancedMesh(new T.CylinderGeometry(.58,1,1,9),bark,branches.length);
 branches.forEach((m,i)=>branchMesh.setMatrixAt(i,m));branchMesh.castShadow=true;branchMesh.receiveShadow=true;branchMesh.computeBoundingSphere();root.add(branchMesh);
 const leafGeometry=new T.BufferGeometry();
 leafGeometry.setAttribute('position',new T.Float32BufferAttribute([0,0,.022, 0,.22,0, -.095,.02,0, 0,-.17,0, .095,.02,0],3));
 leafGeometry.setIndex([0,1,2,0,2,3,0,3,4,0,4,1]);leafGeometry.computeVertexNormals();
 const canopy=new T.InstancedMesh(leafGeometry,foliage,leaves.length);
 leaves.forEach((e,i)=>{canopy.setMatrixAt(i,e.matrix);canopy.setColorAt(i,e.color)});canopy.castShadow=true;canopy.receiveShadow=true;canopy.computeBoundingSphere();root.add(canopy);
 root.userData.courtyardStats={pavingSlabs:830,trees:6,branches:branches.length,leaves:leaves.length,batches:root.children.length};
 return root;
}
