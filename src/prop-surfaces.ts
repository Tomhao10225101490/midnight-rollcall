import * as T from 'three';

/** Original varnished timber and enamel: independent colour, relief and roughness. */
export function propSurface(kind:'timber'|'enamel') {
 const size=256,albedo=new Uint8Array(size*size*4),relief=new Uint8Array(albedo.length),roughness=new Uint8Array(albedo.length);
 let seed=kind==='timber'?19317:6521;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const scratches=Array.from({length:18},()=>({x:random()*size,y:random()*size,length:8+random()*49}));
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=x/size*Math.PI*2,v=y/size*Math.PI*2,noise=random()-.5;
  // Periodic warped grain keeps repetition continuous; relief stays below a millimetre.
  const grain=Math.sin(v*23+Math.sin(u)*3.3+Math.sin(v*2)*4+Math.sin(u*3+v)*1.2);
  const pore=Math.pow(Math.max(0,Math.sin(v*81+Math.sin(u*2)*3)),12);
  let scratch=0;
  for(const s of scratches){const dx=(x-s.x+size)%size,dy=Math.abs(((y-s.y+size*1.5)%size)-size*.5);if(dx<s.length&&dy<.6)scratch=Math.max(scratch,Math.sin(dx/s.length*Math.PI))}
  const value=kind==='timber'?225+grain*6-pore*8+noise*4+scratch*10:231+noise*5+scratch*10;
  const h=kind==='timber'?128+grain*2-pore*4-scratch*6:128+noise*16-scratch*12;
  const r=kind==='timber'?179+grain*6+pore*10+scratch*25:160+noise*12+scratch*40;
  const i=(y*size+x)*4;
  albedo[i]=value;albedo[i+1]=value*(kind==='timber'?.96:1);albedo[i+2]=value*(kind==='timber'?.89:1);albedo[i+3]=255;
  relief[i]=relief[i+1]=relief[i+2]=h;relief[i+3]=255;
  roughness[i]=roughness[i+1]=roughness[i+2]=r;roughness[i+3]=255;
 }
 const texture=(data:Uint8Array,color=false)=>{const t=new T.DataTexture(data,size,size);t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=8;if(color)t.colorSpace=T.SRGBColorSpace;t.needsUpdate=true;return t};
 const material=new T.MeshStandardMaterial({color:kind==='timber'?'#98744f':'#65776d',map:texture(albedo,true),bumpMap:texture(relief),roughnessMap:texture(roughness),roughness:1,bumpScale:kind==='timber'?.0012:.0006,metalness:kind==='timber'?0:.2});
 material.userData.authoredSurface=true;return material;
}
