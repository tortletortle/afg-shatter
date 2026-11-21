'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const builds=['index.html','compat.html'];
function extract(html,start,end,file){
 const a=html.indexOf(start),b=html.indexOf(end,a);
 assert.ok(a>=0&&b>a,`${file}: missing source block ${start}`);
 return html.slice(a,b);
}
function run(html,file){
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
 assert.equal(scripts.length,6,`${file}: expected 6 inline scripts`);
 for(let i=0;i<scripts.length;i++)assert.doesNotThrow(()=>new Function(scripts[i][1]),`${file}: script ${i+1} syntax`);
 const scheduler=extract(html,'// V0.17: deterministic contact-island budget allocation','function v15AdaptBudget(',file);
 const execute=new Function(scheduler+`
 const unit=v17ScheduleTests();
 const scales=[100,300,500,1000].map(count=>{
  v17IslandServiceState=new Map();
  const bodies=Array.from({length:count},(_,id)=>({id}));
  const pairs=[];
  for(let base=0;base<count;base+=8){
   const end=Math.min(count,base+8);
   for(let id=base;id<end-1;id++)pairs.push({a:bodies[id],b:bodies[id+1],score:1+((id*17)%23)/10});
  }
  const budget=900,islands=v17AllocateIslandBudgets(pairs,budget,1);
  const allocated=islands.reduce((n,x)=>n+x.allocation,0);
  const served=islands.filter(x=>x.allocation>0).length;
  return {fragments:count,pairs:pairs.length,islands:islands.length,budget,allocated,served,minAllocation:Math.min(...islands.map(x=>x.allocation)),maxAllocation:Math.max(...islands.map(x=>x.allocation)),withinBudget:allocated<=budget,allServed:served===islands.length};
 });
 return {unit,scales};
 `)();
 assert.equal(execute.unit.pass,true,`${file}: unit tests failed ${JSON.stringify(execute.unit)}`);
 for(const result of execute.scales){
  assert.ok(result.withinBudget,`${file}: budget overrun at ${result.fragments}`);
  assert.ok(result.allServed,`${file}: island starvation at ${result.fragments}`);
  assert.equal(result.allocated,900);
 }
 return {scriptBlocks:scripts.length,...execute};
}
const results=builds.map(file=>({file,...run(fs.readFileSync(path.join(root,file),'utf8'),file)}));
assert.deepEqual(results[0].scales,results[1].scales,'WebGL and Canvas2D scheduler scale results differ');
console.log(JSON.stringify({version:'AFG Shatter V0.17',passed:true,method:'Synthetic connected-fragment graphs; scheduler allocation stress only, not physical simulation or browser frame-time evidence.',builds:results},null,2));
