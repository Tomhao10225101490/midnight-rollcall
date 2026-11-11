import * as T from 'three';
/** Reuse one canvas/texture for a physical status display throughout the session. */
export function stationDisplay(parent:T.Group,w:number,h:number,x:number,y:number,z:number){
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=256;
 const ctx=canvas.getContext('2d')!,texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;
 const material=new T.MeshStandardMaterial({map:texture,emissiveMap:texture,emissive:'#ffffff',emissiveIntensity:.3,roughness:.65});
 const mesh=new T.Mesh(new T.PlaneGeometry(w,h),material);mesh.position.set(x,y,z);parent.add(mesh);let previous='';
 return (text:string,ready:boolean)=>{const key=text+ready;if(key===previous)return;previous=key;ctx.fillStyle='#17221f';ctx.fillRect(0,0,768,256);ctx.strokeStyle=ready?'#9dc5a2':'#c8b58b';ctx.lineWidth=5;ctx.strokeRect(12,12,744,232);ctx.fillStyle=ctx.strokeStyle;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='52px RollcallText';ctx.fillText(text,384,128,714);texture.needsUpdate=true;mesh.userData.status=text};
}
