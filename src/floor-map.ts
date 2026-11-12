const rooms=[['一班教室','遗留试卷'],['二班教室','监考登记'],['办公室','档案保管'],['储物间','铁柜藏身'],['广播室','点名控制'],['纪律公示室','频道索引'],['配电间','侧门供电'],['侧门值班处','离校出口']];
export function roomAt(x:number,z:number){
 if(z<=-38)return '操场';
 if(z<=-32&&x>=7.4)return '二楼连廊';
 if(z<=-22&&x<=-10.2)return '男厕所';
 if(z<=-22&&x>=7.4)return '楼梯';
 if(z<=-22)return '一层门厅';
 if(z>22)return '校外';
 if(Math.abs(x)<=4)return '中央走廊';
 const row=Math.max(0,Math.min(3,Math.floor((z+20)/10)));
 return rooms[row*2+(x>0?1:0)][0];
}
export function floorMap(x:number,z:number){
 const current=roomAt(x,z);
 const cells=rooms.map(([name,use],i)=>{
  const row=Math.floor(i/2),left=i%2===0,px=left?20:370,py=110+row*70;
  return `<g class="${current===name?'map-current':''}"><rect x="${px}" y="${py}" width="210" height="58" rx="3"/><text x="${px+105}" y="${py+24}" class="map-room">${name}</text><text x="${px+105}" y="${py+44}" class="map-use">${use}</text></g><path d="M ${left?230:350} ${py+29} h 20" class="map-door"/>`;
 }).join('');
 const annex=`<g class="${current==='一层门厅'?'map-current':''}"><rect x="180" y="58" width="240" height="44" rx="3"/><text x="300" y="85" class="map-room">一层门厅</text></g>
 <g class="${current==='男厕所'?'map-current':''}"><rect x="20" y="58" width="150" height="44" rx="3"/><text x="95" y="85" class="map-room">男厕所</text></g>
 <g class="${current==='楼梯'||current==='二楼连廊'?'map-current':''}"><rect x="430" y="58" width="150" height="44" rx="3"/><text x="505" y="85" class="map-room">楼梯 / 二楼</text></g>
 <g class="${current==='操场'?'map-current':''}"><rect x="20" y="8" width="560" height="42" rx="3"/><text x="300" y="34" class="map-room">操场</text></g>`;
 return `<div class="floor-map"><p>当前位置：<strong>${current}</strong> · 上方为操场与入口，下方为侧门端</p><svg viewBox="0 0 600 460" role="img" aria-label="教学楼疏散示意。上方为操场、男厕所、门厅与楼梯；西侧从入楼端依次为一班、办公室、广播室、配电间；东侧依次为二班、储物间、纪律公示室、侧门。"><g class="${current==='中央走廊'?'map-current':''}"><rect x="250" y="100" width="100" height="300"/><text x="300" y="230">中</text><text x="300" y="257">央</text><text x="300" y="284">走</text><text x="300" y="311">廊</text></g>${annex}${cells}<text x="300" y="52" class="map-direction">操场 / 入楼端</text><path d="M 475 384 v 26" class="map-exit"/><text x="490" y="430" class="map-direction">离校方向 ↓</text></svg><p>西侧房间在图左，东侧在图右。门口以短线标出，房间以现场门牌为准。侧门只在铃声期间开放。</p></div>`;
}
