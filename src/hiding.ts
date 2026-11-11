import * as T from 'three';
/** Cabinet interaction separates the concealed viewpoint from the witnessed entry point. */
export class HidingSpot{
 readonly bounds=new T.Box3(new T.Vector3(7,.08,-7.5),new T.Vector3(9,2.05,-6.46));
 readonly entrance=new T.Vector3(8,1.65,-5.9);
 readonly viewpoint=new T.Vector3(7.525,1.59,-6.67);
 private entry=new T.Vector3();private savedRotation=new T.Euler();active=false;
 canEnter(p:T.Vector3){return p.z>-6.4&&Math.hypot(p.x-8,p.z+5.9)<1.6}
 enter(camera:T.PerspectiveCamera){if(this.active||!this.canEnter(camera.position))return false;this.entry.copy(camera.position);this.savedRotation.copy(camera.rotation);camera.position.copy(this.viewpoint);camera.rotation.set(0,Math.PI,0);this.active=true;return true}
 leave(camera:T.PerspectiveCamera){if(!this.active)return;camera.position.copy(this.entry);camera.position.y=1.65;camera.rotation.copy(this.savedRotation);this.active=false}
 reset(){this.active=false}
 target(camera:T.PerspectiveCamera){return this.active?this.entry:camera.position}
 constrain(camera:T.PerspectiveCamera){if(!this.active)return;camera.position.copy(this.viewpoint);camera.rotation.y=T.MathUtils.clamp(camera.rotation.y,Math.PI-.4,Math.PI+.4);camera.rotation.x=T.MathUtils.clamp(camera.rotation.x,-.14,.14)}
}
