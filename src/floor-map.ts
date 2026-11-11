const rooms=[['一班教室','遗留试卷'],['二班教室','监考登记'],['办公室','档案保管'],['储物间','铁柜藏身'],['广播室','点名控制'],['纪律公示室','频道索引'],['配电间','侧门供电'],['侧门值班处','离校出口']];
export function roomAt(x:number,z:number){
 if(z>22)return '校外';
 if(Math.abs(x)<=4)return '中央走廊';
 const row=Math.max(0,Math.min(3,Math.floor((z+20)/10)));
 return rooms[row*2+(x>0?1:0)][0];
}
export function floorMap(x:number,z:number){
 const current=roomAt(x,z);
 const cells=rooms.map(([name,use],i)=>{
  const row=Math.floor(i/2),left=i%2===0,px=left?20:370,py=42+row*82;
  return `<g class="${current===name?'map-current':''}"><rect x="${px}" y="${py}" width="210" height="68" rx="3"/><text x="${px+105}" y="${py+28}" class="map-room">${name}</text><text x="${px+105}" y="${py+50}" class="map-use">${use}</text></g><path d="M ${left?230:350} ${py+34} h 20" class="map-door"/>`;
 }).join('');
 return `<div class="floor-map"><p>当前位置：<strong>${current}</strong> · 上方为入楼端，下方为侧门端</p><svg viewBox="0 0 600 410" role="img" aria-label="教学楼疏散示意。西侧从入楼端依次为一班、办公室、广播室、配电间；东侧依次为二班、储物间、纪律公示室、侧门。"><g class="${current==='中央走廊'?'map-current':''}"><rect x="250" y="32" width="100" height="340"/><text x="300" y="173">中</text><text x="300" y="200">央</text><text x="300" y="227">走</text><text x="300" y="254">廊</text></g>${cells}<text x="300" y="20" class="map-direction">入楼端</text><path d="M 475 356 v 26" class="map-exit"/><text x="490" y="401" class="map-direction">离校方向 ↓</text></svg><p>西侧房间在图左，东侧在图右。门口以短线标出，房间以现场门牌为准。侧门只在铃声期间开放。</p></div>`;
}
