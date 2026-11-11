import{type ClueId,validClueIds}from './clues';
// Keep the storage key so the previous public preview can migrate safely.
export const key='rollcall-v1';
export function read():{v:2;stage:number;notes:ClueId[]}|null{try{
 const s=JSON.parse(localStorage.getItem(key)||'null');
 if(!s||!Number.isInteger(s.stage)||s.stage<0||s.stage>4)return null;
 if(s.v===1)return{v:2,stage:s.stage,notes:[]};
 if(s.v===2&&validClueIds(s.notes))return{v:2,stage:s.stage,notes:[...s.notes]};
 return null;
}catch{return null}}
export function save(stage:number,notes:ClueId[]=[]){try{localStorage.setItem(key,JSON.stringify({v:2,stage,notes}))}catch{console.warn('存档不可用，将继续本局游戏')}}
