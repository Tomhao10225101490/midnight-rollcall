// Narrow, read-only desktop lifecycle signal. No Node objects or command APIs exposed.
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('desktopFocus',Object.freeze({
 onChange(callback){if(typeof callback!=='function')return;const listener=(_event,value)=>{if(typeof value==='boolean')callback(value)};ipcRenderer.on('game-focus',listener);return()=>ipcRenderer.removeListener('game-focus',listener)}
}));
