import * as T from 'three';

/** Original school-office pen and hand stamp, modelled in metres. */
export function deskTools(){
 const group=new T.Group();
 const lacquer=new T.MeshStandardMaterial({color:'#192b27',roughness:.26,metalness:.12});
 const steel=new T.MeshStandardMaterial({color:'#bdc2b8',roughness:.3,metalness:.82});
 const rubber=new T.MeshStandardMaterial({color:'#342825',roughness:.95});
 const handle=new T.MeshStandardMaterial({color:'#714331',roughness:.42});
 const add=(parent:T.Object3D,geometry:T.BufferGeometry,material:T.Material,x:number,y:number,z:number)=>{const mesh=new T.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh};
 const pen=new T.Group();pen.position.set(.31,.841,.035);pen.rotation.set(Math.PI/2,0,.3);group.add(pen);
 add(pen,new T.CylinderGeometry(.007,.007,.22,12),lacquer,0,0,0);
 add(pen,new T.CylinderGeometry(.008,.008,.057,12),lacquer,0,-.084,0);
 add(pen,new T.CylinderGeometry(.0083,.0083,.006,12),steel,0,-.055,0);
 add(pen,new T.ConeGeometry(.007,.025,12),steel,0,.122,0);
 add(pen,new T.ConeGeometry(.002,.007,8),rubber,0,.138,0);
 add(pen,new T.BoxGeometry(.003,.048,.002),steel,0,-.077,.009);
 add(group,new T.BoxGeometry(.13,.018,.075),rubber,.5,.837,-.25);
 add(group,new T.BoxGeometry(.135,.012,.08),handle,.5,.852,-.25);
 const profile=[new T.Vector2(0,0),new T.Vector2(.027,0),new T.Vector2(.018,.018),new T.Vector2(.014,.042),new T.Vector2(.023,.067),new T.Vector2(.025,.085),new T.Vector2(.016,.097),new T.Vector2(0,.1)];
 add(group,new T.LatheGeometry(profile,20),handle,.5,.858,-.25);
 return group;
}
