"""Read-only release verification against an independently downloaded CI inspection manifest."""
import hashlib,json,pathlib,re,subprocess,sys
root=pathlib.Path(sys.argv[1]);version=sys.argv[2];sha=sys.argv[3]
assert re.fullmatch(r'[0-9]+\.[0-9]+\.[0-9]+',version) and re.fullmatch(r'[a-f0-9]{40}',sha)
rows=json.loads((root/'verified-packages.json').read_text());assert len(rows)==9
release=json.loads(subprocess.check_output(['gh','release','view','v'+version,'--json','assets,isDraft,isPrerelease,targetCommitish,url']))
assert release['targetCommitish']==sha
assets={a['name']:a for a in release['assets']};assert len(assets)==11
for row in rows:
 name=row['file'];assert name.startswith('midnight-rollcall-'+version+'-')
 assert row['checksumVerified']
 if not name.endswith('-web.zip'):assert row['appVersion']==version and row['containsGameModules'] and row['entry']=='electron/main.cjs'
 else:assert row['containsWebEntry']
 a=assets[name];assert a['state']=='uploaded' and a['size']==row['size'] and a['digest']=='sha256:'+row['sha256'],name
for name in ['SHA256SUMS.txt',f'ARTIFACTS-{version}.md']:
 data=(root/name).read_bytes();a=assets[name];assert a['size']==len(data) and a['digest']=='sha256:'+hashlib.sha256(data).hexdigest(),name
report={'version':version,'sourceCommit':sha,'packageCount':9,'assetCount':11,'isDraft':release['isDraft'],'isPrerelease':release['isPrerelease'],'url':release['url'],'verified':True}
(root/'remote-verification.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
