// Compatibility entry point. Use the installed, locked Electron version via electron-builder.
import{execFileSync}from'node:child_process';
if(process.platform!=='darwin')throw Error('This command is for macOS; use npm run dist for the current OS');
execFileSync(process.execPath,['node_modules/electron-builder/cli.js','--mac','--arm64','--publish','never'],{stdio:'inherit',env:{...process.env,CSC_IDENTITY_AUTO_DISCOVERY:'false'}});
