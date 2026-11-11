import * as T from 'three';
// Original school furniture, metres. Geometry/materials are shared across every copy.
const wood=new T.MeshStandardMaterial({color:'#806445',roughness:.76});
const edge=new T.MeshStandardMaterial({color:'#5b4936',roughness:.84});
const steel=new T.MeshStandardMaterial({color:'#53645d',metalness:.55,roughness:.48});
const rubber=new T.MeshStandardMaterial({color:'#222b29',roughness:.94});
const paper=new T.MeshStandardMaterial({color:'#d6cfb8',roughness:.96});
const screw=new T.MeshStandardMaterial({color:'#929786',metalness:.8,roughness:.36});
const geometry=new Map<string,T.BufferGeometry>();
function rounded(w:number,h:number,d:number){const key=`${w}/${h}/${d}`;if(geometry.has(key))return geometry.get(key)!;
 const r=Math.min(.018,h*.24),s=new T.Shape();s.moveTo(-w/2+r,-d/2+r);s.lineTo(w/2-r,-d/2+r);s.lineTo(w/2-r,d/2-r);s.lineTo(-w/2+r,d/2-r);s.closePath();const g=new T.ExtrudeGeometry(s,{depth:h-r*2,bevelEnabled:true,bevelSize:r,bevelThickness:r,bevelSegments:3,steps:1});g.rotateX(-Math.PI/2);g.translate(0,-h/2+r,0);geometry.set(key,g);return g}
function part(root:T.Group,w:number,h:number,d:number,x:number,y:number,z:number,material:T.Material){const m=new T.Mesh(rounded(w,h,d),material);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;root.add(m);return m}
export function schoolDesk(){const root=new T.Group();root.name='原创双立柱课桌';
 part(root,1.3,.065,.7,0,.7775,0,wood);
 // Recessed pencil groove, edge band and an open book compartment.
 part(root,.46,.004,.016,.2,.813,-.25,edge);
 part(root,1.23,.025,.62,0,.735,0,edge);
 part(root,1.1,.025,.48,0,.52,-.025,steel);
 for(const x of [-.55,.55])part(root,.025,.2,.48,x,.625,-.025,steel);
 part(root,1.1,.2,.025,0,.625,-.265,steel);
 for(const x of [-.48,.48]){part(root,.055,.68,.055,x,.37,0,steel);part(root,.07,.045,.62,x,.05,0,steel);for(const z of [-.28,.28])part(root,.085,.06,.09,x,.045,z,rubber)}
 part(root,.97,.035,.035,0,.26,0,steel);
 const book=part(root,.33,.025,.28,-.22,.55,-.025,paper);book.rotation.y=.06;
 part(root,.36,.014,.45,.05,.819,.015,paper).rotation.y=-.045;
 for(const x of [-.58,.58])for(const z of [-.26,.26])part(root,.012,.003,.012,x,.813,z,screw);
 return root;
}
export function schoolChair(){const root=new T.Group();root.name='原创木面钢架课椅';
 part(root,.53,.05,.49,0,.44,0,wood);
 for(const x of [-.22,.22])for(const z of [-.19,.19]){part(root,.035,.4,.035,x,.22,z,steel);part(root,.05,.045,.05,x,.025,z,rubber)}
 for(const x of [-.22,.22])part(root,.035,.47,.035,x,.69,.2,steel);
 part(root,.53,.24,.045,0,.81,.22,wood);part(root,.47,.025,.025,0,.18,.19,steel);
 for(const x of [-.2,.2])part(root,.012,.012,.008,x,.81,.246,screw);return root;
}
export function storageCabinet(){const root=new T.Group();root.name='原创储物铁柜';
 part(root,2,.08,1,0,.1,0,steel);part(root,2,.08,1,0,2,0,steel);
 for(const x of [-.96,.96])part(root,.08,1.84,1,x,1.04,0,steel);
 part(root,1.85,1.84,.045,0,1.04,-.48,steel);
 for(const x of [-.475,.475]){part(root,.92,1.78,.055,x,1.04,.48,steel);
  for(const y of [1.5,1.57,1.64,1.71])part(root,.58,.018,.007,x,y,.511,rubber);
  part(root,.04,.17,.04,x+(x<0?.32:-.32),1.04,.53,screw);
  for(const y of [.32,1.72])part(root,.035,.09,.035,x+(x<0?-.44:.44),y,.51,screw);
 }
 for(const x of [-.8,.8])for(const z of [-.35,.35])part(root,.1,.1,.1,x,.05,z,rubber);
 return root;
}
