"""Transfer exact successful CI artifacts to an existing draft; never publish/replace."""
import hashlib,json,os,pathlib,re,subprocess,sys
root=pathlib.Path(sys.argv[1]);version=os.environ['PREVIEW_VERSION'];sha=os.environ['SOURCE_SHA']
assert re.fullmatch(r'[0-9]+\.[0-9]+\.[0-9]+',version) and re.fullmatch(r'[a-f0-9]{40}',sha)
tag='v'+version;rows=json.loads((root/'verified-packages.json').read_text())
assert len(rows)==9, 'Expected all nine platforms/formats'
release=json.loads(subprocess.check_output(['gh','release','view',tag,'--json','assets,isDraft,targetCommitish']))
assert release['isDraft'] and release['targetCommitish']==sha, 'Only upload into the reviewed exact-source draft'
assets={a['name']:a for a in release['assets']};files=[]
for row in rows:
 name=row['file'];assert name.startswith('midnight-rollcall-'+version+'-')
 found=list(root.glob('*/'+name));assert len(found)==1
 files.append(found[0])
(root/'SHA256SUMS.txt').write_text(''.join(f"{r['sha256']}  {r['file']}\n" for r in sorted(rows,key=lambda r:r['file'])))
manifest=root/f'ARTIFACTS-{version}.md'
manifest.write_text(f'# 末铃点名 {version} 发布产物\n\n构建源提交：{sha}。大小单位为字节；校验算法SHA256。\n\n| 文件 | 字节数 | SHA256 |\n|---|---:|---|\n'+''.join(f"| {r['file']} | {r['size']} | `{r['sha256']}` |\n" for r in sorted(rows,key=lambda r:r['file'])))
files.extend([root/'SHA256SUMS.txt',manifest])
for path in files:
 digest=hashlib.sha256(path.read_bytes()).hexdigest()
 if path.name in assets:
  a=assets[path.name];assert a['state']=='uploaded' and a['size']==path.stat().st_size and a['digest']=='sha256:'+digest, 'Existing asset differs: '+path.name
  print('Verified existing',path.name,flush=True);continue
 subprocess.run(['gh','release','upload',tag,str(path)],check=True)
 print('Uploaded',path.name,flush=True)
print('Draft assets uploaded; publication remains a separate verification step.')
