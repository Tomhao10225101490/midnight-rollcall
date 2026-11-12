import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {propSurface} from './prop-surfaces';
// Original school furniture, metres. Geometry/materials are shared across every copy.
const templates:{desk?:T.Group,chair?:T.Group}={};
export function scannedFurniture(){return Boolean(templates.desk&&templates.chair)}
function readyModel(scene:T.Object3D,name:string){
 const root=new T.Group();root.name=name;
 const model=scene.clone(true);
 model.traverse(object=>{
  const mesh=object as T.Mesh;
  if(!mesh.isMesh)return;
  mesh.castShadow=mesh.receiveShadow=true;
  const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];
  for(const material of materials){
   if(!(material instanceof T.MeshStandardMaterial))continue;
   if(material.map)material.map.colorSpace=T.SRGBColorSpace;
   material.userData.authoredSurface=true;
  }
 });
 root.add(model);return root;
}
export async function loadFurnitureModels(){
 const loader=new GLTFLoader();
 const [desk,chair]=await Promise.all([
  loader.loadAsync('./models/SchoolDesk_01_2k/SchoolDesk_01_2k.gltf'),
  loader.loadAsync('./models/SchoolChair_01_2k/SchoolChair_01_2k.gltf')
 ]);
 templates.desk=readyModel(desk.scene,'扫描课桌');
 templates.chair=readyModel(chair.scene,'扫描课椅');
}
const wood=propSurface('timber');
const edge=new T.MeshStandardMaterial({color:'#5b4936',roughness:.84});
edge.userData.authoredSurface=true;
const steel=new T.MeshStandardMaterial({color:'#53645d',metalness:.55,roughness:.48});
const rubber=new T.MeshStandardMaterial({color:'#222b29',roughness:.94});
const paper=new T.MeshStandardMaterial({color:'#d6cfb8',roughness:.96});
const screw=new T.MeshStandardMaterial({color:'#929786',metalness:.8,roughness:.36});
const geometry=new Map<string,T.BufferGeometry>();
function rounded(w:number,h:number,d:number){const key=`${w}/${h}/${d}`;if(geometry.has(key))return geometry.get(key)!;
 const r=Math.min(.018,h*.24),s=new T.Shape();s.moveTo(-w/2+r,-d/2+r);s.lineTo(w/2-r,-d/2+r);s.lineTo(w/2-r,d/2-r);s.lineTo(-w/2+r,d/2-r);s.closePath();const g=new T.ExtrudeGeometry(s,{depth:h-r*2,bevelEnabled:true,bevelSize:r,bevelThickness:r,bevelSegments:3,steps:1});g.rotateX(-Math.PI/2);g.translate(0,-h/2+r,0);geometry.set(key,g);return g}
