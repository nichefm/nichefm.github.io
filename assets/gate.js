
(function(){
var P=JSON.parse(document.getElementById('payload').textContent);
var g=document.getElementById('gate'),f=g.querySelector('form'),inp=g.querySelector('input[type=password]'),rm=g.querySelector('#rm'),btn=g.querySelector('button'),msg=g.querySelector('.msg');
var MAX=10,LOCK=15*60*1000,KK='oba-k',FK='oba-f';
function u8(s){var b=atob(s),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a}
function s64(a){var s='';for(var i=0;i<a.length;i++)s+=String.fromCharCode(a[i]);return btoa(s)}
function derive(pw){return crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']).then(function(b){
 return crypto.subtle.deriveBits({name:'PBKDF2',salt:u8(P.salt),iterations:P.iter,hash:'SHA-256'},b,256)}).then(function(x){return new Uint8Array(x)})}
function open(raw){return crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']).then(function(k){
 return crypto.subtle.decrypt({name:'AES-GCM',iv:u8(P.iv)},k,u8(P.ct))}).then(function(pt){return JSON.parse(new TextDecoder().decode(pt))})}
function show(d){var u={};for(var n in d.imgs){var t=d.imgs[n];u[n]=URL.createObjectURL(new Blob([u8(t[1])],{type:t[0]}))}
 var h=d.body.replace(/@@([\w\-\.]+)@@/g,function(_,n){return u[n]||''});document.title=d.title;document.body.innerHTML=h;var s=document.createElement('script');s.src='assets/site.js';document.body.appendChild(s);
 if(location.hash){var t=document.getElementById(location.hash.slice(1));if(t)t.scrollIntoView()}}
function store(raw,persist){var v=s64(raw);try{sessionStorage.setItem(KK,v);if(persist)localStorage.setItem(KK,v)}catch(e){}}
function fails(){try{return JSON.parse(localStorage.getItem(FK))||{n:0,t:0}}catch(e){return{n:0,t:0}}}
function setFails(o){try{localStorage.setItem(FK,JSON.stringify(o))}catch(e){}}
function locked(){var o=fails();if(o.t>Date.now()){var m=Math.ceil((o.t-Date.now())/60000);msg.textContent='Too many attempts. Try again in '+m+' minute'+(m>1?'s':'')+'.';btn.disabled=true;setTimeout(function(){btn.disabled=false;msg.textContent='';},o.t-Date.now());return true}return false}
function ready(){g.classList.remove('wait');if(!locked())inp.focus()}
var saved=null;try{saved=sessionStorage.getItem(KK)||localStorage.getItem(KK)}catch(e){}
if(saved){open(u8(saved)).then(show).catch(function(){try{sessionStorage.removeItem(KK);localStorage.removeItem(KK)}catch(e){}ready()})}else ready();
f.addEventListener('submit',function(e){e.preventDefault();if(locked())return;var pw=inp.value;if(!pw)return;
 btn.disabled=true;msg.textContent='Unlocking...';var raw;
 derive(pw).then(function(r){raw=r;return open(r)}).then(function(d){setFails({n:0,t:0});store(raw,rm.checked);show(d)})
 .catch(function(){var o=fails();o.n++;if(o.n>=MAX){o={n:0,t:Date.now()+LOCK}}setFails(o);btn.disabled=false;inp.value='';
  if(!locked()){var left=MAX-o.n;msg.textContent='Incorrect password. '+left+' attempt'+(left>1?'s':'')+' left before a 15 minute lockout.';inp.focus()}})});
})();
