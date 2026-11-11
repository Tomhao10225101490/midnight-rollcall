import {schoolChair} from './furniture';
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
        const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=384;const ink=canvas.getContext('2d')!;
        ink.fillStyle='#19372e';ink.fillRect(0,0,1536,384);let chalkSeed=731;
        for(let i=0;i<16000;i++){chalkSeed=(Math.imul(chalkSeed,1664525)+1013904223)>>>0;const px=chalkSeed%1536;chalkSeed=(Math.imul(chalkSeed,1664525)+1013904223)>>>0;ink.fillStyle=i%3?'rgba(215,224,198,.025)':'rgba(0,0,0,.08)';ink.fillRect(px,chalkSeed%384,2,1)}
        ink.fillStyle='#d6d9ba';ink.font='44px serif';ink.fillText(x<0?'晚自习 · 离校复核':'高三二班 · 考场安排',75,80);ink.fillStyle='#aabbaa';ink.font='28px serif';
        (x<0?['一、检查遗留试卷，核对座次','二、保持安静，等待校铃','三、不要替缺席的人应答']:['座次表已放在讲台上','请按科目核对分数与座号','应到：一人    实到：——']).forEach((line,i)=>ink.fillText(line,85,155+i*62));
        ink.fillStyle='#a9b7a4';ink.fillRect(999,45,2,290);ink.font='32px serif';ink.fillText('值日记录',1080,90);ink.font='25px serif';ink.fillText('日期：未填写',1060,165);ink.fillText('擦净姓名栏',1060,225);
        const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;const board=new T.Mesh(new T.PlaneGeometry(5.9,1.45),new T.MeshStandardMaterial({map:texture,roughness:.96}));board.position.set(x,1.9,-21.64);scene.add(board);
        for(const dx of [-3.04,3.04])box(x+dx,1.9,-21.62,.08,1.62,.08,'#514a3c');for(const y of [1.1,2.7])box(x,y,-21.62,6.16,.08,.08,'#514a3c');box(x,1.1,-21.52,6.1,.06,.22,'#514a3c');
        box(x+.8,1.15,-21.5,.2,.035,.08,'#c9bea0');box(x+1.2,1.15,-21.5,.12,.025,.03,'#d6cfb8');
        for (const z of [-17, -14])
            for (const a of [x - 1, x + 2]) {
                const chair=schoolChair();chair.position.set(a,0,z+1);scene.add(chair);
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
    box(8, 1.5, 21.5, 3, 3, .15, '#344941',true).userData.dynamic=true;
    for (const x of [6.6, 7.3, 8, 8.7, 9.4])
        box(x, 1.5, 21.3, .07, 3, .1, '#b5a77f').userData.dynamic=true;
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
