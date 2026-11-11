import fs from 'node:fs';import crypto from 'node:crypto';
export function auditFont(){
 const font=fs.readFileSync('assets/fonts/NotoSansSC-Regular.otf');
 const sha256=crypto.createHash('sha256').update(font).digest('hex');
 if(sha256!=='faa6c9df652116dde789d351359f3d7e5d2285a2b2a1f04a2d7244df706d5ea9')throw Error('Bundled font differs from the pinned upstream binary');
 if(!fs.readFileSync('assets/fonts/OFL.txt','utf8').includes('SIL OPEN FONT LICENSE Version 1.1'))throw Error('Missing font license');
 if(!fs.readFileSync('assets/fonts/COPYRIGHT.txt','utf8').includes('2014-2021 Adobe'))throw Error('Missing upstream font copyright');
 let cmap=-1;for(let i=0;i<font.readUInt16BE(4);i++){const o=12+i*16;if(font.toString('ascii',o,o+4)==='cmap')cmap=font.readUInt32BE(o+8)}
 if(cmap<0)throw Error('Font has no character map');
 const groups=[];for(let i=0;i<font.readUInt16BE(cmap+2);i++){const o=cmap+4+i*8,platform=font.readUInt16BE(o),table=cmap+font.readUInt32BE(o+4);if((platform===0||platform===3)&&font.readUInt16BE(table)===12){for(let g=0;g<font.readUInt32BE(table+12);g++){const row=table+16+g*12;groups.push([font.readUInt32BE(row),font.readUInt32BE(row+4),font.readUInt32BE(row+8)])}}}
 if(!groups.length)throw Error('Pinned font lacks expected Unicode format-12 character map');
 const characters=new Set(fs.readdirSync('src').filter(n=>/\.(ts|css)$/.test(n)).flatMap(n=>[...fs.readFileSync('src/'+n,'utf8')]).filter(c=>c.codePointAt(0)>=128&&!/\s/u.test(c)));
 const missing=[...characters].filter(c=>{const cp=c.codePointAt(0);return!groups.some(([start,end,glyph])=>cp>=start&&cp<=end&&glyph+cp-start!==0)});
 if(missing.length)throw Error('Bundled font lacks source characters: '+missing.join(''));
 return{sha256,bytes:font.length,checkedNonASCIICharacters:characters.size,checkedHanCharacters:[...characters].filter(c=>/\p{Script=Han}/u.test(c)).length};
}
