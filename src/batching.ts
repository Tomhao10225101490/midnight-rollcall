import * as T from 'three';
/** Batch identical, immutable root-level box props; articulated objects stay independent. */
export function batchStaticBoxes(scene:T.Scene){
 const groups=new Map<string,T.Mesh<T.BoxGeometry,T.MeshStandardMaterial>[]>();
 for(const object of [...scene.children]){
  if(!(object instanceof T.Mesh)||object instanceof T.InstancedMesh||!(object.geometry instanceof T.BoxGeometry)||!(object.material instanceof T.MeshStandardMaterial)||object.userData.dynamic)continue;
  const m=object.material,p=object.geometry.parameters;
  const key=JSON.stringify([p,m.color.getHex(),m.roughness,m.metalness,m.map?.uuid,m.bumpMap?.uuid,m.bumpScale,m.emissive.getHex(),m.emissiveIntensity,m.transparent,m.opacity,m.side,object.castShadow,object.receiveShadow]);
  const meshes=groups.get(key)||[];meshes.push(object);groups.set(key,meshes);
 }
 let removed=0;
 for(const meshes of groups.values()){
  if(meshes.length<3)continue;
  const first=meshes[0],batch=new T.InstancedMesh(first.geometry,first.material,meshes.length);batch.name='Static architectural batch';batch.castShadow=first.castShadow;batch.receiveShadow=first.receiveShadow;
  meshes.forEach((mesh,i)=>{mesh.updateMatrix();batch.setMatrixAt(i,mesh.matrix);scene.remove(mesh);if(mesh.geometry!==first.geometry)mesh.geometry.dispose();if(mesh.material!==first.material)mesh.material.dispose()});
  batch.instanceMatrix.needsUpdate=true;batch.computeBoundingBox();batch.computeBoundingSphere();scene.add(batch);removed+=meshes.length-1;
 }
 return removed;
}
