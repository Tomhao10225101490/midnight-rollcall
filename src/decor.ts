import * as T from 'three';
import { box, label, scene } from './world';
export function decorate() {
    const tileGeo=new T.BoxGeometry(.98,.018,.98);
    const tileMat=new T.MeshStandardMaterial({color:'#737e73',roughness:.78});
    const tiles=new T.InstancedMesh(tileGeo,tileMat,24*44);const matrix=new T.Matrix4();let tileIndex=0;
    for(let x=-12;x<12;x++)for(let z=-22;z<22;z++){matrix.makeTranslation(x+.5,.015,z+.5);tiles.setMatrixAt(tileIndex,matrix);tiles.setColorAt(tileIndex,new T.Color((x+z)%2?'#68766f':'#798078'));tileIndex++}tiles.receiveShadow=true;scene.add(tiles);
    const roomNames=[['一班 · 试卷','档案办公室','广播控制室','配电值班室'],['二班 · 考场','储物间 · 躲藏','纪律公示室','东侧校门']];
    for(const [side,x] of [-4,4].entries())for(const [i,z]of [-15,-5,5,15].entries()){
        box(x,3.05,z,.28,.7,3.1,'#4e5c54',true);
        for(const dz of [-1.55,1.55])box(x,1.55,z+dz,.32,3.1,.12,'#514a3c');
        const sign=label(roomNames[side][i],x+(x<0?.2:-.2),z);sign.rotation.y=x<0?Math.PI/2:-Math.PI/2;sign.position.y=2.93;sign.scale.set(.75,.6,1);
        box(x<0?-3.82:3.82,.16,z,.08,.3,2.8,'#b8ab7f');
    }
    // Recognizable, original room furniture; furniture away from doorways.
    for (const x of [-8, 8]) {
        box(x, 1.9, -21.7, 6, 1.5, .1, '#1e3e36');
        label(x < 0 ? '自习公约 · 安静行走' : '高三二班 · 无人交卷', x, -21.5);
        for (const z of [-17, -14])
            for (const a of [x - 1, x + 2]) {
                box(a, .34, z + 1, .7, .65, .7, '#554734');
                box(a, .8, z + 1.3, .7, .7, .08, '#66523c');
            }
    }
    for (let z = -20; z < 21; z += 3) {
        for (const x of [-11.8, 11.8]) {
            box(x, 2, z, .12, 1.6, 1.8, '#203946');
            box(x, 2, z, .16, .07, 1.9, '#88948b');
            box(x, 2, z, .16, 1.7, .07, '#88948b');
        }
    }
    for (const z of [-18, -8, 2, 12]) {
        box(0, 3.2, z, 2, .08, .3, '#e7d9ab');
        for (const x of [-3.85, 3.85])
            box(x, .55, z, .06, 1, 3, '#3a5b51');
    }
    // Archive cabinets, broadcast mixing desk, washbasins, discipline notices.
    for (const z of [-8, -6, -4]) {
        box(-11, .95, z, 1.3, 1.9, 1.2, '#636b60', true);
        box(-10.3, 1.1, z, .05, .15, .2, '#b5ad85');
    }
    box(-10, .6, 6, 2.3, 1.2, 1.4, '#403c35', true);
    for (const z of [5.6, 6, 6.4])
        box(-9.9, 1.25, z, 1.5, .06, .08, '#a88a55');
    for (const x of [-10.6, -9.4])
        box(x, 1.8, 8, .7, 1.2, .4, '#242c2d');
    label('广播纪律：只准播放空白名单', -8, 9.7);
    for (const z of [-5, -3]) {
        box(10.5, .7, z, 2, .3, 1, '#afb8aa');
        box(11.5, 1.5, z, .06, 1.2, 1.2, '#728b8a');
    }
    label('违纪扣分：奔跑会引来值班人', 8, 1);
    label('铃响十二秒 · 离校窗口', 8, 20.8);
    box(8, 1.5, 21.5, 3, 3, .15, '#344941');
    for (const x of [6.6, 7.3, 8, 8.7, 9.4])
        box(x, 1.5, 21.3, .07, 3, .1, '#b5a77f');
    for (const z of [12, 13, 14])
        box(-10, .15 * (z - 11), z, 2, .3 * (z - 11), 1, '#717a70');
    label('封闭楼梯 · 请走东侧校门', -8, 20.5);
    const moon = new T.PointLight('#9bbecb', 20, 18);
    moon.position.set(8, 2.5, 19);
    scene.add(moon);
    const key = new T.SpotLight('#e9dbb8', 90, 38, Math.PI / 3, .5, 1.5);
    key.position.set(0, 3.1, -10);
    key.target.position.set(0, 0, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -.001;
    scene.add(key, key.target);
}
