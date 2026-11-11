import{corridorLighting}from './lighting';
import {schoolDesk} from './furniture';
import * as T from 'three';
export const doorBounds=new Set<T.Box3>();
export const walls: T.Box3[] = [];
export const scene = new T.Scene();
scene.background = new T.Color('#111e23');
scene.fog = new T.Fog('#111e23', 12, 45);
export function box(x: number, y: number, z: number, w: number, h: number, d: number, c: string, solid = false) { const m = new T.Mesh(new T.BoxGeometry(w, h, d), new T.MeshStandardMaterial({ color: c, roughness: .9 })); m.position.set(x, y, z); scene.add(m); if (solid)
    walls.push(new T.Box3().setFromObject(m)); return m; }
export function label(text: string, x: number, z: number) { const c = document.createElement('canvas'); c.width = 512; c.height = 128; const a = c.getContext('2d')!; a.fillStyle = '#243e39'; a.fillRect(0, 0, 512, 128); a.fillStyle = '#eadfb9'; a.font = `${Math.min(40, Math.floor(470 / Math.max(1, text.length)))}px RollcallText`; a.textAlign = 'center'; a.fillText(text, 256, 78); const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;const p = new T.Mesh(new T.PlaneGeometry(3, .75), new T.MeshStandardMaterial({ map: texture, roughness:.85, side: T.DoubleSide })); p.position.set(x, 2.4, z); scene.add(p); return p; }
function shell(...args:Parameters<typeof box>){const mesh=box(...args);mesh.userData.architecturalSurface='plaster';return mesh}
export function init() { scene.add(new T.HemisphereLight('#b3cfdb', '#30302b', 2)); shell(0, -.15, 0, 24, .3, 44, '#454f4b'); shell(0, 3.4, 0, 24, .2, 44, '#3c4540'); for (const x of [-12, 12])
    shell(x, 1.7, 0, .3, 3.4, 44, '#68756c', true); shell(0,1.7,-22,24,3.4,.3,'#69776f',true);shell(-2.75,1.7,22,18.5,3.4,.3,'#69776f',true);shell(10.75,1.7,22,2.5,3.4,.3,'#69776f',true);shell(8,3.2,22,3,.4,.3,'#69776f',true); for (const x of [-4, 4])
    for (let z = -21; z < 22; z += 1) {
        if ([-15, -5, 5, 15].some(n => Math.abs(n - z) <= 1))
            continue;
        shell(x, 1.7, z, .2, 3.4, 1, '#65766f', true);
    } for (const x of [-8, 8])
    for (const z of [-10, 0, 10])
        shell(x, 1.7, z, 8, 3.4, .2, '#61716a', true); for (const x of [-9, -6, 6, 9])
    for (const z of [-17, -14]) {
        {const desk=schoolDesk();desk.position.set(x,0,z);scene.add(desk);walls.push(new T.Box3(new T.Vector3(x-.65,.71,z-.35),new T.Vector3(x+.65,.81,z+.35)));}
    } corridorLighting(scene); }
export function clear(x: number, z: number,ignoreDoors=false) { return !walls.some(w => !(ignoreDoors&&doorBounds.has(w)) && w.min.y < 1.8 && w.max.y > .1 && x > w.min.x - .3 && x < w.max.x + .3 && z > w.min.z - .3 && z < w.max.z + .3); }
export function visible(a: T.Vector3, b: T.Vector3) { const d = b.clone().sub(a), ray = new T.Ray(a, d.clone().normalize()); return !walls.some(w => { const hit = ray.intersectBox(w, new T.Vector3()); return hit && hit.distanceTo(a) < d.length(); }); }
