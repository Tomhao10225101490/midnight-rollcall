/** Original circuit rule: restore lighting and gate relay, isolate attendance and bell loop. */
export const circuitLabels=['走廊照明','点名回路','侧门继电器','循环铃线'];
export const circuitClue='空白名单已接收。请保留走廊照明和侧门继电器，断开点名回路与循环铃线。恢复配电后领取通行证。';
export function circuitSolved(bits:boolean[]){return bits.length===4&&bits[0]&&!bits[1]&&bits[2]&&!bits[3]}
export const records=[
 '值班规则：慢走不计分；奔跑会被听见。铃响十二秒期间开放出口，值班人停步听令；不要碰到他。',
 '试卷背面：分数低者先登记。将三科按分数从低到高排列，依次取座位尾号，组成档案柜密码。完整成绩和座位登记保留在走廊对面的二班。',
 '档案记录：注销频道的顺序是晚自习、熄灯、晨检。纪律室公告保留了每个频道对应的数字。将三位数字输入广播台，发送空白名单。',
 circuitClue,
 '通行证已取得。走廊尽头东侧为校门；铃响期间离开。被追逐时不要停在门前。'
];
