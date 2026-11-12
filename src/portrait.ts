import * as T from 'three';

/** Original continuous facial surface, in metres. No external scans or textures. */
export function portraitGeometry(){
 const geometry=new T.SphereGeometry(1,96,64),vertices=geometry.getAttribute('position');
 const bell=(x:number,centre:number,width:number)=>Math.exp(-(((x-centre)/width)**2));
 for(let i=0;i<vertices.count;i++){
  const u=vertices.getX(i),v=vertices.getY(i),w=vertices.getZ(i);
  const jaw=v<-.08?1+(v+.08)*.28:1,x=u*.168*jaw,y=v*.232;
  let z=w*.166*(v<-.28?.93:1);
  if(w>0){
   const front=Math.pow(Math.max(0,w),1.35);
   const cheeks=.008*(bell(x,-.088,.036)+bell(x,.088,.036))*bell(y,-.04,.045);
   const hollow=-.008*(bell(x,-.1,.05)+bell(x,.1,.05))*bell(y,-.085,.04);
   const sockets=-.02*(bell(x,-.072,.03)+bell(x,.072,.03))*bell(y,.028,.024);
   const lids=.007*(bell(x,-.072,.028)+bell(x,.072,.028))*bell(y,.042,.012);
   const brow=.014*(bell(x,-.07,.05)+bell(x,.07,.05))*bell(y,.072,.02);
   const forehead=.003*bell(x,0,.12)*bell(y,.14,.07);
   const bridge=.038*bell(x,0,.016)*bell(y,.03,.055);
   const tip=.055*bell(x,0,.02)*bell(y,-.028,.02);
   const wings=.01*(bell(x,-.022,.012)+bell(x,.022,.012))*bell(y,-.04,.012);
   const philtrum=.006*bell(x,0,.01)*bell(y,-.07,.02);
   const fold=-.007*(bell(x,-.055,.03)+bell(x,.055,.03))*bell(y,-.07,.035);
   const mouth=.004*bell(x,0,.04)*bell(y,-.11,.016);
   const chin=.014*bell(x,0,.055)*bell(y,-.16,.03);
   z+=front*(cheeks+hollow+sockets+lids+brow+forehead+bridge+tip+wings+philtrum+fold+mouth+chin);
  }
  vertices.setXYZ(i,x,y,z);
 }
 geometry.computeVertexNormals();return geometry;
}

/** Shared woven-height and roughness maps; colour stays in the material. */
export function wovenCloth(colour:string){
 const size=256,height=new Uint8Array(size*size*4),roughness=new Uint8Array(size*size*4);let seed=618;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const fibre=(seed/4294967296-.5)*14;
  const thread=((Math.floor(x/4)+Math.floor(y/4))%2?Math.cos(x*Math.PI/2):Math.cos(y*Math.PI/2));
  const wrinkle=Math.sin(x*.11+Math.sin(y*.07)*3)*8;
  const i=(y*size+x)*4;
  for(let c=0;c<3;c++){height[i+c]=Math.round(128+thread*40+fibre+wrinkle);roughness[i+c]=Math.round(220+thread*14+fibre)}
  height[i+3]=roughness[i+3]=255;
 }
 const texture=(data:Uint8Array)=>{const t=new T.DataTexture(data,size,size);t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.repeat.set(3,3);t.anisotropy=4;t.needsUpdate=true;return t};
 const material=new T.MeshStandardMaterial({color:colour,roughness:1,bumpMap:texture(height),roughnessMap:texture(roughness),bumpScale:.0024});
 material.userData.authoredSurface=true;return material;
}
