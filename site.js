(function(){
var d=document,$=function(s,c){return (c||d).querySelector(s)},$$=function(s,c){return [].slice.call((c||d).querySelectorAll(s))};
var calm=matchMedia('(prefers-reduced-motion: reduce)');
window.dataLayer=window.dataLayer||[];
d.addEventListener('click',function(e){var t=e.target.closest('[data-track]');if(t)dataLayer.push({event:t.dataset.track,label:t.textContent.trim().slice(0,60)})});

/* menu */
var burger=$('.burger'),menu=$('#menu');
function setMenu(o){burger.setAttribute('aria-expanded',o);menu.classList.toggle('open',o);$('main').inert=o;$('footer').inert=o;d.body.classList.toggle('locked',o)}
burger.addEventListener('click',function(){setMenu(burger.getAttribute('aria-expanded')!=='true')});
menu.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open')){setMenu(false);burger.focus()}});
matchMedia('(min-width:1181px)').addEventListener('change',function(){setMenu(false)});

/* gold lines draw once */
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});$$('[data-in]').forEach(function(n){io.observe(n)});
var links=$$('.links a[href^="#"]:not(.btn)');var sp=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)links.forEach(function(a){if(a.getAttribute('href')==='#'+e.target.id)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})})},{rootMargin:'-45% 0px -50% 0px'});$$('main section[id],.door').forEach(function(s){sp.observe(s)})}
else $$('[data-in]').forEach(function(n){n.classList.add('in')});

