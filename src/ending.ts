import * as T from 'three';import{scene}from './world';import{courtyard}from './courtyard';
import {setAtmosphere} from './night-sky';
export class Ending {
 active=false;private time=0;private start=new T.Vector3();private light:T.DirectionalLight;private gate:T.Object3D[]=[];
 // Keep the shadow-light shader layout stable: prewarm once, freeze at night, update only during the ending.
 constructor(){this.light=new T.DirectionalLight('#f6dfb3',0);this.light.position.set(-3,16,30);this.light.target.position.set(8,0,36);this.light.castShadow=true;this.light.shadow.autoUpdate=false;this.light.shadow.needsUpdate=true;this.light.shadow.mapSize.set(1024,1024);Object.assign(this.light.shadow.camera,{left:-16,right:16,top:16,bottom:-16,near:.5,far:50});this.light.shadow.camera.updateProjectionMatrix();this.light.shadow.bias=-.0002;this.light.shadow.normalBias=.025;scene.add(this.light,this.light.target);scene.add(courtyard())}

 begin(camera:T.PerspectiveCamera){this.active=true;this.light.shadow.autoUpdate=true;this.time=0;this.start.copy(camera.position);this.gate=scene.children.filter(o=>o.position.z>=21.25&&o.position.z<=21.55&&o.position.x>=6&&o.position.x<=10);this.gate.forEach(o=>o.visible=false)}
 update(dt:number,camera:T.PerspectiveCamera){if(!this.active)return;this.time+=dt;const t=Math.min(this.time/6,1),ease=t*t*(3-2*t);camera.position.lerpVectors(this.start,new T.Vector3(8,1.7,29),ease);camera.rotation.x*=.97;camera.rotation.y=T.MathUtils.lerp(camera.rotation.y,Math.PI,.04);this.light.intensity=2*ease;setAtmosphere(ease);if(t===1)this.active=false}
 reset(){this.gate.forEach(o=>o.visible=true);this.active=false;this.light.intensity=0;this.light.shadow.autoUpdate=false;setAtmosphere(0)}
}
