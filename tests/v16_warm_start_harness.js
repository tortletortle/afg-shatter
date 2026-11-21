'use strict';

const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const builds = ['index.html', 'compat.html'];

const prelude = `
const V=(x=0,y=0,z=0)=>[x,y,z];
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,s)=>a.map(x=>x*s);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const len=a=>Math.hypot(...a);
const norm=a=>mul(a,1/(len(a)||1));
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const qid=()=>[0,0,0,1];
const rot=(q,p)=>{let a=q.slice(0,3),t=mul(cross(a,p),2);return add(p,add(mul(t,q[3]),cross(a,t)))};
const inv=q=>[-q[0],-q[1],-q[2],q[3]];
const local=(b,p)=>add(b.center,rot(inv(b.q),sub(p,b.pos)));
const world=(b,p)=>add(b.pos,rot(b.q,sub(p,b.center)));
const V14_CONTACT_SKIN=.011;
const M={
 ceramic:{friction:.62,rolling:.05,bounce:.12},
 ice:{friction:.055,rolling:.01,bounce:.38}
};
const cmat=c=>M[c?.mat||'ceramic'];
function v15MaterialValue(c,key,fallback){
 const m=cmat(c);
 return Number.isFinite(m?.[key])?m[key]:fallback;
}
let islandByBody=new Map();
`;

function between(source, start, end, file) {
 const from = source.indexOf(start);
 if (from < 0) throw new Error(`${file}: start marker not found: ${start}`);
 const to = source.indexOf(end, from);
 if (to < 0) throw new Error(`${file}: end marker not found: ${end}`);
 return source.slice(from, to);
}

function compileInlineScripts(html, file) {
 const blocks = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
 assert.equal(blocks.length, 6, `${file}: expected 6 inline script blocks`);
 for (let i = 0; i < blocks.length; i++) {
  try {
   new Function(blocks[i][1]);
  } catch (error) {
   throw new Error(`${file}: inline script ${i + 1} failed syntax compilation: ${error.stack || error}`);
  }
 }
 return blocks.length;
}

function runPhysicsTests(html, file) {
 const wake = between(html, 'let v17WakeState=', 'function v14UpdateIslands', file);
 const production = between(html, 'function v15ApplyImpulseVector', 'function v15MaterialTests', file);
 const tests = between(html, 'function v16WarmStartTests', 'function v14Cube', file);
 const execute = new Function(
  prelude + wake + production + tests +
  `return {
   warmStart: v16WarmStartTests(),
   adaptiveIterations: v16IterationPolicyTests(),
   restingContact: v16RestingContactBenchmark()
  };`
 );
 const report = execute();
 for (const [name, result] of Object.entries(report)) {
  assert.equal(result.pass, true, `${file}: ${name} failed: ${JSON.stringify(result)}`);
 }
 return report;
}

const reports = [];
for (const file of builds) {
 const html = fs.readFileSync(path.join(root, file), 'utf8');
 const scriptBlocks = compileInlineScripts(html, file);
 const tests = runPhysicsTests(html, file);
 reports.push({ file, scriptBlocks, tests });
}

assert.deepEqual(
 reports[0].tests,
 reports[1].tests,
 'WebGL-first and Canvas2D compatibility builds must produce identical V0.16 physics test results'
);

console.log(JSON.stringify({
 version: 'AFG Shatter V0.16',
 passed: true,
 builds: reports
}, null, 2));