addEventListener('beforeprint',function(){$$('img[loading=lazy]').forEach(function(i){i.loading='eager'})});
/* partner form: opens the visitor's email until the form handler is connected */
$$('#partner .err').forEach(function(e,i){e.id='err'+i;var n=e.parentNode.querySelector('input,select');if(n)n.setAttribute('aria-describedby',e.id)});
var dlg=$('#partner'),f=$('form',dlg),opener=$('#openPartner');
opener.addEventListener('click',function(){dlg.showModal();d.body.classList.add('locked')});
$('.x',dlg).addEventListener('click',function(){dlg.close()});
dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
dlg.addEventListener('close',function(){d.body.classList.remove('locked');opener.focus()});
function check(n){var m='';if(n.required&&!n.value.trim())m='Please complete this field.';else if(n.type==='email'&&!n.validity.valid)m='Please enter a valid email address.';var e=n.parentNode.querySelector('.err');if(e)e.textContent=m;if(m)n.setAttribute('aria-invalid','true');else n.removeAttribute('aria-invalid');return !m}
$$('input,select',f).forEach(function(n){n.addEventListener('blur',function(){if(n.hasAttribute('aria-invalid'))check(n)})});
f.addEventListener('submit',function(e){e.preventDefault();var bad=$$('input,select',f).filter(function(n){return !check(n)});if(bad.length){bad[0].focus();return}
var b=$$('input,select,textarea',f).map(function(n){return n.name+': '+n.value}).join('\n');location.href='mailto:info@asset-u.co?subject='+encodeURIComponent('Partner with ASSET-U')+'&body='+encodeURIComponent(b);$('.sent',dlg).hidden=false});
})();
/* The U in the header logo lets go into dots and comes back when the page is scrolled. At rest it is the plain vector logo. */
(function(){
var lg=document.querySelector('.lg');if(!lg||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var cv=lg.querySelector('canvas'),up=lg.querySelector('.lu'),cx=cv.getContext('2d');if(!up||!cx||!window.Path2D)return;
var X=1109,Y=294,W=240,H=310,path=new Path2D(up.getAttribute('d')),COL=getComputedStyle(up).fill||'#A69581',TEAL='#17a3a5';
var G=[],D=[],seed=7;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
function build(){
  var st=5,pts=[],x,y,i;
  for(y=Y;y<Y+H;y+=st)for(x=X;x<X+W;x+=st){var px=x+(rnd()-.5)*st*.8,py=y+(rnd()-.5)*st*.8;if(cx.isPointInPath(path,px,py))pts.push([px,py])}
  var y0=324.24,y1=573.24;pts.forEach(function(p){p[2]=(y1-p[1])/(y1-y0)+(rnd()-.5)*.16});pts.sort(function(a,b){return a[2]-b[2]});
  i=0;while(i<pts.length){var k=[3,5,8,13,20][Math.floor(Math.pow(rnd(),1.5)*5)],m=pts.slice(i,i+k),a=m[Math.floor(rnd()*m.length)],d={r:Math.sqrt(m.length)*2.15,n:m.length,acc:rnd()<.3,ph:rnd()*6.28,ph2:rnd()*6.28};
    for(var t=0;t<60;t++){d.x=a[0]+(rnd()-.5)*30*(1+t/30);d.y=a[1]+(rnd()-.5)*26*(1+t/30);if(d.x-d.r>X+2&&d.x+d.r<X+W-2&&d.y-d.r>Y+2&&d.y+d.r<Y+H-2&&D.every(function(o){var q=d.r+o.r+1.5;return (d.x-o.x)*(d.x-o.x)+(d.y-o.y)*(d.y-o.y)>q*q}))break}
    D.push(d);m.forEach(function(p,j){var lev=Math.max(0,Math.min(1,(y1-p[1])/(y1-y0))),an=j*2.4,rr=Math.sqrt(j/m.length)*d.r*.6;
      G.push({x:p[0],y:p[1],d:d,ox:Math.cos(an)*rr,oy:Math.sin(an)*rr,go:.05+.6*(1-lev)+rnd()*.1,bl:.5+rnd()*.25,dep:1.5+.95*Math.pow(lev,.92)+rnd()*.1,fl:.5+rnd()*.25,sw:(.08+rnd()*.12)*(p[0]<1229?-1:1)})});i+=k}
}
function ease(u){return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2}
var T=3.35,t0=0,last=-1e9,on=false;
function draw(now){
  var t=(now-t0)/1000,k=cv.width/W;cx.setTransform(k,0,0,k,-X*k,-Y*k);cx.clearRect(X,Y,W,H);
  if(t>=T){on=false;last=now;lg.classList.remove('fx');return}
  var line=t<1.2?573.24-249*Math.max(0,1-(t-.05)/.6):573.24-249*Math.max(0,Math.min(1,Math.pow(Math.max(0,(t-1.5)/.95),1/.92))); /* above this line the U is loose */
  if(t<.05)line=324;
  cx.save();cx.beginPath();cx.rect(X,line,W,Y+H-line);cx.clip();cx.fillStyle=COL;cx.fill(path);cx.restore();
  D.forEach(function(d){d.h=0;d.cx=d.x+Math.sin(t*1.9+d.ph)*2.2;d.cy=d.y+Math.sin(t*1.6+d.ph2)*2.2});
  cx.fillStyle=COL;var away=[],i,g,x,y,e;
  for(i=0;i<G.length;i++){g=G[i];
    var v=Math.max(0,Math.min(1,(t-g.go)/g.bl)),u=Math.max(0,Math.min(1,(t-g.dep)/g.fl)),hx=g.d.cx+g.ox,hy=g.d.cy+g.oy;
    if(u>0){e=ease(u);x=hx+(g.x-hx)*e;y=hy+(g.y-hy)*e;x+=-(g.y-hy)*Math.sin(Math.PI*e)*g.sw;y+=(g.x-hx)*Math.sin(Math.PI*e)*g.sw}
    else{e=1-Math.pow(1-v,2.6);x=g.x+(hx-g.x)*e;y=g.y+(hy-g.y)*e;x+=-(hy-g.y)*Math.sin(Math.PI*e)*g.sw*.6;y+=(hx-g.x)*Math.sin(Math.PI*e)*g.sw*.6}
    if(u<=0&&v>=.98){g.d.h++;continue}
    if((u>=1||v<=0)&&g.y>=line)continue;
    if(g.d.acc&&u<.7&&v>.25){away.push(x,y);continue}
    cx.beginPath();cx.arc(x,y,2.5,0,6.3);cx.fill()}
  cx.fillStyle=TEAL;for(i=0;i<away.length;i+=2){cx.beginPath();cx.arc(away[i],away[i+1],2.5,0,6.3);cx.fill()}
  D.forEach(function(d){if(!d.h)return;cx.fillStyle=d.acc?TEAL:COL;cx.beginPath();cx.arc(d.cx,d.cy,d.r*Math.sqrt(d.h/d.n),0,6.3);cx.fill()});
  requestAnimationFrame(draw);
}
function play(){
  if(on||document.hidden||performance.now()-last<9000)return;on=true;
  var r=cv.getBoundingClientRect(),dpr=Math.max(2,Math.min(3,devicePixelRatio||1));cv.width=Math.round(r.width*dpr);cv.height=Math.round(r.height*dpr);
  if(!G.length)build();t0=performance.now();draw(t0);lg.classList.add('fx');
}
addEventListener('scroll',play,{passive:true});
})();
