/* Every movement here has one job. If it has no job, it does not move.
   1 Doorway   the U is a door: it opens on the women the next sentence is about
   1b Story    each picture opens as its words are read
   1c Gap      now a film (film.js): the spheres count the number in the sentence
   2 Divisions the line runs from the parent to each division, and that division opens
   3 Close     the mark drawn at the start is built again by your own scroll            */
(function(){
if(!window.gsap||!window.ScrollTrigger)return;
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ignoreMobileResize:true});
var d=document,root=d.documentElement,$=function(s,c){return (c||d).querySelector(s)},$$=function(s,c){return [].slice.call((c||d).querySelectorAll(s))};
function split(el){
  if(el._w)return el._w;var list=[];
  (function walk(n){[].slice.call(n.childNodes).forEach(function(c){
    if(c.nodeType===3){var f=d.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(p){
      if(!p)return;if(/^\s+$/.test(p)){f.appendChild(d.createTextNode(' '));return}
      var w=d.createElement('span');w.className='w';var i=d.createElement('i');i.textContent=p;w.appendChild(i);f.appendChild(w);list.push(i)});
      n.replaceChild(f,c)}
    else if(c.nodeType===1&&c.tagName!=='SUP')walk(c)})})(el);
  return el._w=list;
}
function navH(){return $('.nav').offsetHeight}
var mm=gsap.matchMedia(),built=false;
mm.add({big:'(min-width:1101px) and (prefers-reduced-motion:no-preference)',small:'(max-width:1100px) and (prefers-reduced-motion:no-preference)'},function(ctx){
  if(built)return;built=true;                       /* rotating a tablet falls back to the still layout */
  var small=ctx.conditions.small;
  root.classList.add('mo');root.classList.toggle('small',!!small);

  /* 1. Doorway */
  var opening=$('.opening'),door=$('.door'),counter=$('.hero .u-counter'),beats=$$('.door .beat').map(split),k=null;
  function box(){
    var a=counter.getBoundingClientRect(),o=door.getBoundingClientRect();
    k={t:Math.max(0,a.top-o.top),l:a.left-o.left,r:o.right-a.right,b:Math.max(0,o.bottom-a.bottom),w:a.width};
    door.style.setProperty('--cx',(k.l+k.w/2)+'px');
    if(small){                                        /* picture starts under the headline, and her face sits inside the U */
      var big=$('.door .big'),txt=big.getBoundingClientRect().bottom-o.top+14,topPx=Math.max(txt,k.t+12);
      var im=$('.door-img'),ar=(+im.getAttribute('height')||1235)/(+im.getAttribute('width')||1500);
      var hh=Math.min(door.clientHeight-topPx,innerWidth*1.12*ar,760);
      if(innerWidth>innerHeight&&innerWidth>700){     /* tablet on its side: picture beside the words, not under them */
        var tr=Math.max.apply(null,$$('.door .w').map(function(w){return w.getBoundingClientRect().right}))+16;
        var ww=Math.min(innerWidth-tr,(door.clientHeight-navH()-24)/ar);hh=ww*ar;
        door.style.setProperty('--cx',(innerWidth-ww*.525)+'px');
      }
      door.style.setProperty('--imgh',Math.max(220,hh)+'px');
    }
    return k;
  }
  var q={crack:0,open:0};
  function paint(){
    var c=k||box(),e=q.open,n=1-e,half=c.w/2*(1-q.crack);
    var r=c.w*.2*n*q.crack+innerWidth*.14*Math.sin(Math.PI*e);
    door.style.clipPath=e>=.999?'none':'inset('+(c.t*n)+'px '+((c.r+half)*n)+'px '+(c.b*n)+'px '+((c.l+half)*n)+'px round 0px 0px '+r+'px '+r+'px)';
  }
  function vis(s){door.style.visibility=s.progress>.001?'visible':'hidden'}
  var tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:opening,pinSpacer:$('.opening-pin'),start:'bottom bottom',end:function(){return '+='+innerHeight*(small?1.25:1.4)},pin:true,scrub:.6,anticipatePin:1,invalidateOnRefresh:true,onToggle:vis,onUpdate:vis,onRefresh:function(s){k=null;box();paint();vis(s)}}});
  tl.to(q,{crack:1,duration:.14,ease:'power2.inOut',onUpdate:paint},0)
    .to(q,{open:1,duration:.38,ease:'power2.inOut',onUpdate:paint},.12)
    .to('.hero-copy',{autoAlpha:0,duration:.1},.17)
    .fromTo('.door .label',{opacity:0},{opacity:1,duration:.06},.38)
    .fromTo(beats[0],{yPercent:112},{yPercent:0,duration:.12,stagger:.02,ease:'power3.out'},.4)
    .fromTo(beats[1],{yPercent:112},{yPercent:0,duration:.14,stagger:.02,ease:'power3.out'},.6)
    .to({},{duration:.04});
  var ab=function(e){var a=e.target.closest('a[href="#about"]');if(!a)return;e.preventDefault();scrollTo({top:tl.scrollTrigger.start+(tl.scrollTrigger.end-tl.scrollTrigger.start)*.96,behavior:'smooth'});history.replaceState(null,'','#about')};
  d.addEventListener('click',ab);

  /* 1b. Value story: each picture opens, like the doorway, as its words are read */
  var story=$('.story'),sc=$$('.story .scene'),lines=$$('.say-l'),cxs=small&&innerHeight>innerWidth?[.5,.5,.5]:[.66,.74,.70];
  function ease(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
  function door2(el,p,c){
    el.classList.toggle('open',p>0);if(p<=0)return;
    if(p>=1){el.style.clipPath='none';return}
    var e=ease(p),l=c*(1-e)*100,r=(1-c)*(1-e)*100,q=(1-e)*el.clientWidth*.1*Math.min(1,p*6);
    el.style.clipPath='inset(0% '+r+'% 0% '+l+'% round 0px 0px '+q+'px '+q+'px)';
  }
  function room(){if(small){var st=$('.story-stage').getBoundingClientRect(),sy=$('.say').getBoundingClientRect();$('.story-stage').style.setProperty('--th',Math.round(sy.bottom-st.top+14)+'px')}}
  room();ScrollTrigger.create({trigger:story,start:function(){return 'top '+$('.nav').offsetHeight+'px'},end:'bottom bottom',invalidateOnRefresh:true,onUpdate:tell,onRefresh:function(s){room();tell(s)}});
  function tell(s){
    var p=s.progress,a=(p-.26)/.2,b=(p-.62)/.2;
    door2(sc[1],Math.max(0,Math.min(1,a)),cxs[1]);door2(sc[2],Math.max(0,Math.min(1,b)),cxs[2]);
    var on=b>.4?2:a>.4?1:0;lines.forEach(function(l,i){l.classList.toggle('on',i===on)});
  }

  /* 2. Divisions: parent, line, division, in that order */
  if(innerWidth>760){
    var cards=$$('.org .div'),order=small?cards.map(function(c){return [c]}):[[cards[1],cards[2]],[cards[0],cards[3]]];
    var dt=gsap.timeline({scrollTrigger:{trigger:'.org',start:small?'top 64%':'top 56%',once:true}});
    $('.org').addEventListener('focusin',function(){dt.progress(1)});
    dt.from('.trunk',{scaleY:0,duration:.5,ease:'power2.in'},0).from('.branch',{scaleX:0,duration:.9,ease:'power1.inOut'},.5);
    order.forEach(function(set,i){
      var at=small?.7+i*.18:(i?1.28:.82);
      dt.fromTo(set.map(function(c){return $('img',c)}),{opacity:0},{opacity:1,duration:.3,ease:'none'},at)
        .fromTo(set.map(function(c){return $('.card',c)}),{clipPath:'inset(0% 0% 100% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:.8,ease:'power3.inOut',clearProps:'clipPath'},at+.12);
    });
  }

  /* 3. Close */
  gsap.fromTo('.ln-u path',{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.connect',start:'top 85%',end:'bottom bottom',scrub:.5}});

  return function(){d.removeEventListener('click',ab);root.classList.remove('mo','small');door.style.cssText='';sc.forEach(function(x){x.style.cssText='';x.classList.remove('open')});$$('.d.off').forEach(function(x){x.classList.remove('off')});setTimeout(function(){gsap.killTweensOf('*');gsap.set('.hero-copy,.door,.door .label',{clearProps:'all'});gsap.set('.w>i',{clearProps:'transform'});door.style.cssText=''},120)};
});
addEventListener('load',function(){ScrollTrigger.refresh()});
if(d.fonts&&d.fonts.ready)d.fonts.ready.then(function(){ScrollTrigger.refresh()});
})();
