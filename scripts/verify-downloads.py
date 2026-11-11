import pathlib,hashlib,json,zipfile,tarfile,sys
root=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else 'artifacts/ci-78203cf');results=[]
for sums in root.glob('*/SHA256SUMS.txt'):
 for line in sums.read_text().splitlines():
  expected,name=line.split('  ',1);p=sums.parent/name
  if not p.exists():continue
  digest=hashlib.sha256()
  with p.open('rb') as f:
   for chunk in iter(lambda:f.read(1024*1024),b''):digest.update(chunk)
  actual=digest.hexdigest();assert actual==expected,name
  r={'file':name,'size':p.stat().st_size,'sha256':actual,'checksumVerified':True}
  if name.endswith('-web.zip'):
   with zipfile.ZipFile(p) as z:r['containsWebEntry']={'index.html','main.js','three.module.js','three.core.js'}<=set(z.namelist())
   assert r['containsWebEntry']
  elif name.endswith('.zip'):
   with zipfile.ZipFile(p) as z:
    names=z.namelist();r['containsAppAsar']=any(x.endswith('Resources/app.asar')for x in names);r['containsExecutable']=any('/Contents/MacOS/'in x for x in names)
   assert r['containsAppAsar'] and r['containsExecutable']
  if name.endswith('.tar.gz'):
   with tarfile.open(p,'r:gz') as t:r['containsAppAsar']=any(x.name.endswith('resources/app.asar')for x in t)
   assert r['containsAppAsar']
  results.append(r)
(root/'verified-packages.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
