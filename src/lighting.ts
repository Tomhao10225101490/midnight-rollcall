import * as T from 'three';
/** Four local ceiling sources; positions match the authored corridor fixtures. */
export function corridorLighting(scene:T.Scene){
 const lights:T.SpotLight[]=[];
 for(const z of [-18,-8,2,12]){
  const light=new T.SpotLight('#f0dfb5',48,12,Math.PI*.38,.7,2);
  light.name='走廊灯具照明';light.position.set(0,3.07,z);light.target.position.set(0,0,z);
  light.castShadow=true;light.shadow.mapSize.set(512,512);light.shadow.camera.near=.15;light.shadow.camera.far=12;
  light.shadow.bias=-.00015;light.shadow.normalBias=.025;
  // Low local fill approximates the fixture's diffuse spill onto the ceiling.
  const spill=new T.PointLight('#f0dfb5',1.6,4,2);spill.name='灯具漫射补光';spill.position.set(0,3.03,z);
  scene.add(light,light.target,spill);lights.push(light);
 }
 return lights;
}
