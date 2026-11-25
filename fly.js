/* The flywheel. She is the gold pin.
   She travels Build, Own, Amplify. Each stage lights when she reaches it, and the line behind her turns gold.
   When she is back at Build the loop is closed and Protect, the hub, lights. Then the next turn begins.
   The diagram itself never moves or zooms. */
(function(){
var d=document,$=function(s,c){return (c||d).querySelector(s)},$$=function(s,c){return [].slice.call((c||d).querySelectorAll(s))};
var wheel=$('.wheel');if(!wheel)return;
var calm=matchMedia('(prefers-reduced-motion: reduce)'),loop=$('#loop'),pin=$('#pin'),trail=$('#trail'),btn=$('.pause'),stages=$$('.stage'),rings=$$('.ring');
var len=loop.getTotalLength(),T=20000,HOLD=2800,FADE=600,t=0,last=0,raf=0,phase='run',clock=0,vis=false,paused=false,picked=null,seen=false,cur='';
var C={build:[1263,194],own:[1607,738],amplify:[911,738]};
window.dataLayer=window.dataLayer||[];

function show(k,all){
  stages.forEach(function(s){var on=s.dataset.stage===k;s.classList.toggle('on',on);$('button',s).setAttribute('aria-pressed',on)});
  rings.forEach(function(r){r.classList.toggle('on',!!all||r.dataset.ring===k)});
}
function draw(){
  var u=Math.min(t,1),p=loop.getPointAtLength(len*u);
  pin.setAttribute('transform','translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+')');
  trail.style.strokeDashoffset=(1-u).toFixed(4);return p;
}
function place(){
  var p=draw();if(picked)return;
  var k='';for(var n in C)if(Math.hypot(p.x-C[n][0],p.y-C[n][1])<124)k=n;
  if(k&&k!==cur){cur=k;show(k)}
}
function closeLoop(){phase='hold';clock=HOLD;t=1;draw();cur='protect';show('protect',true)}
function tick(now){
  raf=0;if(!vis||paused||calm.matches){last=0;return}
  var dt=last?Math.min(now-last,100):0;last=now;
  if(phase==='run'){t+=dt/T;if(t>=1)closeLoop();else place()}
  else if(phase==='hold'){clock-=dt;if(clock<=0){phase='fade';clock=FADE;trail.style.opacity=0}}
  else{clock-=dt;if(clock<=0){phase='run';t=0;cur='';trail.style.strokeDashoffset=1;trail.style.opacity=1;place()}}
  raf=requestAnimationFrame(tick);
}
function sync(){
  wheel.classList.toggle('run',!calm.matches);wheel.classList.toggle('paused',paused||!vis);
  if(vis&&!paused&&!calm.matches&&!raf){last=0;raf=requestAnimationFrame(tick)}
}
function setPause(p){paused=p;btn.textContent=p?'Play the flywheel':'Pause the flywheel';btn.setAttribute('aria-pressed',p);sync()}

btn.addEventListener('click',function(){
  if(paused){picked=null;cur='';if(phase!=='run'||t>=1){phase='run';t=0;trail.style.opacity=1}}
  setPause(!paused);
});
stages.forEach(function(s){$('button',s).addEventListener('click',function(){
  var k=s.dataset.stage;picked=k;cur=k;phase='run';trail.style.opacity=1;
  if(C[k]){for(var i=0;i<=600;i++){var p=loop.getPointAtLength(len*i/600);if(Math.hypot(p.x-C[k][0],p.y-C[k][1])<118){t=i/600;break}}draw();show(k)}
  else{t=1;draw();show('protect',true)}
  setPause(true);
  if(matchMedia('(max-width:1100px)').matches)wheel.scrollIntoView({block:'center',behavior:calm.matches?'auto':'smooth'});
})});

if(calm.matches){pin.style.display='none';trail.style.display='none'}
else{pin.setAttribute('opacity',1);place()}
if('IntersectionObserver' in window)new IntersectionObserver(function(es){
  vis=es[0].isIntersecting;if(vis&&!seen){seen=true;dataLayer.push({event:'flywheel_view'})}sync();
},{threshold:.25}).observe(wheel);else{vis=true;sync()}
})();
