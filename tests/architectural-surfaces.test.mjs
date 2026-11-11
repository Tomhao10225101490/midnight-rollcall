import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import{metricBoxUV,architecturalMaps}from '../dist/architectural-surfaces.js';
test('长墙纹理使用实际米数，三个面的密度一致且与短墙相同',()=>{
 for(const length of [1,44]){const g=new T.BoxGeometry(.3,3.4,length);metricBoxUV(g);const uv=g.getAttribute('uv');for(let face=0;face<6;face++){const points=Array.from({length:4},(_,i)=>[uv.getX(face*4+i),uv.getY(face*4+i)]);const width=Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0])),height=Math.max(...points.map(p=>p[1]))-Math.min(...points.map(p=>p[1]));assert.ok(Math.abs(width-(face<2?length:.3))<1e-5);assert.ok(Math.abs(height-(face>=2&&face<4?length:3.4))<1e-5)}}
});
test('颜色与物理贴图分离、确定性生成并具备缩小过滤',()=>{
 for(const kind of ['plaster','terrazzo']){const a=architecturalMaps(kind),b=architecturalMaps(kind);assert.equal(a.map.colorSpace,T.SRGBColorSpace);for(const key of ['bumpMap','roughnessMap'])assert.equal(a[key].colorSpace,T.NoColorSpace);assert.deepEqual(a.map.image.data,b.map.image.data);assert.notDeepEqual(a.map.image.data,a.bumpMap.image.data);for(const t of Object.values(a)){assert.equal(t.wrapS,T.RepeatWrapping);assert.ok(t.generateMipmaps);assert.equal(t.minFilter,T.LinearMipmapLinearFilter)}}
});
