import * as T from 'three';
/** Original joinery, authored in metres. Each moving leaf shares six merged material meshes. */
const wood=new T.MeshStandardMaterial({color:'#766047',roughness:.78});
const trim=new T.MeshStandardMaterial({color:'#4e4536',roughness:.82});
const glass=new T.MeshStandardMaterial({color:'#536c68',roughness:.73,metalness:.04});
const steel=new T.MeshStandardMaterial({color:'#90968a',roughness:.43,metalness:.72});
const dark=new T.MeshStandardMaterial({color:'#25302c',roughness:.85});
const kick=new T.MeshStandardMaterial({color:'#7c8377',roughness:.58,metalness:.48});
for(const m of [wood,trim,glass,steel,dark,kick])m.userData.authoredSurface=true;
let shared:{geometry:T.BufferGeometry;material:T.Material}[]|null=null;
function build(){
 const parts=new Map<T.Material,T.BufferGeometry[]>();
 function add(g:T.BufferGeometry,m:T.Material,x:number,y:number,z:number,rotation=0){if(rotation)g.rotateZ(rotation);g.translate(x,y,z);const list=parts.get(m)||[];list.push(g);parts.set(m,list)}
 function box(w:number,h:number,d:number,x:number,y:number,z:number,m:T.Material){add(new T.BoxGeometry(w,h,d),m,x,y,z)}
 function pin(r:number,h:number,x:number,y:number,z:number,m:T.Material,rotation=0){add(new T.CylinderGeometry(r,r,h,12),m,x,y,z,rotation)}
 // Stiles and rails surround the opaque frosted pane; separate lower recessed panel.
 for(const z of [-.605,.605])box(.12,2.6,.17,0,1.3,z,wood);
 box(.12,.18,1.04,0,2.51,0,wood);box(.12,.15,1.04,0,1.37,0,wood);box(.12,.15,1.04,0,.075,0,wood);
 box(.078,1.145,1.04,0,.7225,0,wood);box(.055,.98,1.04,0,1.94,0,glass);
 for(const face of [-1,1]){
  // Glazing beads and lower panel mouldings catch the ceiling light at the edge.
  for(const z of [-.52,.52]){box(.026,1.02,.035,face*.057,1.94,z,trim);box(.023,1.16,.025,face*.052,.725,z,trim)}
  for(const y of [1.445,2.435])box(.026,.035,1.065,face*.057,y,0,trim);
  for(const y of [.15,1.295])box(.023,.025,1.065,face*.052,y,0,trim);
  box(.009,.28,1.18,face*.066,.26,0,kick);
  // Escutcheon, spindle, curved-end pull and separate keyhole.
  box(.014,.23,.065,face*.069,1.055,-.48,steel);
  pin(.025,.06,face*.095,1.085,-.48,steel,Math.PI/2);
  // Horizontal handle follows the leaf width (Z), with rounded return at the tip.
  const lever=new T.CylinderGeometry(.018,.018,.19,12);lever.rotateX(Math.PI/2);add(lever,steel,face*.13,1.085,-.385);
  const end=new T.SphereGeometry(.018,12,8);add(end,steel,face*.13,1.085,-.29);
  pin(.012,.016,face*.08,.99,-.48,dark,Math.PI/2);
  for(const y of [.96,1.15])pin(.005,.016,face*.08,y,-.48,dark,Math.PI/2);
 }
 for(const y of [.25,1.3,2.35]){pin(.026,.14,0,y,.695,steel);for(const dy of [-.045,.045])pin(.029,.009,0,y+dy,.695,dark)}
 return [...parts].map(([material,geometries])=>{
  const positions:number[]=[],normals:number[]=[],uvs:number[]=[];
  for(const g of geometries){const flat=g.toNonIndexed();positions.push(...flat.getAttribute('position').array);normals.push(...flat.getAttribute('normal').array);uvs.push(...flat.getAttribute('uv').array);flat.dispose();g.dispose()}
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new T.Float32BufferAttribute(normals,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.computeBoundingSphere();return{geometry,material};
 });
}
export function doorLeaf(side:number){if(!shared)shared=build();const root=new T.Group();root.name='原创榫框磨砂门扇';root.position.z=-side*.7;root.scale.z=side;for(const p of shared){const mesh=new T.Mesh(p.geometry,p.material);mesh.castShadow=mesh.receiveShadow=true;root.add(mesh)}return root}
