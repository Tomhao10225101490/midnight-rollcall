import * as T from 'three';import {clear,groundAt} from './world';
export const WALK_STEP=.55;export const RUN_STEP=.28;
const WALK_BOB_Y=.028,RUN_BOB_Y=.065,WALK_ROLL=.012,RUN_ROLL=.03;
export class Player {
 private step=0;private cycle=0;private weight=0;
 constructor(private camera:T.PerspectiveCamera,private canMove=clear){}
 reset(){this.step=0;this.cycle=0;this.weight=0;this.camera.rotation.z=0}
 update(dt:number,keys:Set<string>,hidden:boolean){
  const crouch=keys.has('ControlLeft')||keys.has('ControlRight');
  const run=!crouch&&(keys.has('ShiftLeft')||keys.has('ShiftRight'));
  const v=new T.Vector3(Number(keys.has('KeyD'))-Number(keys.has('KeyA')),0,Number(keys.has('KeyS'))-Number(keys.has('KeyW'))).normalize().applyAxisAngle(new T.Vector3(0,1,0),this.camera.rotation.y);
  const p=this.camera.position,before=p.clone(),speed=crouch?1.4:run?4:2.5;
  const interval=run?RUN_STEP:WALK_STEP;
  if(!hidden){
   const yNow=groundAt(p.x,p.z);
   const x=p.x+v.x*speed*dt,z=p.z+v.z*speed*dt;
   if(this.canMove(x,p.z,false,yNow)||this.canMove(x,p.z,false,groundAt(x,p.z)))p.x=x;
   if(this.canMove(p.x,z,false,yNow)||this.canMove(p.x,z,false,groundAt(p.x,z)))p.z=z;
  }
  const moving=Math.hypot(p.x-before.x,p.z-before.z)>.0001;
  let footstep=false;
  if(moving){
   this.step+=dt;
   const previous=this.cycle;
   this.cycle+=dt*Math.PI/interval;
   if(Math.floor(previous/Math.PI)!==Math.floor(this.cycle/Math.PI)){footstep=true;this.step=0}
   if(this.step>interval){footstep=true;this.step=0}
  }
  this.weight=T.MathUtils.clamp(this.weight+(moving&&!hidden?9:-7)*dt,0,1);
  if(hidden){this.camera.rotation.z=0;return {moving,run,crouch,noise:run&&moving,footstep}}
  const ground=groundAt(p.x,p.z),eye=crouch?1:1.65,scale=crouch?.45:1;
  const ampY=(run?RUN_BOB_Y:WALK_BOB_Y)*scale,ampRoll=(run?RUN_ROLL:WALK_ROLL)*scale;
  // Footfall at cycle = nπ: vertical is lowest, matching the step sound.
  const bob=-Math.cos(this.cycle*2)*ampY*this.weight;
  const punch=Math.max(0,Math.cos(this.cycle*2))**2*ampY*.35*this.weight;
  p.y=eye+ground+bob-punch;
  this.camera.rotation.z=Math.sin(this.cycle)*ampRoll*this.weight;
  return {moving,run,crouch,noise:run&&moving,footstep};
 }
}
