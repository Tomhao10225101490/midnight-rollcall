import json,pathlib,zipfile,hashlib
version=json.loads(pathlib.Path('package.json').read_text())['version']
out=pathlib.Path('release')/('midnight-rollcall-'+version+'-web.zip');out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=9)as z:
 for p in sorted(pathlib.Path('dist').rglob('*')):
  if p.is_file() and p.name not in ['ELECTRON-LICENSE.txt','CHROMIUM-LICENSES.html']:z.write(p,p.relative_to('dist'))
with zipfile.ZipFile(out)as z:
 assert {'index.html','main.js','three.module.js','three.core.js'}<=set(z.namelist())
print(str(out),out.stat().st_size,hashlib.sha256(out.read_bytes()).hexdigest())
