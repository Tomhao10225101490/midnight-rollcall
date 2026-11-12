import * as T from 'three';

/** Original seamless surfaces for the south annex. One repeat per metre unless noted. */
function texture(pixels:Uint8Array,size:number,srgb=false,repeat=true){
 const t=new T.DataTexture(pixels,size,size);
 t.wrapS=t.wrapT=repeat?T.RepeatWrapping:T.ClampToEdgeWrapping;
 t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=8;
 if(srgb)t.colorSpace=T.SRGBColorSpace;t.needsUpdate=true;return t;
}

export function tileMaps(wet=false){
 const size=256,color=new Uint8Array(size*size*4),height=new Uint8Array(color.length),rough=new Uint8Array(color.length);
 let seed=wet?4201:9013;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const tile=16;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const gx=x%tile,gy=y%tile,grout=gx<2||gy<2||gx>tile-2||gy>tile-2;
  const chip=random(),stain=Math.sin(x*.11)*Math.cos(y*.09)*.04;
  const base=wet?170+chip*18:210+chip*16;
  const v=grout?(wet?110:150)+chip*10:base+stain*80;
  const i=(y*size+x)*4;
  color[i]=v;color[i+1]=v*(wet?.98:.99);color[i+2]=v*(wet?.96:.94);color[i+3]=255;
  const h=grout?88:140+chip*10-(wet?8:0);
  height[i]=height[i+1]=height[i+2]=h;height[i+3]=255;
  const r=grout?210:wet?70+chip*40:95+chip*30;
  rough[i]=rough[i+1]=rough[i+2]=r;rough[i+3]=255;
 }
 return{map:texture(color,size,true),bumpMap:texture(height,size),roughnessMap:texture(rough,size)};
}

export function rubberMaps(){
 const size=256,color=new Uint8Array(size*size*4),height=new Uint8Array(color.length),rough=new Uint8Array(color.length);
 let seed=2711;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const grain=random(),fleck=random()>.97?40:0,cloud=Math.sin(x*.04)*Math.cos(y*.05)*6;
  const i=(y*size+x)*4,r=118+grain*16+cloud,g=52+grain*10,b=48+grain*8+fleck;
  color[i]=r;color[i+1]=g;color[i+2]=b;color[i+3]=255;
  height[i]=height[i+1]=height[i+2]=120+grain*24;height[i+3]=255;
  rough[i]=rough[i+1]=rough[i+2]=210+grain*20;rough[i+3]=255;
 }
 return{map:texture(color,size,true),bumpMap:texture(height,size),roughnessMap:texture(rough,size)};
}

export function courtMap(){
 const size=1024,color=new Uint8Array(size*size*4);
 const set=(x:number,y:number,r:number,g:number,b:number)=>{
  if(x<0||y<0||x>=size||y>=size)return;
  const i=(y*size+x)*4;color[i]=r;color[i+1]=g;color[i+2]=b;color[i+3]=255;
 };
 const blend=(x:number,y:number,r:number,g:number,b:number,a:number)=>{
  if(x<0||y<0||x>=size||y>=size)return;
  const i=(y*size+x)*4;
  color[i]=Math.round(color[i]*(1-a)+r*a);color[i+1]=Math.round(color[i+1]*(1-a)+g*a);color[i+2]=Math.round(color[i+2]*(1-a)+b*a);
 };
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const dx=(x-size/2)/(size*.55),dy=(y-size/2)/(size*.55),wear=Math.max(0,1-(dx*dx+dy*dy));
  set(x,y,63+wear*18,83+wear*8,64);
 }
 const line=(x0:number,y0:number,x1:number,y1:number,w=8)=>{
  const n=Math.hypot(x1-x0,y1-y0),s=Math.max(1,Math.ceil(n));
  for(let i=0;i<=s;i++){
   const x=x0+(x1-x0)*i/s,y=y0+(y1-y0)*i/s;
   for(let oy=-w;oy<=w;oy++)for(let ox=-w;ox<=w;ox++)if(ox*ox+oy*oy<=w*w)set(Math.round(x+ox),Math.round(y+oy),231,225,200);
  }
 };
 const rect=(x:number,y:number,w:number,h:number,t=8)=>{line(x,y,x+w,y,t);line(x+w,y,x+w,y+h,t);line(x+w,y+h,x,y+h,t);line(x,y+h,x,y,t)};
 const circle=(cx:number,cy:number,r:number,t=8)=>{
  const steps=Math.ceil(2*Math.PI*r);
  for(let i=0;i<=steps;i++){
   const a=i/steps*Math.PI*2;
   line(cx+Math.cos(a)*r,cy+Math.sin(a)*r,cx+Math.cos((i+1)/steps*Math.PI*2)*r,cy+Math.sin((i+1)/steps*Math.PI*2)*r,t);
  }
 };
 const m=36;
 rect(m,m,size-2*m,size-2*m,8);
 line(size/2,m,size/2,size-m,8);line(m,size/2,size-m,size/2,8);
 const keyW=size*.32,keyH=size*.38,keyX=(size-keyW)/2;
 rect(keyX,m,keyW,keyH,8);
 circle(size/2,m+keyH,size*.14,8);
 circle(size/2,size/2,size*.12,8);
 rect(keyX+keyW*.22,m,keyW*.56,size*.08,5);
 const map=texture(color,size,true,false);
 return map;
}

export function grassMaps(){
 const size=256,color=new Uint8Array(size*size*4),height=new Uint8Array(color.length);
 let seed=1188;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const n=random(),blade=Math.sin(x*.8+Math.sin(y*.3)*3)*8,i=(y*size+x)*4;
  color[i]=48+n*14;color[i+1]=68+n*22+blade;color[i+2]=42+n*10;color[i+3]=255;
  height[i]=height[i+1]=height[i+2]=128+n*30+blade;height[i+3]=255;
 }
 return{map:texture(color,size,true),bumpMap:texture(height,size)};
}
