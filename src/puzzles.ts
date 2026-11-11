/** Original circuit rule: restore lighting and gate relay, isolate attendance and bell loop. */
export const circuitLabels=['走廊照明','点名回路','侧门继电器','循环铃线'];
export const circuitClue='空白名单已接收。请保留走廊照明和侧门继电器，断开点名回路与循环铃线。恢复配电后领取通行证。';
export function circuitSolved(bits:boolean[]){return bits.length===4&&bits[0]&&!bits[1]&&bits[2]&&!bits[3]}
export const records=[
 '值班规则：慢走不计分；奔跑会被听见。铃响十二秒期间开放出口，值班人停步听令；不要碰到他。',
 '试卷：分数低者先离校。数学1、英语2、语文3。办公室登记顺序按分数升序。',
 '档案记录：原广播频率被覆盖，将收音频率调整到731，发送空白名单。',
 circuitClue,
 '通行证已取得。走廊尽头东侧为校门；铃响期间离开。被追逐时不要停在门前。'
];
