
(function(){
var d=document,b=d.body;
// header turns solid once past the hero
var h=d.querySelector('header.site');
function hs(){h.classList.toggle('solid',window.scrollY>60)}
hs();window.addEventListener('scroll',hs,{passive:true});

// review notes toggle
var t=d.getElementById('tog');
if(t){try{if(localStorage.getItem('clean')==='1')b.classList.add('clean')}catch(e){}
function lab(){t.textContent=b.classList.contains('clean')?'Show review notes':'Hide review notes'}
lab();t.addEventListener('click',function(){b.classList.toggle('clean');
try{localStorage.setItem('clean',b.classList.contains('clean')?'1':'0')}catch(e){}lab()})}

// reveal on scroll, staggered within groups
var els=[].slice.call(d.querySelectorAll('.feat,.lead,main>h2,main>p,.gallery .zoom,.tour a,.tl li,.chart,.tile,.quote,.vid,.award,.step,.dl'));
if('IntersectionObserver' in window){
 els.forEach(function(e){e.classList.add('rv');var p=e.parentNode,k=[].indexOf.call(p.children,e);
  if(/gallery|tour|tl|tiles|vids|awards|steps/.test(p.className))e.style.transitionDelay=(k*90)+'ms'});
 var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
 els.forEach(function(e){io.observe(e)});
}

// count up single numbers in stats
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
[].forEach.call(d.querySelectorAll('.stat'),function(s){
 var n=s.firstChild;if(!n||n.nodeType!==3)return;var m=n.nodeValue.match(/\d+/g);if(!m||m.length!==1||reduce)return;
 var end=+m[0],pre=n.nodeValue.slice(0,n.nodeValue.indexOf(m[0])),post=n.nodeValue.slice(n.nodeValue.indexOf(m[0])+m[0].length),done=false;
 var o=new IntersectionObserver(function(en){if(!en[0].isIntersecting||done)return;done=true;var t0=null;
  function f(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1400,1),e=1-Math.pow(1-p,3);n.nodeValue=pre+Math.round(end*e)+post;if(p<1)requestAnimationFrame(f)}
  requestAnimationFrame(f)},{threshold:.5});o.observe(s)});

// lightbox
var zs=[].slice.call(d.querySelectorAll('.zoom'));
if(!zs.length)return;
var lb=d.createElement('div');lb.id='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Photo viewer');
lb.innerHTML='<button class="x" aria-label="Close">&times;</button><button class="pv" aria-label="Previous photo">&#8249;</button><button class="nx" aria-label="Next photo">&#8250;</button><img alt="">';
b.appendChild(lb);
var im=lb.querySelector('img'),i=0,last=null;
function show(n){i=(n+zs.length)%zs.length;var s=zs[i].querySelector('img');im.src=s.currentSrc||s.src;im.alt=s.alt}
function open(n){last=d.activeElement;show(n);lb.classList.add('open');requestAnimationFrame(function(){lb.classList.add('show')});lb.querySelector('.x').focus()}
function close(){lb.classList.remove('show');setTimeout(function(){lb.classList.remove('open')},300);if(last)last.focus()}
zs.forEach(function(z,n){z.setAttribute('tabindex','0');z.setAttribute('role','button');z.setAttribute('aria-label','Enlarge photo: '+z.querySelector('img').alt);
 z.addEventListener('click',function(){open(n)});
 z.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(n)}})});
lb.querySelector('.x').onclick=close;lb.querySelector('.pv').onclick=function(){show(i-1)};lb.querySelector('.nx').onclick=function(){show(i+1)};
lb.addEventListener('click',function(e){if(e.target===lb)close()});
d.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;
 if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(i-1);else if(e.key==='ArrowRight')show(i+1)});
})();
