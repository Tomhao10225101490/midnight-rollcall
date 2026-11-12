import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import {matchVoice,voiceLines} from '../dist/voice-lines.js';
const manifest=JSON.parse(fs.readFileSync('assets/voice/manifest.json','utf8'));
const ids=Object.keys(voiceLines);
assert.deepEqual(ids.sort(),Object.keys(manifest.files).sort());
for(const id of ids){
 const line=voiceLines[id],meta=manifest.files[id];
 assert.equal(line.file,meta.file);
 assert.equal(line.text,meta.text);
 assert.equal(matchVoice(line.text),id);
 for(const alias of line.aliases)assert.equal(matchVoice(alias),id);
 const data=fs.readFileSync('assets/voice/'+meta.file);
 assert.equal(createHash('sha256').update(data).digest('hex'),meta.sha256);
 assert.ok(meta.duration>1,id);
 assert.ok(data.length>2000,id);
}
assert.equal(matchVoice('林序同学，晚自习结束。请安静行走。请到一班检查遗留试卷。'),'open');
assert.equal(matchVoice('广播：林序。林序。应到一人，实到零人。请不要替空座位上的人应答。'),'name');
assert.equal(matchVoice('unknown'),undefined);
console.log('PASS packaged voice lines, hashes and text lookup');
