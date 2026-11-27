/* The gap film: the picture follows the scroll. The spheres have one job: they count what the words say.
   Without this script, with motion turned off, or on a data-saving connection, the page keeps its three still pictures. */
(function(){
var film=document.querySelector('.film');if(!film)return;
var conn=navigator.connection;
if(matchMedia('(prefers-reduced-motion:reduce)').matches||(conn&&conn.saveData)||!window.CSS||!CSS.supports('width','1cqw')||!('IntersectionObserver' in window))return;
var $=function(s){return film.querySelector(s)};
var stage=$('.film-stage'),cv=$('canvas'),cx=cv&&cv.getContext('2d');if(!stage||!cx)return;

/* the scroll, in hundredths of a screen: a clip plays across its length, a hold rests on the last picture */
var CLIPS=['gather','fill','reform','steps','gapfill'];
var SEG=[['gather',110],['hold',25],['fill',90],['hold',45],['reform',110],['hold',45],['steps',100],['gapfill',90],['hold',50]];
var small=matchMedia('(max-width:760px)').matches,pre=small?'m-':'d-';
var counts=(film.getAttribute(small?'data-m':'data-d')||'').split(',').map(Number),N={},ok=true;
CLIPS.forEach(function(k,i){N[k]=counts[i];if(!(N[k]>1))ok=false});if(!ok)return;
if(small){cv.width=560;cv.height=315}
var at=0,start={},len={};
SEG.forEach(function(s){s[2]=at;if(s[0]!=='hold'){start[s[0]]=at;len[s[0]]=s[1]}at+=s[1]});
var TOTAL=at;

/* pictures: nothing loads until the section is near; then in scroll order, with the frame on screen first */
var imgs={},queue=[],active=0,begun=false;
CLIPS.forEach(function(k){imgs[k]=[]});
function load(k,i){active++;var im=new Image();im.decoding='async';
  im.onload=im.onerror=function(){active--;if(im.naturalWidth){imgs[k][i]=im;if(live)ask()}pump()};
  im.src='img/film/'+k+'/'+pre+('00'+(i+1)).slice(-3)+'.webp'}
function pump(){while(active<6&&queue.length){var q=queue.shift();load(q[0],q[1])}}
function begin(){if(begun)return;begun=true;CLIPS.forEach(function(k){for(var i=0;i<N[k];i++)queue.push([k,i])});pump()}
function first(k,i){for(var j=0;j<queue.length;j++)if(queue[j][0]===k&&queue[j][1]===i){queue.unshift(queue.splice(j,1)[0]);pump();return}}
function best(k,i){                               /* the frame asked for, or the nearest earlier one that has arrived */
  for(var c=CLIPS.indexOf(k);c>=0;c--){var a=imgs[CLIPS[c]];for(var j=c===CLIPS.indexOf(k)?i:N[CLIPS[c]]-1;j>=0;j--)if(a[j])return a[j]}
  return null}

var el={s1:$('.film-s1'),s2:$('.film-s2'),s3:$('.film-s3'),f1:$('.film-f1'),f2:$('.film-f2'),k1:$('.film-k1'),k2:$('.film-k2'),
  u1:$('.film-u1'),t1:$('.film-t1'),u2:$('.film-u2'),t2:$('.film-t2'),n124:$('.film-n124'),n54:$('.film-n54')};
function on(e,v){if(e)e.classList.toggle('on',!!v)}
function txt(e,v){if(e&&e.textContent!==String(v))e.textContent=v}
function cl(v){return v<0?0:v>1?1:v}
var topOff=0,shown=null;
function measure(){topOff=parseFloat(getComputedStyle(stage).top)||0}
function paint(){
  var span=film.offsetHeight-stage.offsetHeight,t=span>0?cl((topOff-film.getBoundingClientRect().top)/span)*TOTAL:0;
  var clip=CLIPS[0],f=0,last=CLIPS[0];
  for(var i=0;i<SEG.length;i++){var s=SEG[i];if(s[0]!=='hold')last=s[0];
    if(t>=s[2]&&(t<s[2]+s[1]||i===SEG.length-1)){clip=last;f=s[0]==='hold'?N[clip]-1:Math.min(N[clip]-1,Math.round((t-s[2])/s[1]*(N[clip]-1)));break}}
  if(begun&&!imgs[clip][f])first(clip,f);
  var im=best(clip,f);if(im&&im!==shown){cx.drawImage(im,0,0,cv.width,cv.height);shown=im}

  var g=cl((t-start.gather)/len.gather),fl=cl((t-start.fill)/len.fill),rf=cl((t-start.reform)/len.reform),st=cl((t-start.steps)/len.steps),gp=cl((t-start.gapfill)/len.gapfill);
  on(el.s1,rf<.2);on(el.f1,g>.5);txt(el.n124,Math.round(cl((g-.5)/.48)*124));
  on(el.k1,g>.15&&rf<.12);on(el.u1,g>.15);on(el.t1,fl>.04);txt(el.n54,Math.round(cl(fl/.92)*54));
  on(el.s2,rf>=.2&&gp<.12);on(el.f2,rf>.7&&st<.25);
  on(el.k2,rf>.96&&st<.1);on(el.u2,rf>.96);on(el.t2,rf>.96);
  on(el.s3,gp>=.12);
}
var tick=false,live=false;
function ask(){if(!tick){tick=true;requestAnimationFrame(function(){tick=false;paint()})}}

film.style.setProperty('--film-len',TOTAL);film.classList.add('film-on');measure();paint();
new IntersectionObserver(function(es,o){if(es[0].isIntersecting){begin();o.disconnect()}},{rootMargin:'150% 0px'}).observe(film);
new IntersectionObserver(function(es){live=es[0].isIntersecting;if(live)ask()}).observe(film);
addEventListener('scroll',function(){if(live)ask()},{passive:true});
addEventListener('resize',function(){measure();shown=null;ask()});
addEventListener('pageshow',ask);
})();
