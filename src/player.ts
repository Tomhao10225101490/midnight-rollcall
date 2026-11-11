import * as T from 'three';import {clear} from './world';
export class Player {
 private step=0;
 constructor(private camera:T.PerspectiveCamera,private canMove=clear){}
 reset(){this.step=0}
 update(dt:number,keys:Set<string>,hidden:boolean){
  const crouch=keys.has('ControlLeft')||keys.has('ControlRight');
  const run=!crouch&&(keys.has('ShiftLeft')||keys.has('ShiftRight'));
  const v=new T.Vector3(Number(keys.has('KeyD'))-Number(keys.has('KeyA')),0,Number(keys.has('KeyS'))-Number(keys.has('KeyW'))).normalize().applyAxisAngle(new T.Vector3(0,1,0),this.camera.rotation.y);
  const p=this.camera.position,before=p.clone(),speed=crouch?1.4:run?4:2.5;
  if(!hidden){const x=p.x+v.x*speed*dt,z=p.z+v.z*speed*dt;if(this.canMove(x,p.z))p.x=x;if(this.canMove(p.x,z))p.z=z}
  const moving=Math.hypot(p.x-before.x,p.z-before.z)>.0001;
  let footstep=false;if(moving){this.step+=dt;if(this.step>(run?.28:.55)){footstep=true;this.step=0}}
  if(!hidden)p.y=crouch?1:1.65;
  return {moving,run,crouch,noise:run&&moving,footstep};
 }
}
