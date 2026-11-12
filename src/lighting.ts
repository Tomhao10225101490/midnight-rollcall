import * as T from 'three';
/** Four local ceiling sources; positions match the authored corridor fixtures. */
export function corridorLighting(scene:T.Scene){
 const lights:T.SpotLight[]=[];
 for(const z of [-18,-8,2,12]){
  const light=new T.SpotLight('#f3dfb0',40,13,Math.PI*.36,.62,1.8);
  light.name='走廊灯具照明';light.position.set(0,3.07,z);light.target.position.set(0,0,z);
  light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.camera.near=.15;light.shadow.camera.far=13;
  light.shadow.bias=-.0002;light.shadow.normalBias=.03;
  // Low local fill approximates the fixture's diffuse spill onto the ceiling.
  const spill=new T.PointLight('#f0dfb5',7,7,2);spill.name='灯具漫射补光';spill.position.set(0,3.08,z);
  scene.add(light,light.target,spill);lights.push(light);
 }
 return lights;
}
