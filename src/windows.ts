import * as T from 'three';
/** Original closed sash windows. Shared geometry and maps keep the entire building batched. */
export function campusWindows(scene:T.Scene){
 const size=256,data=new Uint8Array(size*size*4);let seed=731;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const frost=(seed/4294967296-.5)*12;
  const haze=16*Math.exp(-((x-170)**2+(y-85)**2)/9000);
  const streak=Math.sin(x*.61+Math.sin(y*.035)*.35)> .92?5:0;
  const i=(y*size+x)*4;data[i]=29+frost+haze+streak;data[i+1]=49+frost+haze+streak;data[i+2]=57+frost+haze+streak;data[i+3]=255;
 }
 const texture=new T.DataTexture(data,size,size);texture.colorSpace=T.SRGBColorSpace;texture.generateMipmaps=true;texture.minFilter=T.LinearMipmapLinearFilter;texture.magFilter=T.LinearFilter;texture.anisotropy=4;texture.needsUpdate=true;
 const frame=new T.MeshStandardMaterial({color:'#7b8880',roughness:.72,metalness:.22}),rubber=new T.MeshStandardMaterial({color:'#27332f',roughness:.95}),glass=new T.MeshStandardMaterial({map:texture,roughness:.48,metalness:.12,emissive:'#25414e',emissiveIntensity:.13}),sill=new T.MeshStandardMaterial({color:'#8d9183',roughness:.86});
 const pieces:{w:number;h:number;d:number;x:number;y:number;z:number;m:T.Material}[]=[];
 const part=(w:number,h:number,d:number,x:number,y:number,z:number,m:T.Material)=>pieces.push({w,h,d,x,y,z,m});
 part(1.8,1.6,.045,0,0,-.03,glass);
 for(const x of [-.92,.92]){part(.085,1.76,.15,x,0,0,frame);part(.022,1.6,.018,x>0?x-.055:x+.055,0,.083,rubber)}
 for(const y of [-.84,.84])part(1.92,.08,.15,0,y,0,frame);
 part(.065,1.6,.11,0,0,.025,frame);part(1.8,.06,.11,0,.18,.025,frame);
 part(2.02,.09,.32,0,-.9,.09,sill);part(1.85,.035,.04,0,-.95,.2,frame);
 for(const x of [-.11,.11]){part(.035,.18,.035,x,-.12,.12,frame);part(.035,.035,.08,x,-.195,.09,frame)}
 for(const x of [-.9,.9])for(const y of [-.5,.5])part(.035,.14,.04,x,y,.1,frame);
 const placements:T.Matrix4[]=[];
 for(const x of [-11.77,11.77])for(let z=-20;z<21;z+=3){const matrix=new T.Matrix4().makeRotationY(x<0?Math.PI/2:-Math.PI/2);matrix.setPosition(x,2,z);placements.push(matrix)}
 const geometry=new T.BoxGeometry(1,1,1),local=new T.Matrix4(),matrix=new T.Matrix4();
 for(const material of [frame,rubber,glass,sill]){
  const matching=pieces.filter(p=>p.m===material),batch=new T.InstancedMesh(geometry,material,matching.length*placements.length);let index=0;
  for(const placement of placements)for(const p of matching){local.makeScale(p.w,p.h,p.d);local.setPosition(p.x,p.y,p.z);matrix.multiplyMatrices(placement,local);batch.setMatrixAt(index++,matrix)}
  batch.name='Campus window '+(material===glass?'frosted glass':'joinery');batch.castShadow=material!==glass;batch.receiveShadow=true;batch.computeBoundingBox();batch.computeBoundingSphere();scene.add(batch);
 }
}
