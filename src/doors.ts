import * as T from 'three';import{scene,walls,doorBounds}from './world';
export const doors:Door[]=[];
export class Door{
 open=false;bounds:T.Box3;leaves:T.Group[]=[];
 constructor(public x:number,public z:number){this.bounds=new T.Box3(new T.Vector3(x-.12,0,z-1.5),new T.Vector3(x+.12,2.7,z+1.5));walls.push(this.bounds);doorBounds.add(this.bounds);for(const side of [-1,1]){const pivot=new T.Group();pivot.position.set(x,0,z+side*1.4);scene.add(pivot);const wood=new T.Mesh(new T.BoxGeometry(.12,2.6,1.38),new T.MeshStandardMaterial({color:'#655340',roughness:.8}));wood.position.set(0,1.3,-side*.7);wood.castShadow=true;pivot.add(wood);const glass=new T.Mesh(new T.BoxGeometry(.135,.8,.8),new T.MeshStandardMaterial({color:'#78938d',roughness:.55,metalness:.1}));glass.position.set(0,1.85,-side*.7);pivot.add(glass);const handle=new T.Mesh(new T.BoxGeometry(.19,.24,.04),new T.MeshStandardMaterial({color:'#b0a57b',metalness:.7,roughness:.3}));handle.position.set(0,1.05,-side*1.2);pivot.add(handle);this.leaves.push(pivot)}}
 set(open:boolean){this.open=open;this.leaves.forEach((leaf,i)=>leaf.rotation.y=open?(i===0?1:-1)*(this.x<0?-1:1)*Math.PI/2:0);if(open)this.bounds.makeEmpty();else this.bounds.set(new T.Vector3(this.x-.12,0,this.z-1.5),new T.Vector3(this.x+.12,2.7,this.z+1.5))}
}
export function initDoors(){for(const x of [-4,4])for(const z of [-15,-5,5,15])doors.push(new Door(x,z))}
export function nearestDoor(p:T.Vector3,range=2){return doors.find(d=>Math.hypot(d.x-p.x,d.z-p.z)<range)}
export function resetDoors(){doors.forEach(d=>d.set(false))}
export function openForEnemy(p:T.Vector3){const door=nearestDoor(p,1.35);if(door&&!door.open)door.set(true)}
