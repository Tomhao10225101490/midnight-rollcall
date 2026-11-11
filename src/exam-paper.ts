import * as T from 'three';
import {printRecord,type PaperRecord} from './record-print';

/** Original printed examination sheet: deterministic ink/fibre, gently lifted corners. */
export function examPaper(record?:PaperRecord) {
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=1088;
 const c=canvas.getContext('2d')!;let seed=3819;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 c.fillStyle='#d9cfaf';c.fillRect(0,0,768,1088);
 for(let i=0;i<18000;i++){c.fillStyle=`rgba(83,65,39,${random()*.075})`;c.fillRect(random()*768,random()*1088,1+random()*2,1)}
 const edge=c.createLinearGradient(0,0,768,0);edge.addColorStop(0,'#8b735333');edge.addColorStop(.08,'#8b735300');edge.addColorStop(.9,'#8b735300');edge.addColorStop(1,'#8b735344');c.fillStyle=edge;c.fillRect(0,0,768,1088);
 const text=(s:string,x:number,y:number,size=24,color='#384039')=>{c.fillStyle=color;c.font=`${size}px RollcallText`;c.fillText(s,x,y)};
 if(record)printRecord(c,record);else {
 text('昭川中学 · 晚自习',164,97,36);text('离 校 复 核 试 卷',176,153,38);
 c.strokeStyle='#4b5145';c.lineWidth=2;c.strokeRect(55,181,658,791);
 for(const y of [251,319,573,814]){c.beginPath();c.moveTo(55,y);c.lineTo(713,y);c.stroke()}
 text('姓名：未归档',80,224);text('班级：一班',455,224);
 text('一、检查名单，不得替他人签字。',80,296);
 text('请将离校记录按规定顺序登记。',83,369);
 text('复核前，保留每一张原始试卷。',83,416);
 text('姓名栏不得涂改。空白不代表缺席。',83,463);
 text('二、登记顺序见背面说明。',80,550);
 text('核对项目',86,624);text('复核记录',361,624);
 for(const y of [644,691,738,785]){c.strokeStyle='#676c5977';c.beginPath();c.moveTo(80,y);c.lineTo(686,y);c.stroke()}
 for(const [i,s]of ['遗留试卷','座位登记','离校许可'].entries()){text(s,86,679+i*47,23);text('待核对',382,679+i*47,23)}
 text('三、确认后交值班室归档。',80,859);
 text('请翻阅背面，再到二班核对登记。',80,910,23);
 text('校务档案 / 请勿带离教学楼',183,1025,20);
 // Deliberately imperfect red pencil marks, rather than a pristine UI card.
 c.save();c.translate(548,472);c.rotate(-.12);c.strokeStyle='#8b302a';c.lineWidth=4;c.strokeRect(-94,-47,188,86);text('退回复核',-79,7,35,'#8b302a');c.restore();
 c.strokeStyle='#8b302a';c.lineWidth=3;c.beginPath();c.moveTo(201,559);c.quadraticCurveTo(376,568,514,556);c.stroke();
 c.beginPath();c.ellipse(202,216,120,28,-.02,0,Math.PI*2);c.stroke();
 }
 const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;
 const geometry=new T.PlaneGeometry(.43,.6,16,22);const positions=geometry.attributes.position;
 for(let i=0;i<positions.count;i++) {const x=positions.getX(i),y=positions.getY(i);const corner=Math.pow(Math.max(0,(Math.abs(x)-.12)/.095),2)*Math.pow(Math.max(0,(Math.abs(y)-.21)/.09),2);positions.setZ(i,.012*corner+.0015*Math.sin(x*19+y*13))}
 geometry.computeVertexNormals();geometry.rotateX(-Math.PI/2);
 const mesh=new T.Mesh(geometry,new T.MeshStandardMaterial({map,roughness:.94,side:T.DoubleSide}));mesh.castShadow=mesh.receiveShadow=true;mesh.name=record?'record-paper-'+record.id:'original-exam-paper';return mesh;
}
