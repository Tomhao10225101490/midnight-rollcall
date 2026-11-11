/** Load the bundled font before baking any Chinese text into canvas textures. */
export async function prepareTypography(){
 const ui=document.querySelector<HTMLElement>('#ui')!;
 ui.innerHTML='<section><p>正在载入校园… Loading…</p></section>';
 try{
  const faces=await document.fonts.load('18px RollcallText','末铃点名昭川中学');
  if(!faces.length||faces.some(face=>face.status!=='loaded'))throw Error('Bundled font unavailable');
  document.documentElement.dataset.gameFont='ready';
 }catch(error){
  ui.innerHTML='<section><h2>字体文件无法载入</h2><p>Font file could not be loaded. 请重新启动；若仍失败，请重新解压完整游戏包。</p><button id="retry-font">重新载入 / Retry</button></section>';
  ui.querySelector<HTMLButtonElement>('#retry-font')!.onclick=()=>location.reload();throw error;
 }
}
