const test=require('node:test');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const F=require('../core.js');
const copy=x=>JSON.parse(JSON.stringify(x));
test('20 original paired experiments and 40 individually distinct synthesized sounds',()=>{
  assert.equal(F.levels.length,20);assert.equal(F.sounds.length,40);
  assert.equal(new Set(F.levels.flatMap(l=>[l.left,l.right])).size,40);
  const hashes=new Set();
  for(const sound of F.sounds){const data=F.synth(sound);assert.equal(data.length,38400);let peak=0;for(const x of data){assert.ok(Number.isFinite(x));peak=Math.max(peak,Math.abs(x));}assert.ok(peak>.02&&peak<=1);hashes.add(crypto.createHash('sha256').update(Buffer.from(data.buffer)).digest('hex'));}
  assert.equal(hashes.size,40);
});
for(const level of F.levels)test(`${level.id}: public example passes all deterministic conditions`,()=>{
  const p=F.validateProject(F.example(level));assert.equal(F.evaluate(p,level).passed,true);
  assert.deepEqual(F.evaluate(p,level),F.evaluate(p,level));
  assert.equal(F.evaluate(F.emptyProject(level.index),level).passed,false);
});
test('judgment accepts reasonable alternatives, rejects silence and wrong timing',()=>{
  const p=F.example(F.levels[0]);p.clips.forEach(c=>c.soundId='s1');assert.ok(F.evaluate(p,F.levels[0]).passed);
  p.clips[0].gain=.09;assert.ok(!F.evaluate(p,F.levels[0]).passed);
  p.clips[0].gain=.5;p.clips[0].start+=.5;assert.ok(!F.evaluate(p,F.levels[0]).passed);
});
test('one clip cannot satisfy two events and nonmatching clips cannot satisfy operation rules',()=>{
  const p=F.example(F.levels[9]);p.clips[0].speed=1;const wrong=F.defaultClip('s0',0);wrong.speed=2;p.clips.push(wrong);assert.ok(!F.evaluate(p,F.levels[9]).passed);
  const l={events:[{time:1,categories:['wood'],tolerance:.22},{time:1.1,categories:['wood'],tolerance:.22}]};assert.ok(!F.evaluate({...F.emptyProject(),clips:[F.defaultClip('s0',1)]},l).passed);
});
test('mix duration, silence timing, finite samples, 64-clip overload protection and WAV structure',()=>{
  const p=F.example(F.levels[0]);const cache=new Map(F.sounds.map(s=>[s.id,F.synth(s)]));const mix=F.renderMix(p,id=>cache.get(id));assert.equal(mix.length,144000);assert.ok(mix.subarray(0,36000).every(x=>x===0));assert.ok(mix.subarray(36001,39000).some(x=>x!==0));
  p.clips=Array.from({length:64},(_,i)=>({...F.defaultClip('s1',0),id:'c'+i,gain:1,repeats:8,gap:.15}));const max=F.renderMix(p,id=>cache.get(id));let peak=0;for(const x of max){assert.ok(Number.isFinite(x));peak=Math.max(peak,Math.abs(x));}assert.ok(peak<=.950001);
  const wav=Buffer.from(F.wav(mix));assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.toString('ascii',8,12),'WAVE');assert.equal(wav.readUInt32LE(24),24000);assert.equal(wav.readUInt32LE(40),mix.length*2);assert.equal(wav.length,44+mix.length*2);
});
test('project roundtrip strips unknown properties and preserves edits',()=>{const p=F.example(F.levels[3]);p.note='盲听像心跳';p.title='<script>safe text</script>';p.extra='ignored';const good=F.validateProject(JSON.parse(JSON.stringify(p)));assert.equal(good.note,p.note);assert.equal(good.title,p.title);assert.equal(good.extra,undefined);});
test('reject corrupted, oversized, missing, NaN, invalid trim, mismatched challenge and duplicate IDs',()=>{
  for(const change of [p=>p.version=9,p=>p.clips[0].soundId='evil',p=>p.clips[0].start=NaN,p=>p.clips[0].speed=100,p=>p.clips[0].repeats=1.5,p=>p.clips[0].trimStart=.6,p=>p.clips.push(copy(p.clips[0])),p=>p.clips=Array(65).fill(p.clips[0]),p=>p.scene=3,p=>p.duration=5]){const p=F.example(F.levels[0]);change(p);assert.throws(()=>F.validateProject(p));}
  assert.throws(()=>F.validateProject(null));assert.throws(()=>F.validateProject([]));
});
test('custom PCM validation handles full 10-second sound and rejects broken bytes',()=>{
  const p=F.emptyProject();p.custom=[{id:'u-test',name:'my noise',pcm:Buffer.alloc(480000).toString('base64')}];assert.equal(F.validateProject(p).custom[0].duration,10);
  p.custom[0].pcm='!!!!';assert.throws(()=>F.validateProject(p));p.custom[0].pcm=Buffer.alloc(3).toString('base64');assert.throws(()=>F.validateProject(p));
});
