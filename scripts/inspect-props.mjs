// Diagnostic asset renders, NOT normal gameplay screenshots or playthrough evidence.
import{_electron as electron}from '@playwright/test';import fs from 'node:fs';
const app=await electron.launch({executablePath:'node_modules/electron/dist/Electron.app/Contents/MacOS/Electron',args:['.'],env:{...process.env,ROLLCALL_QA:'1'}});
try{const page=await app.firstWindow();await page.getByRole('button',{name:'新游戏',exact:true}).waitFor();fs.mkdirSync('artifacts/art-review',{recursive:true});
 for(const [name,eye,target]of [['paper',[-8,2,-16.5],[-8,.9,-19]],['cabinet',[-8,1.5,-5.5],[-8,1,-8]],['radio',[-8,2.1,5.4],[-8,1.25,3]],['power',[-8,1.65,15.3],[-8,1.4,13]],['reader',[8,1.7,20],[8,1.25,18]],['notice',[-1.4,1.95,-9],[-3.78,1.95,-9]]]){
  const data=await page.evaluate(async({eye,target})=>{const T=await import('three'),{scene}=await import('./world.js');const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(1000,760);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;const camera=new T.PerspectiveCamera(50,1000/760,.05,60);camera.position.fromArray(eye);camera.lookAt(new T.Vector3().fromArray(target));renderer.render(scene,camera);const result=renderer.domElement.toDataURL('image/png');renderer.dispose();renderer.forceContextLoss();return result},{eye,target});fs.writeFileSync(`artifacts/art-review/${name}.png`,Buffer.from(data.split(',')[1],'base64'));
 }
 console.log('Rendered six diagnostic views. These use inspection cameras, not a player route.');
}finally{await app.close()}
