import{createRequire}from 'node:module';import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from 'node:url';
const require=createRequire(import.meta.url),engine=process.env.ROLLCALL_MUSIC_ENGINE;
if(!engine||!path.isAbsolute(engine))throw Error('Set ROLLCALL_MUSIC_ENGINE to the absolute build-music/tools path');
const m=require(engine),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const PROJECT_ASSETS_SFX=path.join(root,'assets','GeneratedSFX');fs.mkdirSync(PROJECT_ASSETS_SFX,{recursive:true});
const{chords,meta}=m.composeChords({genre:'cinematic-melancholy',voice:'piano'}),bpm=m.suggestTempo('ambient'),bars=8;
const match=meta.key.match(/^([A-Ga-g][#b]?)(-?\d+)$/),scaleRoot=match[1]+(Number(match[2])+1);
const piano=m.chordEvents(chords,{voice:'piano',bars,velocity:58,stagger:.14});
const pad=m.chordEvents(chords,{voice:'pad',bars,velocity:37,stagger:.2});
const melody=m.composeMelody({chords,bars,notesPerBar:4,octaveShift:1,contour:'falling',scale:meta.scale,scaleRoot,restProbability:.38});
const bass=m.composeBass({chords,genre:'ambient',bars,style:'root',variation:.15});
const tracks=[
 m.track('empty-classroom-piano','piano',piano,{fx:{hpf:180,lpf:3600,reverb:'mediumRoom',gain:.38},pan:-.12}),
 m.track('distant-air','pad',m.mask(pad,'~@2 x@4 ~@2',bars,4),{fx:{hpf:260,lpf:1600,chorus:{voices:2,mix:.18},reverb:'largeHall',gain:.11}}),
 m.track('last-answer','clarinet',m.mask(melody,'~@2 x@4 ~@2',bars,4),{fx:{hpf:330,lpf:3300,reverb:'largeHall',gain:.22},pan:.12}),
 m.track('low-room-tone','subBass',m.mask(bass,'~@2 x@3 ~@3',bars,4),{fx:{hpf:45,lpf:120,gain:.15}})
];
const out=m.render(tracks,{bpm,master:{normalize:'peak',glue:true,width:1.08}});
for(const channel of [out.left,out.right])for(let i=0;i<channel.length;i++){const fadeIn=Math.min(1,i/(44100*.3)),fadeOut=Math.min(1,(channel.length-1-i)/(44100*2.5));channel[i]*=fadeIn*fadeOut}
const filename=path.join(PROJECT_ASSETS_SFX,'after_last_rollcall.wav');m.WavBuilder.write(out,filename);
const provenance={title:'末铃之后',bpm,harmony:meta,chords,tracks,seconds:out.left.length/44100,engine:'Specs build-music/build-sfx Apache-2.0, local algorithmic synthesis; no samples',scope:'audition candidate, not integrated or subjectively approved'};
fs.writeFileSync(path.join(PROJECT_ASSETS_SFX,'after_last_rollcall.json'),JSON.stringify(provenance,null,2));console.log(JSON.stringify({filename,bpm,harmony:meta,seconds:provenance.seconds}));
