import * as T from 'three';import{scene,box}from './world';
export class Ending {
 active=false;private time=0;private start=new T.Vector3();private light:T.DirectionalLight;private gate:T.Object3D[]=[];
 constructor(){this.light=new T.DirectionalLight('#f6dfb3',0);this.light.position.set(5,8,30);scene.add(this.light);box(8,-.08,32,24,.1,20,'#6e7970');for(const x of [-1,17])for(const z of [27,33,39]){box(x,1.5,z,.22,3,.22,'#4d5140');const leaves=new T.Mesh(new T.ConeGeometry(1.2,3,9),new T.MeshStandardMaterial({color:'#435a48'}));leaves.position.set(x,3,z);scene.add(leaves)}}
 begin(camera:T.PerspectiveCamera){this.active=true;this.time=0;this.start.copy(camera.position);this.gate=scene.children.filter(o=>o.position.z>=21.25&&o.position.z<=21.55&&o.position.x>=6&&o.position.x<=10);this.gate.forEach(o=>o.visible=false)}
 update(dt:number,camera:T.PerspectiveCamera){if(!this.active)return;this.time+=dt;const t=Math.min(this.time/6,1),ease=t*t*(3-2*t);camera.position.lerpVectors(this.start,new T.Vector3(8,1.7,29),ease);camera.rotation.x*=.97;camera.rotation.y=T.MathUtils.lerp(camera.rotation.y,Math.PI,.04);this.light.intensity=2*ease;scene.background=new T.Color('#111e23').lerp(new T.Color('#8caaa4'),ease);if(scene.fog instanceof T.Fog)scene.fog.color.copy(scene.background as T.Color);if(t===1)this.active=false}
 reset(){this.gate.forEach(o=>o.visible=true);this.active=false;this.light.intensity=0;scene.background=new T.Color('#111e23');if(scene.fog instanceof T.Fog)scene.fog.color.set('#111e23')}
}
