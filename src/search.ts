import * as T from 'three';
import {clear} from './world';
import {findPath} from './navigation';

/** Inspect a finite local neighbourhood of the last evidence, never the hidden player. */
export class SearchPattern {
 private points:T.Vector3[]=[];
 private active=false;
 private dwell=0;
 get inspecting(){return this.active}
 reset(){this.points=[];this.active=false;this.dwell=0}
 target(position:T.Vector3,evidence:T.Vector3,dt:number){
  if(!this.active){
   if(Math.hypot(position.x-evidence.x,position.z-evidence.z)>.65)return evidence;
   this.active=true;this.dwell=.8;
   for(const [dx,dz]of [[0,2.5],[2.5,0],[0,-2.5],[-2.5,0]]){
    const point=new T.Vector3(evidence.x+dx,1,evidence.z+dz);
    if(!clear(point.x,point.z,true))continue;
    const path=findPath(position,point);if(!path.length||path.at(-1)!.distanceTo(point)>.2)continue;
    let length=0,previous=position;for(const step of path){length+=previous.distanceTo(step);previous=step}
    if(length<=6)this.points.push(point);
   }
  }
  if(this.dwell>0){this.dwell-=dt;return null}
  const point=this.points[0];if(!point)return null;
  if(position.distanceTo(point)<.4){this.points.shift();this.dwell=.7;return null}
  return point;
 }
}
