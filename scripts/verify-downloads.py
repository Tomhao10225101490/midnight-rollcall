"""Check hashes, archive payloads, app version and entry modules without running binaries."""
import posixpath
import pathlib,hashlib,json,zipfile,tarfile,sys,os,struct,re,shutil,subprocess,tempfile
root=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else 'artifacts/ci-78203cf');results=[]
seven=os.environ.get('SEVEN_ZIP') or shutil.which('7zz') or shutil.which('7z')
def unpack(archive,name):
 assert seven,'7-Zip required for executable/DMG/AppImage payload inspection'
 return subprocess.check_output([seven,'e','-so',str(archive),name],stderr=subprocess.PIPE)
def archive_asar(archive):
 assert seven,'7-Zip required'
 listing=subprocess.check_output([seven,'l','-slt',str(archive)],stderr=subprocess.PIPE).decode('utf-8')
 names=[line[7:] for line in listing.splitlines() if line.startswith('Path = ') and line.endswith('/app.asar')]
 assert len(names)==1,(archive.name,'expected one app.asar',names)
 return unpack(archive,names[0])
def inspect_modules(read):
 """Follow shipped static ESM imports; missing transitive addons must fail a release."""
 html=read('index.html').decode('utf-8');assert './main.js' in html
 css=read('style.css').decode('utf-8')
 if 'NotoSansSC-Regular.otf' in css or b'prepareTypography' in read('main.js'):
  assert '@font-face' in css and 'NotoSansSC-Regular.otf' in css and 'RollcallText' in css,'Font stylesheet missing'
  assert hashlib.sha256(read('fonts/NotoSansSC-Regular.otf')).hexdigest()=='faa6c9df652116dde789d351359f3d7e5d2285a2b2a1f04a2d7244df706d5ea9','Font missing or changed'
  assert b'SIL OPEN FONT LICENSE Version 1.1' in read('licenses/NOTO-OFL.txt'),'Font license missing'
  assert b'2014-2021 Adobe' in read('licenses/NOTO-COPYRIGHT.txt'),'Font copyright missing'
  assert b'f8d157532fbfaeda587e826d4cd5b21a49186f7c' in read('licenses/NOTO-SOURCE.md'),'Font provenance missing'
 checked=set()
 def visit(name):
  assert not name.startswith(('../','/')),name
  if name in checked:return
  checked.add(name);source=read(name).decode('utf-8');assert source.strip(),name
  for spec in re.findall(r"(?:from|import)\s*['\"]([^'\"]+)['\"]",source):
   if spec.startswith('.'):
    target=posixpath.normpath(posixpath.join(posixpath.dirname(name),spec))
   elif spec=='three':target='three.module.js'
   elif spec.startswith('three/addons/'):
    assert '"three/addons/":"./addons/"' in html
    target='addons/'+spec[len('three/addons/'):]
   else:raise AssertionError('Unbundled import '+spec+' in '+name)
   visit(target)
 visit('main.js')
 return len(checked)
def inspect_asar(data,expected):
 header_size=struct.unpack_from('<I',data,4)[0];json_size=struct.unpack_from('<I',data,12)[0]
 assert 16+json_size<=8+header_size<=len(data)
 header=json.loads(data[16:16+json_size]);base=8+header_size
 def read(name):
  node=header
  for part in name.split('/'):node=node['files'][part]
  assert not node.get('unpacked') and 'offset'in node
  start=base+int(node['offset']);end=start+node['size'];assert end<=len(data)
  return data[start:end]
 package=json.loads(read('package.json'));assert package['version']==expected
 assert package['main']=='electron/main.cjs' and b'contextIsolation:true'in read(package['main'])
 if b'preload.cjs' in read(package['main']):assert b'contextBridge.exposeInMainWorld' in read('electron/preload.cjs')
 for name in ['dist/index.html','dist/main.js','dist/world.js','dist/enemy.js','dist/player.js','dist/audio.js','dist/three.module.js','dist/three.core.js','dist/licenses/PROJECT-LICENSE.txt']:
  assert len(read(name))>0,name
 return {'appVersion':package['version'],'containsGameModules':True,'entry':package['main'],'verifiedModuleCount':inspect_modules(lambda name:read('dist/'+name))}
for sums in sorted(root.glob('*/SHA256SUMS.txt')):
 for line in sums.read_text().splitlines():
  expected,name=line.split('  ',1);assert pathlib.Path(name).name==name
  p=sums.parent/name;assert p.is_file(),name
  digest=hashlib.sha256()
  with p.open('rb') as f:
   for chunk in iter(lambda:f.read(1024*1024),b''):digest.update(chunk)
  actual=digest.hexdigest();assert actual==expected,name
  version=re.match(r'midnight-rollcall-([0-9]+\.[0-9]+\.[0-9]+)-',name).group(1)
  r={'file':name,'size':p.stat().st_size,'sha256':actual,'checksumVerified':True};data=None
  if name.endswith('-web.zip'):
   with zipfile.ZipFile(p) as z:
    r['containsWebEntry']={'index.html','main.js','three.module.js','three.core.js','world.js','enemy.js','audio.js'}<=set(z.namelist());assert r['containsWebEntry'];r['verifiedModuleCount']=inspect_modules(z.read)
  elif name.endswith('.zip'):
   with zipfile.ZipFile(p) as z:
    names=z.namelist();asar=[n for n in names if n.endswith('Resources/app.asar')];assert len(asar)==1
    r['containsExecutable']=any('/Contents/MacOS/'in x for x in names);assert r['containsExecutable'];data=z.read(asar[0])
  elif name.endswith('.tar.gz'):
   with tarfile.open(p,'r:gz') as t:
    members=t.getmembers();asar=[m for m in members if m.name.endswith('resources/app.asar')];assert len(asar)==1;data=t.extractfile(asar[0]).read()
    assert any(m.name.endswith('/midnight-rollcall') and m.mode&0o111 for m in members),'Linux executable missing'
  elif name.endswith('.exe'):
   with tempfile.TemporaryDirectory() as tmp:
    inner=pathlib.Path(tmp)/'app.7z';inner.write_bytes(unpack(p,'$PLUGINSDIR/app-64.7z'));data=archive_asar(inner)
  elif name.endswith(('.dmg','.AppImage')):data=archive_asar(p)
  else:raise AssertionError('Unsupported package '+name)
  if data is not None:r.update(inspect_asar(data,version));r['containsAppAsar']=True
  results.append(r)
assert len(results)==9 and len({r['file']for r in results})==9,'Expected nine distinct release packages'
(root/'verified-packages.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
