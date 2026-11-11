import * as T from 'three';
import{EffectComposer}from 'three/addons/postprocessing/EffectComposer.js';
import{RenderPass}from 'three/addons/postprocessing/RenderPass.js';
import{GTAOPass}from 'three/addons/postprocessing/GTAOPass.js';
import{OutputPass}from 'three/addons/postprocessing/OutputPass.js';
/** Local-only HDR pipeline. AO is optional; text UI is composited by the DOM afterwards. */
export class Rendering{
 private composer:EffectComposer;private ao:GTAOPass;private active=true;
 constructor(private renderer:T.WebGLRenderer,private scene:T.Scene,private camera:T.PerspectiveCamera){
  this.composer=new EffectComposer(renderer);this.composer.renderTarget1.samples=Math.min(4,renderer.capabilities.maxSamples);this.composer.renderTarget2.samples=Math.min(4,renderer.capabilities.maxSamples);
  this.composer.addPass(new RenderPass(scene,camera));this.ao=new GTAOPass(scene,camera,innerWidth,innerHeight);this.ao.blendIntensity=.65;
  this.ao.updateGtaoMaterial({radius:.55,thickness:.2,distanceFallOff:1,samples:16});this.ao.updatePdMaterial({radius:3,samples:16,rings:2});
  this.composer.addPass(this.ao);this.composer.addPass(new OutputPass());renderer.info.autoReset=false;
 }
 configure(enabled:boolean){this.active=enabled;this.composer.setPixelRatio(this.renderer.getPixelRatio());this.composer.setSize(innerWidth,innerHeight)}
 resize(){this.composer.setSize(innerWidth,innerHeight)}
 render(){this.renderer.info.reset();if(this.active)this.composer.render();else this.renderer.render(this.scene,this.camera)}
 get enabled(){return this.active}
}
