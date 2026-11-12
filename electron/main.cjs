const {app,BrowserWindow,session,Menu}=require('electron');const path=require('node:path');
if(process.env.ROLLCALL_QA==='1')app.setPath('userData',path.join(app.getPath('temp'),'midnight-rollcall-qa-'+process.pid));
app.whenReady().then(()=>{
 session.defaultSession.setPermissionRequestHandler((_w,permission,callback)=>callback(permission==='pointerLock'||permission==='fullscreen'));
 const w=new BrowserWindow({width:1280,height:800,minWidth:800,minHeight:600,backgroundColor:'#101615',title:'末铃点名',webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true}});
 const sendFocus=()=>{if(!w.isDestroyed())w.webContents.send('game-focus',w.isFocused()&&!w.isMinimized())};
 for(const event of ['focus','blur','minimize','restore'])w.on(event,sendFocus);w.webContents.on('did-finish-load',sendFocus);
 w.webContents.setWindowOpenHandler(()=>({action:'deny'}));w.webContents.on('will-navigate',e=>e.preventDefault());
 Menu.setApplicationMenu(Menu.buildFromTemplate([{label:'末铃点名',submenu:[{role:'about'},{role:'quit'}]},{label:'窗口',submenu:[{role:'togglefullscreen'},{role:'minimize'}]}]));
 const query={};if(process.env.ROLLCALL_QA==='1')query.qa='1';if(process.env.ROLLCALL_QA_CALM==='1')query.calm='1';w.loadFile(path.join(__dirname,'../dist/index.html'),Object.keys(query).length?{query}:{});
});app.on('window-all-closed',()=>app.quit());
