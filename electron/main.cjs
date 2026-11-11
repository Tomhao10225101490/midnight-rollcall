const {app,BrowserWindow,session,Menu}=require('electron');const path=require('node:path');
if(process.env.ROLLCALL_QA==='1')app.setPath('userData',path.join(app.getPath('temp'),'midnight-rollcall-qa-'+process.pid));
app.whenReady().then(()=>{
 session.defaultSession.setPermissionRequestHandler((_w,permission,callback)=>callback(permission==='pointerLock'||permission==='fullscreen'));
 const w=new BrowserWindow({width:1280,height:800,minWidth:800,minHeight:600,backgroundColor:'#101615',title:'末铃点名',webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
 w.webContents.setWindowOpenHandler(()=>({action:'deny'}));w.webContents.on('will-navigate',e=>e.preventDefault());
 Menu.setApplicationMenu(Menu.buildFromTemplate([{label:'末铃点名',submenu:[{role:'about'},{role:'quit'}]},{label:'窗口',submenu:[{role:'togglefullscreen'},{role:'minimize'}]}]));
 w.loadFile(path.join(__dirname,'../dist/index.html'),process.env.ROLLCALL_QA==='1'?{query:{qa:'1'}}:{});
});app.on('window-all-closed',()=>app.quit());
