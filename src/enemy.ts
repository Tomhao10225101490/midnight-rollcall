import{openForEnemy}from './doors';
import * as T from 'three';
import { proctor } from './character';
import { box, clear, visible } from './world';
export class Enemy {
    body = box(0, 1, 15, .65, 2, .65, '#292d3a');
    state = '巡逻';
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
    route(target: T.Vector3) { const start = [Math.round(this.body.position.x), Math.round(this.body.position.z)], end = [Math.round(target.x), Math.round(target.z)], q = [start], seen = new Map<string, number[]>(); seen.set(start.join(), start); let found = false; for (let i = 0; i < q.length && i < 2000; i++) {
        const p = q[i];
        if (p[0] === end[0] && p[1] === end[1]) {
            found = true;
            break;
        }
        for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const n = [p[0] + d[0], p[1] + d[1]];
            if (Math.abs(n[0]) > 11 || Math.abs(n[1]) > 21 || !clear(n[0],n[1],true) || seen.has(n.join()))
                continue;
            seen.set(n.join(), p);
            q.push(n);
        }
    } this.path = []; if (found) {
        let p = end;
        while (p.join() !== start.join()) {
            this.path.unshift(new T.Vector3(p[0], 1, p[1]));
            p = seen.get(p.join())!;
        }
    } }
    update(dt: number, p: T.Vector3, noise: boolean, hidden: boolean, alert: number, bell: boolean) { this.walkTime += dt; this.model.animate(this.walkTime, this.path.length > 0,this.state); const pos = this.body.position, d = pos.distanceTo(p); if(bell){this.state='听铃';this.memory=0;this.path=[];this.timer=0;this.sawHide=false;this.model.animate(this.walkTime,false,'听铃');return d<.85&&visible(pos,p)&&!hidden;} const facing = new T.Vector3(Math.sin(this.body.rotation.y), 0, Math.cos(this.body.rotation.y)); const sight = d < 11 && visible(pos, p) && (d < 2 || facing.dot(p.clone().sub(pos).normalize()) > 0.25); if (hidden && !this.wasHidden) this.sawHide = sight; if (!hidden) this.sawHide = false; this.wasHidden = hidden; if ((sight && !hidden) || (noise && d < 13) || (hidden && this.sawHide && this.memory > 0)) {
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
    } const target = this.memory > 0 ? this.last : new T.Vector3(0, 1, [-17, -5, 7, 18][this.index]); if (this.memory <= 0 && pos.distanceTo(target) < 1)
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
            if (clear(next.x, next.z))
                pos.copy(next);
            else {
                this.path = [];
                this.timer = 0;
            }
        }
    } return d < .85 && visible(pos, p) && (!hidden || this.sawHide); }
}
