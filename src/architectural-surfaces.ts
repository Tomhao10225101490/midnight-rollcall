import * as T from 'three';
/** Original seamless aggregate/paint surfaces, one repeat per metre. No image assets. */
export function metricBoxUV(geometry:T.BufferGeometry){
 const p=geometry.getAttribute('position'),n=geometry.getAttribute('normal'),uv=geometry.getAttribute('uv');
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
  if(Math.abs(n.getY(i))>.5)uv.setXY(i,x,z);
  else if(Math.abs(n.getX(i))>.5)uv.setXY(i,z,y);
  else uv.setXY(i,x,y);
 }
 uv.needsUpdate=true;
}
export function architecturalMaps(kind:'plaster'|'terrazzo'){
 const size=256,color=new Uint8Array(size*size*4),height=new Uint8Array(color.length),rough=new Uint8Array(color.length);let seed=kind==='plaster'?731:618;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const relief=new Float32Array(size*size),tint=new Float32Array(size*size);
 for(let i=0;i<relief.length;i++){relief[i]=random();tint[i]=random()}
 if(kind==='terrazzo')for(let chip=0;chip<1900;chip++){
  const cx=Math.floor(random()*size),cy=Math.floor(random()*size),radius=.5+random()*1.8,value=random()<.4?-.26:.2,aspect=.5+random();
  for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++)if(dx*dx+dy*dy/aspect<radius*radius){const index=((cy+dy+size)%size)*size+(cx+dx+size)%size;tint[index]=.5+value;relief[index]=.5+value*.15}
 }
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const index=y*size+x,i=index*4;
  const cloud=Math.sin(x/size*Math.PI*6)*Math.cos(y/size*Math.PI*4)*.018+Math.cos((x+y)/size*Math.PI*2)*.014;
  const value=kind==='plaster'?226+(tint[index]-.5)*13+cloud*130:205+(tint[index]-.5)*110;
  color[i]=value;color[i+1]=value*.985;color[i+2]=value*.955;color[i+3]=255;
  const h=kind==='plaster'?125+(relief[index]-.5)*37:128+(relief[index]-.5)*12;
  height[i]=height[i+1]=height[i+2]=h;height[i+3]=255;
  const r=kind==='plaster'?235+(relief[index]-.5)*20:185+(tint[index]-.5)*60;
  rough[i]=rough[i+1]=rough[i+2]=r;rough[i+3]=255;
 }
 const texture=(pixels:Uint8Array,srgb=false)=>{const t=new T.DataTexture(pixels,size,size);t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=8;if(srgb)t.colorSpace=T.SRGBColorSpace;t.needsUpdate=true;return t};
 return{map:texture(color,true),bumpMap:texture(height),roughnessMap:texture(rough)};
}
