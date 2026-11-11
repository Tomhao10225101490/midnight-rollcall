import * as T from 'three';

/** Original continuous facial surface, in metres. No external scans or textures. */
export function portraitGeometry(){
 const geometry=new T.SphereGeometry(1,96,64),vertices=geometry.getAttribute('position');
 const bell=(x:number,centre:number,width:number)=>Math.exp(-(((x-centre)/width)**2));
 for(let i=0;i<vertices.count;i++){
  const u=vertices.getX(i),v=vertices.getY(i),w=vertices.getZ(i);
  const jaw=v<-.1?1+(v+.1)*.22:1,x=u*.17*jaw,y=v*.225;
  let z=w*.169*(v<-.3?.94:1);
  if(w>0){
   const front=Math.pow(w,3);
   const cheeks=.012*(bell(x,-.092,.04)+bell(x,.092,.04))*bell(y,-.04,.045);
   const sockets=-.012*(bell(x,-.073,.032)+bell(x,.073,.032))*bell(y,.025,.026);
   const brow=.007*(bell(x,-.07,.05)+bell(x,.07,.05))*bell(y,.066,.022);
   const bridge=.027*bell(x,0,.019)*bell(y,.034,.067);
   const tip=.038*bell(x,0,.024)*bell(y,-.029,.022);
   const chin=.009*bell(x,0,.065)*bell(y,-.145,.025);
   z+=front*(cheeks+sockets+brow+bridge+tip+chin);
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
  const fibre=(seed/4294967296-.5)*12;
  const thread=((Math.floor(x/4)+Math.floor(y/4))%2?Math.cos(x*Math.PI/2):Math.cos(y*Math.PI/2));
  const i=(y*size+x)*4;
  for(let c=0;c<3;c++){height[i+c]=Math.round(128+thread*36+fibre);roughness[i+c]=Math.round(225+thread*12+fibre)}
  height[i+3]=roughness[i+3]=255;
 }
 const texture=(data:Uint8Array)=>{const t=new T.DataTexture(data,size,size);t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.repeat.set(3,3);t.anisotropy=4;t.needsUpdate=true;return t};
 const material=new T.MeshStandardMaterial({color:colour,roughness:1,bumpMap:texture(height),roughnessMap:texture(roughness),bumpScale:.00065});
 material.userData.authoredSurface=true;return material;
}
