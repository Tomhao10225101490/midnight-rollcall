import * as T from 'three';
import{EffectComposer}from 'three/addons/postprocessing/EffectComposer.js';
import{RenderPass}from 'three/addons/postprocessing/RenderPass.js';
import{GTAOPass}from 'three/addons/postprocessing/GTAOPass.js';
import{UnrealBloomPass}from 'three/addons/postprocessing/UnrealBloomPass.js';
import{OutputPass}from 'three/addons/postprocessing/OutputPass.js';
/** Local-only HDR pipeline. AO is optional; bloom stays on so fixtures and the moon hold a glow. */
export class Rendering{
 private composer:EffectComposer;private ao:GTAOPass;private bloom:UnrealBloomPass;private aoOn=true;
 constructor(private renderer:T.WebGLRenderer,private scene:T.Scene,private camera:T.PerspectiveCamera){
  this.composer=new EffectComposer(renderer);this.composer.renderTarget1.samples=Math.min(4,renderer.capabilities.maxSamples);this.composer.renderTarget2.samples=Math.min(4,renderer.capabilities.maxSamples);
  this.composer.addPass(new RenderPass(scene,camera));
  this.ao=new GTAOPass(scene,camera,innerWidth,innerHeight);this.ao.blendIntensity=.7;
  this.ao.updateGtaoMaterial({radius:.62,thickness:.22,distanceFallOff:1,samples:16});this.ao.updatePdMaterial({radius:3,samples:16,rings:2});
  this.composer.addPass(this.ao);
  this.bloom=new UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),.1,.4,.9);
  this.composer.addPass(this.bloom);
  this.composer.addPass(new OutputPass());renderer.info.autoReset=false;
 }
 configure(enabled:boolean){this.aoOn=enabled;this.ao.enabled=enabled;this.composer.setPixelRatio(this.renderer.getPixelRatio());this.composer.setSize(innerWidth,innerHeight);this.bloom.setSize(innerWidth,innerHeight)}
 resize(){this.composer.setSize(innerWidth,innerHeight);this.bloom.setSize(innerWidth,innerHeight)}
 render(){this.renderer.info.reset();this.composer.render()}
 get enabled(){return this.aoOn}
}
