import * as T from 'three';
export function plasterTexture() { const c = document.createElement('canvas'); c.width = c.height = 256; const a = c.getContext('2d')!; const img = a.createImageData(256, 256); let seed = 731; for (let i = 0; i < img.data.length; i += 4) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const v = 180 + (seed % 35);
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
} a.putImageData(img, 0, 0); const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(3, 3); t.colorSpace = T.SRGBColorSpace; return t; }
export function upgradeMaterials(scene: T.Scene) { const texture = plasterTexture(); scene.traverse(o => { if (o instanceof T.Mesh && o.material instanceof T.MeshStandardMaterial) {
    o.material.map = texture;
    o.material.roughness = .86;
    o.castShadow = true;
    o.receiveShadow = true;
} }); }