function part(root:T.Group,w:number,h:number,d:number,x:number,y:number,z:number,material:T.Material){const m=new T.Mesh(rounded(w,h,d),material);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;root.add(m);return m}
function proceduralDesk(){const root=new T.Group();root.name='原创双立柱课桌';
 part(root,1.3,.065,.7,0,.7775,0,wood);
 // Recessed pencil groove, edge band and an open book compartment.
 part(root,.46,.004,.016,.2,.813,-.25,edge);
 part(root,1.23,.025,.62,0,.735,0,edge);
 part(root,1.1,.025,.48,0,.52,-.025,steel);
 for(const x of [-.55,.55])part(root,.025,.2,.48,x,.625,-.025,steel);
 part(root,1.1,.2,.025,0,.625,-.265,steel);
 for(const x of [-.48,.48]){part(root,.055,.68,.055,x,.37,0,steel);part(root,.07,.045,.62,x,.05,0,steel);for(const z of [-.28,.28])part(root,.085,.06,.09,x,.045,z,rubber)}
 part(root,.97,.035,.035,0,.26,0,steel);
 const hook=part(root,.012,.09,.03,-.64,.55,.28,steel);hook.rotation.x=.7;
 part(root,.03,.012,.05,-.64,.5,.3,steel);
 const book=part(root,.33,.025,.28,-.22,.55,-.025,paper);book.rotation.y=.06;
 part(root,.36,.014,.45,.05,.819,.015,paper).rotation.y=-.045;
 for(const x of [-.58,.58])for(const z of [-.26,.26])part(root,.012,.003,.012,x,.813,z,screw);
 return root;
}
function proceduralChair(){const root=new T.Group();root.name='原创木面钢架课椅';
 part(root,.53,.05,.49,0,.44,0,wood);
 for(const x of [-.22,.22])for(const z of [-.19,.19]){part(root,.035,.4,.035,x,.22,z,steel);part(root,.05,.045,.05,x,.025,z,rubber)}
 for(const x of [-.22,.22])part(root,.035,.47,.035,x,.69,.2,steel);
 part(root,.5,.035,.045,0,.695,.22,wood);
 for(const y of [.76,.86,.96])part(root,.48,.055,.03,0,y,.225,wood);
 part(root,.47,.025,.025,0,.18,.19,steel);
 for(const x of [-.2,.2]){part(root,.012,.012,.008,x,.96,.246,screw);part(root,.012,.012,.008,x,.695,.246,screw)}
 return root;
}
export function schoolDesk(){return templates.desk?templates.desk.clone(true):proceduralDesk()}
export function schoolChair(){return templates.chair?templates.chair.clone(true):proceduralChair()}
export function storageCabinet(){const root=new T.Group();root.name='原创储物铁柜';
 part(root,2,.08,1,0,.1,0,steel);part(root,2,.08,1,0,2,0,steel);
 for(const x of [-.96,.96])part(root,.08,1.84,1,x,1.04,0,steel);
 part(root,1.85,1.84,.045,0,1.04,-.48,steel);
 const enamel=new T.MeshStandardMaterial({color:'#6a7670',metalness:.35,roughness:.55});
 const plate=new T.MeshStandardMaterial({color:'#c5c1a8',metalness:.4,roughness:.45});
 const ink=new T.MeshStandardMaterial({color:'#1c1f1d',roughness:.9});
 for(const x of [-.475,.475]){
  // Recessed double doors, number plates and a real handle pocket; louvres stay see-through from inside.
  part(root,.92,1.84,.03,x,1.04,.445,enamel);
  part(root,.86,1.22,.05,x,.78,.49,steel);part(root,.86,.16,.05,x,1.83,.49,steel);
  for(const dx of [-.38,.38])part(root,.1,.28,.05,x+dx,1.58,.49,steel);
  for(const y of [1.44,1.515,1.59,1.665,1.74]){const louvre=part(root,.66,.016,.08,x,y,.51,steel);louvre.rotation.x=-.32;}
  part(root,.9,.018,.06,x,.18,.5,steel);part(root,.9,.018,.06,x,1.92,.5,steel);
  for(const dx of [-.43,.43])part(root,.018,1.74,.06,x+dx,1.04,.5,steel);
  part(root,.16,.09,.012,x+(x<0?-.28:.28),1.62,.53,plate);
  part(root,.018,.06,.006,x+(x<0?-.30:.26),1.62,.538,ink);part(root,.018,.06,.006,x+(x<0?-.26:.30),1.62,.538,ink);
  const handle=part(root,.018,.16,.07,x+(x<0?.34:-.34),1.02,.545,screw);
  handle.rotation.x=.08;
  part(root,.05,.04,.04,x+(x<0?.34:-.34),1.1,.52,screw);
  for(const y of [.28,1.78])part(root,.03,.08,.03,x+(x<0?-.4:.4),y,.52,screw);
 }
 part(root,.04,1.7,.08,0,1.02,.5,steel);
 for(const x of [-.96,.96])for(const y of [.35,1.05,1.75]){
  part(root,.03,.1,.08,x,y,.52,screw);
  part(root,.018,.018,.12,x,y,.46,screw);
 }
 for(const x of [-.55,.55])for(const z of [-.2,.2])part(root,.35,.02,.16,x,.16,z,steel);
 for(const x of [-.8,.8])for(const z of [-.35,.35])part(root,.1,.1,.1,x,.05,z,rubber);
 return root;
}
