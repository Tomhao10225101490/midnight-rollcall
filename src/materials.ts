import * as T from 'three';
// Original, deterministic surface assets. Existing artwork (notices, labels) is sacred.
type Surface = 'plaster' | 'wood' | 'paint';
function surfaceTexture(kind: Surface) {
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
 const ctx=canvas.getContext('2d')!,pixels=ctx.createImageData(256,256);let seed=731;
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){
  seed=(seed*1664525+1013904223)>>>0;
  const noise=(seed/4294967296-.5);
  const grain=kind==='wood'?Math.sin(y*.45+Math.sin(x*.025)*2+Math.sin(y*.035)*3)*12:0;
  const value=Math.round(230+noise*(kind==='plaster'?25:kind==='wood'?10:5)+grain);
  const i=(y*256+x)*4;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=value;pixels.data[i+3]=255;
 }
 ctx.putImageData(pixels,0,0);
 const texture=new T.CanvasTexture(canvas);texture.wrapS=texture.wrapT=T.RepeatWrapping;
 texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;
 return texture;
}
const woodColors=new Set(['907349','66543c','554734','66523c','6d5035','584936','403c35','b29156','514a3c']);
export function upgradeMaterials(scene:T.Scene){
 const textures={plaster:surfaceTexture('plaster'),wood:surfaceTexture('wood'),paint:surfaceTexture('paint')};
 scene.traverse(object=>{
  if(!(object instanceof T.Mesh))return;
  object.castShadow=true;object.receiveShadow=true;
  const materials=Array.isArray(object.material)?object.material:[object.material];
  for(const material of materials){
   if(!(material instanceof T.MeshStandardMaterial)||material.map)continue;
   // Preserve brass, ceramic and other intentionally authored material responses.
   if(material.metalness>0||material.roughness<.7)continue;
   const color=material.color.getHexString();
   const kind:Surface=woodColors.has(color)?'wood':color.startsWith('6')||color==='3c4540'?'plaster':'paint';
   material.map=textures[kind];material.bumpMap=textures[kind];
   material.bumpScale=kind==='plaster'?.018:kind==='wood'?.008:.002;
   material.roughness=kind==='plaster'?.94:kind==='wood'?.72:.82;
   material.needsUpdate=true;
  }
 });
}
