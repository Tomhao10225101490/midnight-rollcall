import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs';

test('vendored Poly Haven furniture hashes and licenses',()=>{
 const manifest=JSON.parse(fs.readFileSync('assets/models/manifest.json','utf8'));
 assert.equal(manifest.source,'Poly Haven CC0 1.0');
 assert.ok(Object.keys(manifest.files).length>=12);
 for(const [file,sha] of Object.entries(manifest.files)){
  const bytes=fs.readFileSync('assets/models/'+file);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),sha,file);
 }
 for(const name of ['SOURCE.md','LICENSE-CC0-POLYHAVEN.txt','SchoolDesk_01_2k/SchoolDesk_01_2k.gltf','SchoolChair_01_2k/SchoolChair_01_2k.gltf']){
  assert.ok(fs.existsSync('assets/models/'+name),name);
 }
 const notices=fs.readFileSync('THIRD_PARTY_NOTICES.md','utf8');
 assert.match(notices,/School Desk 01/);
 assert.match(notices,/School Chair 01/);
 assert.match(notices,/CC0/);
});
