/** Original pentatonic-related phrases. Nulls are deliberate rests, not missing notes. */
const phrases:(number|null)[][]=[
 [12,null,17,19,null,24,22,null,17,null,10,12,null,5,null,null,12,17,null,22,null,19,17,null,10,null,5,null,0,null,null,null],
 [5,null,12,null,17,12,null,10,5,null,null,0,null,5,null,null,12,null,10,5,null,0,null,null,5,10,null,12,null,null,null,null],
 [12,12,null,17,null,19,null,null,12,12,null,10,null,5,null,null,17,null,19,22,null,17,null,12,10,null,5,null,null,null,null,null],
 [0,null,5,null,0,null,10,5,null,null,12,null,10,null,5,null,0,null,5,10,null,12,null,17,10,null,5,null,0,null,null,null],
 [12,null,17,null,19,null,24,null,22,19,null,17,null,12,null,null,17,null,19,24,null,29,null,null,24,null,22,null,19,null,null,null]
];
const chasePhrase=[5,null,6,12,5,null,17,6];
export function musicEvent(stage:number,beat:number,chase:boolean){
 const chapter=Math.max(0,Math.min(4,Math.floor(stage))),phrase=chase?chasePhrase:phrases[chapter];
 const index=Math.max(0,Math.floor(beat)),semitone=phrase[index%phrase.length];
 const roots=[55,49,65.406,55],root=roots[(Math.floor(index/32)+chapter)%roots.length];
 return {chapter,interval:chase?.35:[1.65,1.75,1.55,1.4,1.8][chapter],frequency:semitone===null?null:(chase?110:root*2)*2**(semitone/12),padRoot:!chase&&index%8===0?root:null,bass:chase&&index%2===0,pan:Math.sin(index*.63)*.45};
}
