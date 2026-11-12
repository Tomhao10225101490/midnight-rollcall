import {campusWindows} from './windows';
import {schoolChair} from './furniture';
import * as T from 'three';
import { box, label, scene } from './world';
import {campusGrounds} from './campus-grounds';
import {nightSky} from './night-sky';
import {ceilings} from './ceilings';
export function decorate() {
    const tileGeo=new T.BoxGeometry(.98,.018,.98);
    const tileMat=new T.MeshStandardMaterial({color:'#737e73',roughness:.78});
    const tiles=new T.InstancedMesh(tileGeo,tileMat,24*44);const matrix=new T.Matrix4();let tileIndex=0;
    for(let x=-12;x<12;x++)for(let z=-22;z<22;z++){matrix.makeTranslation(x+.5,.015,z+.5);tiles.setMatrixAt(tileIndex,matrix);tiles.setColorAt(tileIndex,new T.Color((x+z)%2?'#68766f':'#798078'));tileIndex++}tiles.receiveShadow=true;tiles.userData.architecturalSurface='terrazzo';scene.add(tiles);
    const roomNames=[['一班 · 试卷','档案办公室','广播控制室','配电值班室'],['二班 · 考场','储物间 · 躲藏','纪律公示室','东侧校门']];
    for(const [side,x] of [-4,4].entries())for(const [i,z]of [-15,-5,5,15].entries()){
        box(x,3.05,z,.28,.7,3.1,'#4e5c54',true);
        for(const dz of [-1.55,1.55])box(x,1.55,z+dz,.32,3.1,.12,'#514a3c');
        const sign=label(roomNames[side][i],x+(x<0?.2:-.2),z);sign.rotation.y=x<0?Math.PI/2:-Math.PI/2;sign.position.y=2.93;sign.scale.set(.75,.6,1);
        box(x,.0375,z,.24,.025,2.8,'#8b8e79');
    }
    // Recognizable, original room furniture; furniture away from doorways.
    for (const x of [-8, 8]) {
        box(x, 1.9, -21.7, 6, 1.5, .1, '#1e3e36');
        const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=384;const ink=canvas.getContext('2d')!;
        ink.fillStyle='#19372e';ink.fillRect(0,0,1536,384);let chalkSeed=731;
        for(let i=0;i<16000;i++){chalkSeed=(Math.imul(chalkSeed,1664525)+1013904223)>>>0;const px=chalkSeed%1536;chalkSeed=(Math.imul(chalkSeed,1664525)+1013904223)>>>0;ink.fillStyle=i%3?'rgba(215,224,198,.025)':'rgba(0,0,0,.08)';ink.fillRect(px,chalkSeed%384,2,1)}
        ink.fillStyle='#d6d9ba';ink.font='44px RollcallText';ink.fillText(x<0?'晚自习 · 离校复核':'高三二班 · 考场安排',75,80);ink.fillStyle='#aabbaa';ink.font='28px RollcallText';
        (x<0?['一、检查遗留试卷，核对座次','二、保持安静，等待校铃','三、不要替缺席的人应答']:['座次表已放在讲台上','请按科目核对分数与座号','应到：一人    实到：——']).forEach((line,i)=>ink.fillText(line,85,155+i*62));
        ink.fillStyle='#a9b7a4';ink.fillRect(999,45,2,290);ink.font='32px RollcallText';ink.fillText('值日记录',1080,90);ink.font='25px RollcallText';ink.fillText('日期：未填写',1060,165);ink.fillText('擦净姓名栏',1060,225);
        const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;const board=new T.Mesh(new T.PlaneGeometry(5.9,1.45),new T.MeshStandardMaterial({map:texture,roughness:.96}));board.position.set(x,1.9,-21.64);scene.add(board);
        for(const dx of [-3.04,3.04])box(x+dx,1.9,-21.62,.08,1.62,.08,'#514a3c');for(const y of [1.1,2.7])box(x,y,-21.62,6.16,.08,.08,'#514a3c');box(x,1.1,-21.52,6.1,.06,.22,'#514a3c');
        box(x+.8,1.15,-21.5,.2,.035,.08,'#c9bea0');box(x+1.2,1.15,-21.5,.12,.025,.03,'#d6cfb8');
        for (const z of [-17, -14])
            for (const a of [x - 1, x + 2]) {
                const chair=schoolChair();chair.position.set(a,0,z+1);chair.rotation.y=Math.PI;scene.add(chair);
            }
    }
    campusWindows(scene);
    for (const z of [-18, -8, 2, 12]) {
        for (const x of [-3.85, 3.85])
            box(x, .55, z, .06, 1, 3, '#3a5b51');
    }
    // Archive cabinets, broadcast mixing desk, washbasins, discipline notices.
    for (const [index,z] of [-8, -6, -4].entries()) {
        box(-11, .95, z, 1.3, 1.9, 1.2, '#636b60', true);
        // Pressed steel doors, folded edges, card holders and ventilation slots.
        box(-10.338,.99,z,.024,1.69,1.08,'#26332e');
        for(const side of [-1,1]){
            const cz=z+side*.27;
            box(-10.315,.99,cz,.03,1.65,.515,'#788073');
            for(const y of [.21,1.77])box(-10.292,y,cz,.018,.028,.46,'#9a9e8a');
            for(const dz of [-.238,.238])box(-10.292,.99,cz+dz,.018,1.58,.022,'#9a9e8a');
            box(-10.25,1.05,z+side*.09,.09,.18,.035,'#a79f80');
            for(const y of [.43,.51,.59])box(-10.292,y,cz,.018,.025,.33,'#31433b');
            for(const y of [.45,1.5])box(-10.276,y,z+side*.54,.045,.14,.035,'#56665c');
            box(-10.278,1.46,cz,.025,.18,.36,'#a79f80');
            box(-10.26,1.46,cz,.012,.125,.3,'#d1c8a9');
        }
        box(-10.27,1.24,z,.018,.17,.94,'#34483d');
        const sign=label(['旧档案','出勤留存','校务记录'][index],-10.255,z);sign.rotation.y=Math.PI/2;sign.position.y=1.24;sign.scale.set(.3,.2,1);
        box(-10.29,.1,z,.07,.09,1.1,'#46594c');
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
    campusGrounds();
    nightSky(scene);
    ceilings(scene);
}
