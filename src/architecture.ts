import * as T from 'three';
/** Original static fixtures. Shared geometry is instanced after authoring in local coordinates. */
export function architecturalDetails(scene:T.Scene,walls:T.Box3[]){
 const enamel=new T.MeshStandardMaterial({color:'#a5afa3',roughness:.7,metalness:.12});
 const metal=new T.MeshStandardMaterial({color:'#64736b',roughness:.48,metalness:.65});
 const dark=new T.MeshStandardMaterial({color:'#28332f',roughness:.7});
 const tube=new T.MeshStandardMaterial({color:'#e5edda',emissive:'#dce8c8',emissiveIntensity:1.8,roughness:.25});
 const face=new T.MeshStandardMaterial({color:'#c4c6ad',roughness:.82});
 const red=new T.MeshStandardMaterial({color:'#8e483c',roughness:.75});
 const geometries=new Map<string,T.BufferGeometry>(),groups:T.Group[]=[];
 function shape(key:string,make:()=>T.BufferGeometry){if(!geometries.has(key))geometries.set(key,make());return geometries.get(key)!}
 function box(g:T.Group,w:number,h:number,d:number,x:number,y:number,z:number,m:T.Material){const mesh=new T.Mesh(shape(`b/${w}/${h}/${d}`,()=>new T.BoxGeometry(w,h,d)),m);mesh.position.set(x,y,z);g.add(mesh);return mesh}
 function cylinder(g:T.Group,r:number,h:number,x:number,y:number,z:number,m:T.Material){const mesh=new T.Mesh(shape(`c/${r}/${h}`,()=>new T.CylinderGeometry(r,r,h,r>.2?64:16)),m);mesh.position.set(x,y,z);g.add(mesh);return mesh}
 function fixture(x:number,z:number){const g=new T.Group();g.position.set(x,3.2,z);groups.push(g);
  box(g,1.44,.055,.36,0,.04,0,metal);box(g,1.37,.025,.3,0,.002,0,enamel);
  for(const side of [-1,1]){box(g,1.44,.09,.025,0,-.02,side*.175,metal);box(g,.12,.08,.3,side*.64,-.035,0,enamel)}
  for(const z of [-.085,.085]){const bulb=cylinder(g,.022,1.2,0,-.055,z,tube);bulb.rotation.z=Math.PI/2;for(const x of [-.61,.61]){const socket=cylinder(g,.028,.05,x,-.055,z,dark);socket.rotation.z=Math.PI/2}}
  for(const x of [-.5,.5])box(g,.025,.12,.025,x,.11,0,metal);
 }
 for(const x of [-8,8])for(const z of [-17,-7,3,13])fixture(x,z);
 for(const z of [-18,-8,2,12])fixture(0,z);
 function radiator(x:number,z:number){const g=new T.Group();g.position.set(x,.6,z);g.rotation.y=x<0?Math.PI/2:-Math.PI/2;groups.push(g);
  for(let i=0;i<11;i++){const px=(i-5)*.12;const fin=new T.Mesh(shape('radiator-fin',()=>new T.CapsuleGeometry(.038,.54,6,12)),enamel);fin.scale.z=1.9;fin.position.x=px;g.add(fin);box(g,.09,.025,.16,px,.26,0,metal)}
  for(const y of [-.22,.22]){const manifold=cylinder(g,.025,1.4,0,y,-.02,metal);manifold.rotation.z=Math.PI/2}
  cylinder(g,.018,.9,.76,-.15,-.02,metal);const valve=cylinder(g,.045,.04,.76,.33,-.02,red);valve.rotation.z=Math.PI/2;
  const bound=new T.Box3(new T.Vector3(x-.12,.2,z-.85),new T.Vector3(x+.12,1,z+.85));walls.push(bound);
 }
 for(const x of [-11.48,11.48])for(const z of [-17,-7,3,13])radiator(x,z);
 function clock(x:number,z:number,rotation:number){const g=new T.Group();g.position.set(x,2.65,z);g.rotation.y=rotation;groups.push(g);
  const backing=cylinder(g,.31,.075,0,0,0,dark);backing.rotation.x=Math.PI/2;
  const dial=cylinder(g,.283,.014,0,0,.044,face);dial.rotation.x=Math.PI/2;
  for(let i=0;i<60;i++){const angle=i*Math.PI/30,r=i%5===0?.245:.258;const tick=box(g,i%5===0?.015:.005,i%5===0?.045:.018,.004,Math.sin(angle)*r,Math.cos(angle)*r,.054,dark);tick.rotation.z=-angle}
  // Every clock remains at the same end-of-school minute: 23:58.
  for(const [angle,length,width,material]of [[-.01745,.14,.018,dark],[-.21,.225,.009,dark],[Math.PI*.72,.245,.004,red]] as const){const hand=box(g,width,length,.007,Math.sin(angle)*length/2,Math.cos(angle)*length/2,.063,material);hand.rotation.z=-angle}
  const pin=cylinder(g,.015,.02,0,0,.075,metal);pin.rotation.x=Math.PI/2;
 }
 clock(-8,-10.16,Math.PI);clock(8,-10.16,Math.PI);clock(-8,-.16,Math.PI);
 const batches=new Map<string,{geometry:T.BufferGeometry;material:T.Material;matrices:T.Matrix4[]}>();
 for(const group of groups){group.updateMatrixWorld(true);for(const child of group.children){const mesh=child as T.Mesh<T.BufferGeometry,T.Material>,key=mesh.geometry.uuid+'/'+mesh.material.uuid;let entry=batches.get(key);if(!entry){entry={geometry:mesh.geometry,material:mesh.material,matrices:[]};batches.set(key,entry)}entry.matrices.push(mesh.matrixWorld.clone())}}
 for(const entry of batches.values()){const mesh=new T.InstancedMesh(entry.geometry,entry.material,entry.matrices.length);mesh.name='原创灯具/暖气/校钟';entry.matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingBox();mesh.computeBoundingSphere();scene.add(mesh)}
}
