'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const builds=['index.html','compat.html'];
function between(source,start,end,file){
 const a=source.indexOf(start),b=source.indexOf(end,a);
 assert.ok(a>=0&&b>a,file+': missing '+start);
 return source.slice(a,b);
}
function makeStats(){return {hits:0,broken:0,input:0,energy:0,spill:0,plasticEvents:0,plasticWork:0,plasticMaxDepth:0};}
function build(html,file){
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
 assert.equal(scripts.length,6,file+': expected six inline scripts');
 for(let i=0;i<scripts.length;i++)assert.doesNotThrow(()=>new Function(scripts[i][1]),file+': script '+(i+1)+' syntax');
 const ms=html.indexOf('const M={'),me=html.indexOf(';\nconst SHAPE_INFO',ms);
 assert.ok(ms>=0&&me>ms,file+': material table not found');
 const materialLiteral=html.slice(ms+'const M='.length,me);
 const plastic=between(html,'function updateBodyBounds(','function activeEdges(',file);
 const impact=between(html,'function impact(','function floorMin(',file);
 assert.match(html,/function fracture\(b,source,hit,E,secondary=false,cutDir=null,plastic=false\)/);
 assert.match(html,/energyError:stats\.input-stats\.energy-stats\.spill-\(stats\.plasticWork\|\|0\)/);
 const prelude=
 'const V=(x=0,y=0,z=0)=>[x,y,z];\n'+
 'const add=(a,b)=>a.map((x,i)=>x+b[i]);\n'+
 'const sub=(a,b)=>a.map((x,i)=>x-b[i]);\n'+
 'const mul=(a,s)=>a.map(x=>x*s);\n'+
 'const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);\n'+
 'const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];\n'+
 'const len=a=>Math.hypot(...a);\n'+
 'const norm=a=>mul(a,1/(len(a)||1));\n'+
 'const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));\n'+
 'const qid=()=>[0,0,0,1];\n'+
 'const rot=(q,p)=>{let a=q.slice(0,3),t=mul(cross(a,p),2);return add(p,add(mul(t,q[3]),cross(a,t)))};\n'+
 'const inv=q=>[-q[0],-q[1],-q[2],q[3]];\n'+
 'const local=(b,p)=>add(b.center,rot(inv(b.q),sub(p,b.pos)));\n'+
 'const EPS=1e-8;\n'+
 'const M='+materialLiteral+';\n'+
 'let specimen="single",objectShape="hollowCan",material="aluminum",cells=[],bodies=[],stats=makeStats(),gpuRenderer=null;\n'+
 'let fractureCalls=[];\n'+
 'const feedbackCalls=[];\n'+
 'const window={AFGFeedback:{contact(...args){feedbackCalls.push(args)}}};\n'+
 'function cubeFaces(center,h=.045){const v=[V(-h,-h,-h),V(h,-h,-h),V(h,h,-h),V(-h,h,-h),V(-h,-h,h),V(h,-h,h),V(h,h,h),V(-h,h,h)].map(p=>add(center,p));return [[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]].map(ids=>({p:ids.map(i=>v[i])}));}\n'+
 'function makeBody(){const b={fixed:true,center:V(),pos:V(),q:qid(),cells:[],r:0,fluidR:0};for(let j=0;j<4;j++)for(let i=0;i<16;i++){const a=i*Math.PI*2/16,c={center:V(.94*Math.cos(a),-.75+j*.5,.94*Math.sin(a)),mass:1,volume:1};c.faces=cubeFaces(c.center);b.cells.push(c);}return b;}\n'+
 'function fracture(b,c,p,E,secondary=false,cut=null,plastic=false){stats.input+=E;stats.spill+=E;stats.hits++;fractureCalls.push({energy:E,plastic});return false;}\n'+
 'function applyImpulse(){}\n'+
 'function effect(){}\n';
 const run=new Function(prelude+plastic+impact+
 'return function(){\n'+
 'let body=makeBody();bodies=[body];cells=body.cells;stats=makeStats();fractureCalls=[];\n'+
 'const hit=V(.94,0,0),firstResult=impact(body,body.cells[0],hit,10,V(-1,0,0)),first=plasticReport();\n'+
 'const firstLedger=Math.abs(stats.input-stats.energy-stats.spill-(stats.plasticWork||0)),firstFracture=fractureCalls[0]||null;\n'+
 'const before=cells.map(c=>c.faces.map(f=>f.p.map(p=>p.slice())));\n'+
 'body=makeBody();bodies=[body];cells=body.cells;stats=makeStats();\n'+
 'let last={changed:true},pureHits=0,saturated=false;\n'+
 'for(let i=0;i<32;i++){last=plasticIndent(body,hit,10);pureHits++;if(!last.changed){saturated=true;break;}}\n'+
 'const pure=plasticReport();let relativeError=0,boundsError=0,finite=true;\n'+
 'for(let ci=0;ci<cells.length;ci++){const c=cells[ci],oldFaces=before[ci]||[];for(let fi=0;fi<c.faces.length;fi++){const old=oldFaces[fi],now=c.faces[fi].p;for(let k=1;k<now.length;k++){const a=sub(now[k],now[0]),b=sub(old[k],old[0]);relativeError=Math.max(relativeError,len(sub(a,b)));}for(const p of now){finite=finite&&p.every(Number.isFinite);boundsError=Math.max(boundsError,len(sub(p,body.center))-body.r);}}}\n'+
 'const cases=[\n'+
 '{name:"first-impact-enters-plastic-yield",pass:firstResult===true&&first.deformedCells>0&&first.maxDepth>0,details:first},\n'+
 '{name:"plastic-work-is-separated-from-fracture-energy",pass:!!firstFracture&&firstFracture.plastic===true&&firstFracture.energy<.1&&firstLedger<1e-8,details:{fractureEnergy:firstFracture&&firstFracture.energy,plasticWork:stats.plasticWork,energyResidual:firstLedger}},\n'+
 '{name:"repeated-indentation-reaches-depth-cap",pass:pure.maxDepth>=pure.maxAllowed*.95&&pure.maxDepth<=pure.maxAllowed+1e-7,details:{maxDepth:pure.maxDepth,limit:pure.maxAllowed,pureHits}},\n'+
 '{name:"saturated-cells-stop-accumulating-displacement",pass:saturated&&last.changed===false,details:{saturated,pureHits}},\n'+
 '{name:"rigid-cell-translation-preserves-cell-shape",pass:relativeError<1e-8,details:{maxRelativeVertexError:relativeError}},\n'+
 '{name:"body-bounds-and-geometry-remain-finite",pass:finite&&boundsError<1e-7&&Number.isFinite(body.r)&&Number.isFinite(body.fluidR),details:{boundsError,r:body.r,fluidR:body.fluidR}},\n'+
 '{name:"plastic-depth-is-bounded",pass:pure.maxDepth<=M.aluminum.plasticMaxDepth+1e-7,details:{maxDepth:pure.maxDepth,maxAllowed:M.aluminum.plasticMaxDepth}}\n'+
 '];return {file,scriptBlocks:scripts.length,cases,passed:cases.filter(x=>x.pass).length,total:cases.length,pass:cases.every(x=>x.pass)};\n'+
 '};')();
 const result=run();
 for(const test of result.cases)assert.equal(test.pass,true,file+': '+test.name+' failed: '+JSON.stringify(test.details));
 return result;
}
const reports=[];
for(const file of builds)reports.push(build(fs.readFileSync(path.join(root,file),'utf8'),file));
assert.deepEqual(reports[0].cases,reports[1].cases,'WebGL2 and Canvas2D plastic-model parity');
console.log(JSON.stringify({version:'AFG Shatter V0.18',passed:true,scope:'Production plastic helper and impact functions extracted from both builds; deterministic synthetic convex-cell test. Not a full browser or calibrated material test.',builds:reports},null,2));
