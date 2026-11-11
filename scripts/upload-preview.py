"""Transfer exact successful 0.2.0 CI artifacts to its existing draft; never publish/replace."""
import hashlib,json,pathlib,subprocess,sys
root=pathlib.Path(sys.argv[1]);rows=json.loads((root/'verified-packages.json').read_text())
assert len(rows)==9, 'Expected all nine platforms/formats'
release=json.loads(subprocess.check_output(['gh','release','view','v0.2.0','--json','assets,isDraft']))
assert release['isDraft'], 'Only upload into the reviewed draft'
assets={a['name']:a for a in release['assets']}
files=[]
for row in rows:
 name=row['file'];assert name.startswith('midnight-rollcall-0.2.0-')
 found=list(root.glob('*/'+name));assert len(found)==1
 files.append(found[0])
(root/'SHA256SUMS.txt').write_text(''.join(f"{r['sha256']}  {r['file']}\n" for r in sorted(rows,key=lambda r:r['file'])))
files.extend([root/'SHA256SUMS.txt',pathlib.Path('docs/ARTIFACTS-0.2.0.md')])
for path in files:
 digest=hashlib.sha256(path.read_bytes()).hexdigest()
 if path.name in assets:
  a=assets[path.name];assert a['state']=='uploaded' and a['size']==path.stat().st_size and a['digest']=='sha256:'+digest, 'Existing asset differs: '+path.name
  print('Verified existing',path.name,flush=True);continue
 subprocess.run(['gh','release','upload','v0.2.0',str(path)],check=True)
 print('Uploaded',path.name,flush=True)
print('Draft assets uploaded; publication remains a separate verification step.')
