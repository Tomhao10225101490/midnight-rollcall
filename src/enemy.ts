import{SearchPattern}from './search';
import{findPath}from './navigation';
import{openForEnemy}from './doors';
import * as T from 'three';
import { proctor } from './character';
import { box, clear, visible, groundAt } from './world';
export class Enemy {
    body = box(0, 1, 15, .65, 2, .65, '#292d3a');
    state = '巡逻';
    private search=new SearchPattern();
    last = new T.Vector3();
    memory = 0;
    index = 0;
    path: T.Vector3[] = [];
    timer = 0;
    model = proctor();
    walkTime = 0;
    wasHidden = false;
    sawHide = false;
    constructor() { this.body.visible = true; this.body.material.visible = false; this.body.add(this.model.root); }
    reset(){this.body.position.set(0,1,15);this.body.rotation.set(0,0,0);this.state='巡逻';this.search.reset();this.last.set(0,0,0);this.memory=0;this.index=0;this.path=[];this.timer=0;this.walkTime=0;this.wasHidden=false;this.sawHide=false;this.model.animate(0,false,this.state)}
    route(target:T.Vector3){this.path=findPath(this.body.position,target)}
    update(dt: number, p: T.Vector3, noise: boolean, hidden: boolean, alert: number, bell: boolean) { this.walkTime += dt; this.model.animate(this.walkTime, this.path.length > 0,this.state); const pos = this.body.position, d = pos.distanceTo(p); if(bell){this.search.reset();this.state='听铃';this.memory=0;this.path=[];this.timer=0;this.sawHide=false;this.wasHidden=hidden;this.model.animate(this.walkTime,false,'听铃');pos.y=1+groundAt(pos.x,pos.z);return d<.85&&visible(pos,p)&&!hidden;} const facing = new T.Vector3(Math.sin(this.body.rotation.y), 0, Math.cos(this.body.rotation.y)); const sight = d < 11 && visible(pos, p) && (d < 2 || facing.dot(p.clone().sub(pos).normalize()) > 0.25); if (hidden && !this.wasHidden) this.sawHide = sight; if (!hidden) this.sawHide = false; this.wasHidden = hidden; if ((sight && !hidden) || (noise && d < 13) || (hidden && this.sawHide && this.memory > 0)) {
        this.search.reset();
        this.last.copy(p);
        this.memory = 9;
        this.state = '追逐';
    }
    else {
        this.memory -= dt;
        if (this.memory > 0)
            this.state = '搜索';
        else
            this.state = '巡逻';
    }
    if(this.memory<=0)this.search.reset();
    const wasInspecting=this.search.inspecting;
    const target=this.state==='搜索'?this.search.target(pos,this.last,dt):this.memory>0?this.last:new T.Vector3(0,1,[-17,-5,7,18][this.index]);
    if(!wasInspecting&&this.search.inspecting)this.memory=Math.max(this.memory,6);
    if(!target){this.path=[];this.timer=0;this.body.rotation.y+=dt*.85;this.model.animate(this.walkTime,false,this.state);pos.y=1+groundAt(pos.x,pos.z);return d<1.1&&visible(pos,p)&&(!hidden||this.sawHide)} if (this.memory <= 0 && pos.distanceTo(target) < 1)
        this.index = (this.index + 1) % 4; this.timer -= dt; if (this.timer <= 0) {
        this.route(target);
        this.timer = .6;
    } const n = this.path[0]; if (n) {
        const v = n.clone().sub(pos);
        if (v.length() < .15)
            this.path.shift();
        else {
            this.body.rotation.y = Math.atan2(v.x, v.z);
            const length = Math.min(v.length(), dt * (this.state === '追逐' ? 2.6 + alert / 150 : bell ? 1 : 1.5));
            const next = pos.clone().addScaledVector(v.normalize(), length);openForEnemy(next);
            if (clear(next.x, next.z,false,groundAt(next.x,next.z)))
                pos.copy(next);
            else {
                this.path = [];
                this.timer = 0;
            }
        }
    } pos.y=1+groundAt(pos.x,pos.z); return d < 1.1 && visible(pos, p) && (!hidden || this.sawHide); }
}
