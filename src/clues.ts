/** Supporting evidence can be revisited; collecting it never removes it from the world. */
export const clues=[
 {id:'seating',name:'二班监考登记',x:8,z:-19,text:'二班监考登记\n数学：67分，座位尾号6。\n语文：91分，座位尾号8。\n英语：82分，座位尾号1。\n值班备注：档案柜使用座位尾号，不使用分数。登记顺序见一班试卷。'},
 {id:'channels',name:'纪律室广播索引',x:8,z:5,text:'广播频道索引\n晚自习＝7；熄灯＝3；晨检＝1。\n红字：铃声可以催人回座，不能决定谁留下。\n注销用的频道次序由档案室保管，禁止私自改写。'},
 {id:'caretaker',name:'留在储物间的值班日记',x:8,z:-2,text:'值班日记 · 最后一页\n我把每扇门都检查过了。走廊没有人，广播却还差一个名字。\n系统说，只要有一份试卷没有归档，晚自习就没有结束。\n今晚我不再按它说的做。备用记录留在二班，空白名单在办公室。若后来有人看见这页，请把走廊的灯留着。'}
] as const;
export type ClueId=typeof clues[number]['id'];
export const clueIds=clues.map(c=>c.id);
export function validClueIds(value:unknown):value is ClueId[]{return Array.isArray(value)&&value.length<=clues.length&&value.every(id=>clueIds.includes(id))&&new Set(value).size===value.length}
