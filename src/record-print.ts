import type {ClueId} from './clues';
export type PaperRecord={id:ClueId;text:string};
/** Print the authoritative in-game clue verbatim; no independently copied puzzle numbers. */
export function printRecord(c:CanvasRenderingContext2D,record:PaperRecord){
 const [title,...paragraphs]=record.text.split('\n');
 const accent=record.id==='channels'?'#873d34':record.id==='seating'?'#365c50':'#55544a';
 c.fillStyle=accent;c.fillRect(57,63,654,10);c.textAlign='center';c.fillStyle='#303b34';c.font='34px RollcallText';c.fillText(title,384,139,646);
 c.font='20px RollcallText';c.fillStyle=accent;c.fillText(record.id==='caretaker'?'私人记录 · 留给后来的人':'昭川中学 · 校务留存',384,179);
 c.textAlign='left';let size=29;
 const wrap=()=>{const lines:{text:string;red:boolean;end:boolean}[]=[];c.font=`${size}px RollcallText`;for(const paragraph of paragraphs){let line='';const red=paragraph.startsWith('红字：');for(const char of paragraph){if(line&&c.measureText(line+char).width>610){if(/[，。；：？！、）】]/.test(char)&&line.length>1){lines.push({text:line.slice(0,-1),red,end:false});line=line.slice(-1)+char}else{lines.push({text:line,red,end:false});line=char}}else line+=char}lines.push({text:line,red,end:true})}return lines};
 let lines=wrap();while(lines.length*size*1.65+paragraphs.length*13>730&&size>20){size--;lines=wrap()}
 let y=247;
 for(const line of lines){c.strokeStyle=record.id==='caretaker'?'#776d5244':'#54624e33';c.lineWidth=1;c.beginPath();c.moveTo(77,y+12);c.lineTo(691,y+12);c.stroke();c.fillStyle=line.red?'#873d34':'#384039';c.fillText(line.text,79,y);y+=size*1.65+(line.end?13:0)}
 c.strokeStyle=accent;c.lineWidth=2;c.strokeRect(56,210,656,782);
 c.textAlign='center';c.font='20px RollcallText';c.fillStyle=accent;c.fillText(record.id==='caretaker'?'请把走廊的灯留着。':'原始记录 · 不得擅自改写',384,1035);c.textAlign='left';
}
