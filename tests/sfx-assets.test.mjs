import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
const manifest=JSON.parse(fs.readFileSync('assets/sfx/manifest.json','utf8'));
assert.ok(Object.keys(manifest.files).length>=16);
for(const [name,meta] of Object.entries(manifest.files)){
 const data=fs.readFileSync('assets/sfx/'+name);
 assert.equal(createHash('sha256').update(data).digest('hex'),meta.sha256,name);
 assert.ok(data.slice(0,4).equals(Buffer.from('OggS')),name+' is ogg');
}
for(const license of ['LICENSE-KENNEY-IMPACT-SOUNDS.txt','LICENSE-KENNEY-RPG-AUDIO.txt']){
 const text=fs.readFileSync('assets/sfx/'+license,'utf8');
 assert.match(text,/Creative Commons Zero, CC0/);
 assert.match(text,/Kenney/);
}
console.log('PASS vendored Kenney CC0 foley hashes and licenses');
