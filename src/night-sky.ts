import * as T from 'three';
import {scene} from './world';

/** Night zenith and the dawn wash used by the ending. Sky itself is not fogged. */
export const NIGHT_FOG='#0d1a22';
export const DAWN_FOG='#8caaa4';
const MOON_DIR=new T.Vector3(-18,28,-8).normalize();

let dome:T.Mesh<T.SphereGeometry,T.ShaderMaterial>|undefined;
let moonBall:T.Mesh|undefined;
let moonHalo:T.Mesh|undefined;
let moonLight:T.DirectionalLight|undefined;
let moonFill:T.DirectionalLight|undefined;
let atmosphere=0;

export function nightSky(target:T.Scene=scene){
 if(dome)return;
 const uniforms={
  dawn:{value:0},
  moonDir:{value:MOON_DIR.clone()},
  nightZenith:{value:new T.Color('#070b14')},
  nightHorizon:{value:new T.Color('#1a2c3a')},
  dawnZenith:{value:new T.Color('#6e8f9c')},
  dawnHorizon:{value:new T.Color('#c8b89a')}
 };
 const material=new T.ShaderMaterial({
  side:T.BackSide,fog:false,transparent:false,depthWrite:true,depthTest:true,uniforms,
  vertexShader:`varying vec3 vDir;void main(){vDir=normalize(position);vec4 clip=projectionMatrix*modelViewMatrix*vec4(position,1.0);clip.z=clip.w*.999;gl_Position=clip;}`,
  fragmentShader:`
   varying vec3 vDir;
   uniform float dawn;
   uniform vec3 moonDir,nightZenith,nightHorizon,dawnZenith,dawnHorizon;
   float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
   void main(){
    vec3 n=normalize(vDir);
    float h=clamp(n.y*.5+.5,0.0,1.0);
    vec3 night=mix(nightHorizon,nightZenith,pow(h,.72));
    vec2 sky=vec2(atan(n.x,n.z)/6.283185*220.0,n.y*110.0);
    float tw=hash(vec3(floor(sky),11.7));
    float star=smoothstep(.16,.02,length(fract(sky)-.5))*step(.994,tw)*smoothstep(.12,.32,n.y);
    night+=vec3(.88,.92,1.0)*star*1.1;
    float band=smoothstep(.16,.0,abs(n.x*.55+n.z*.35+n.y*.15))*smoothstep(.05,.3,n.y);
    night+=vec3(.22,.24,.32)*band*.18;
    float m=max(0.0,dot(n,moonDir));
    night+=vec3(1.0,.96,.86)*smoothstep(.9978,.9995,m)*1.35;
    night+=vec3(.72,.8,.95)*pow(m,90.0)*.35;
    night+=vec3(.38,.46,.6)*pow(m,10.0)*.14;
    float cloud=sin(n.x*6.0+n.z*4.0)*sin(n.z*5.0-n.x*2.0);
    night+=vec3(.16,.2,.28)*max(0.0,cloud)*smoothstep(.12,.62,h)*.07;
    vec3 day=mix(dawnHorizon,dawnZenith,pow(h,.55));
    gl_FragColor=vec4(mix(night,day,dawn),1.0);
   }`
 });
 dome=new T.Mesh(new T.SphereGeometry(80,48,32),material);
 dome.name='原创夜空';dome.frustumCulled=false;dome.renderOrder=-1000;target.add(dome);

 const moonMat=new T.MeshBasicMaterial({color:'#f0ead8',fog:false,toneMapped:false,depthTest:true,depthWrite:false});
 moonBall=new T.Mesh(new T.SphereGeometry(1.7,24,16),moonMat);
 moonBall.position.copy(MOON_DIR).multiplyScalar(70);moonBall.name='原创月亮';moonBall.renderOrder=-999;moonBall.frustumCulled=false;target.add(moonBall);
 const haloMat=new T.MeshBasicMaterial({color:'#c5d4e6',fog:false,transparent:true,opacity:.12,depthTest:true,depthWrite:false,toneMapped:false,side:T.DoubleSide,blending:T.AdditiveBlending});
 moonHalo=new T.Mesh(new T.SphereGeometry(5.2,24,16),haloMat);
 moonHalo.position.copy(moonBall.position);moonHalo.renderOrder=-999;moonHalo.frustumCulled=false;target.add(moonHalo);

 moonLight=new T.DirectionalLight('#c5d4e8',1.85);
 moonLight.name='月光';moonLight.position.copy(MOON_DIR).multiplyScalar(70);
 moonLight.target.position.set(0,0,-22);moonLight.castShadow=true;
 moonLight.shadow.mapSize.set(2048,2048);
 Object.assign(moonLight.shadow.camera,{left:-55,right:55,top:55,bottom:-55,near:10,far:150});
 moonLight.shadow.camera.updateProjectionMatrix();
 moonLight.shadow.bias=-.00035;moonLight.shadow.normalBias=.05;
 target.add(moonLight,moonLight.target);

 moonFill=new T.DirectionalLight('#9bb0c6',.85);
 moonFill.name='月光填充';moonFill.position.copy(MOON_DIR).multiplyScalar(60);
 moonFill.target.position.set(0,0,-22);moonFill.castShadow=false;
 target.add(moonFill,moonFill.target);
 setAtmosphere(0);
}

export function updateSky(camera:T.Camera){
 if(!dome)return;
 dome.position.copy(camera.position);
 if(moonBall)moonBall.position.copy(camera.position).addScaledVector(MOON_DIR,70);
 if(moonHalo&&moonBall)moonHalo.position.copy(moonBall.position);
}

export function setAtmosphere(t:number){
 atmosphere=Math.min(1,Math.max(0,t));
 const color=new T.Color(NIGHT_FOG).lerp(new T.Color(DAWN_FOG),atmosphere);
 scene.background=color.clone();
 if(scene.fog instanceof T.Fog)scene.fog.color.copy(color);
 if(dome)dome.material.uniforms.dawn.value=atmosphere;
 if(moonBall){moonBall.visible=atmosphere<.92;(moonBall.material as T.MeshBasicMaterial).color.setRGB(1-atmosphere*.25,1-atmosphere*.3,.86-atmosphere*.2)}
 if(moonHalo){moonHalo.visible=atmosphere<.9;(moonHalo.material as T.MeshBasicMaterial).opacity=.12*(1-atmosphere)}
 if(moonLight)moonLight.intensity=1.85*(1-atmosphere);
 if(moonFill)moonFill.intensity=.85*(1-atmosphere);
}
