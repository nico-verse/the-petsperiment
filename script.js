const english=document.documentElement.lang==='en';
const menu=document.querySelector('.menu'),nav=document.querySelector('nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu'}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?(english?'Close':'Chiudi'):'Menu'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.querySelectorAll('[data-dialog]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.dialog).showModal()));
const zoom=document.getElementById('zoom');
document.querySelectorAll('[data-zoom]').forEach(b=>b.addEventListener('click',()=>{const img=zoom.querySelector('img');img.src=b.dataset.zoom;img.alt=(b.querySelector('img.active')||b.querySelector('img')).alt;zoom.querySelector('p').textContent=b.dataset.caption;zoom.showModal()}));
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});
const events=english?{
boom:['That noise doesn’t sound promising.','An Event in the Experiment deck. It triggers the moment you draw it. Nobody said the lab was a quiet place.'],
kaos:['Science had a plan. Chaos had another.','KAOS doesn’t fill a slot on your board: it triggers as soon as it is drawn. Sometimes your next Experiment is a surprise.'],
vertigo:['Time for a completely different hand.','Discard all the Action cards in your hand, then draw the same number. Vertigo triggers as soon as it is drawn.']
}:{
boom:['Quel rumore non promette bene.','Un Evento nel mazzo Esperimenti. Appena lo peschi, si attiva: nessuno ha detto che il laboratorio fosse un posto tranquillo.'],
kaos:['La scienza aveva un piano. Il caos, un altro.','KAOS non occupa uno slot della plancia: si attiva appena viene pescato. A volte il prossimo Esperimento è un imprevisto.'],
vertigo:['È ora di cambiare tutte le carte in mano.','Scarta tutte le carte Azione che hai in mano e pescane lo stesso numero. Vertigo si attiva appena viene pescato.']
};
const tabs=[...document.querySelectorAll('[data-event]')];
function select(b){tabs.forEach(x=>{x.setAttribute('aria-selected',String(x===b));x.tabIndex=x===b?0:-1});const panel=document.getElementById('event-text');panel.setAttribute('aria-labelledby',b.id);panel.querySelector('h4').textContent=events[b.dataset.event][0];panel.querySelector('p').textContent=events[b.dataset.event][1]}
tabs.forEach((b,i)=>{b.addEventListener('click',()=>select(b));b.addEventListener('keydown',e=>{let j;if(e.key==='ArrowRight')j=(i+1)%tabs.length;if(e.key==='ArrowLeft')j=(i+tabs.length-1)%tabs.length;if(e.key==='Home')j=0;if(e.key==='End')j=tabs.length-1;if(j!==undefined){e.preventDefault();select(tabs[j]);tabs[j].focus()}})});
const carousel=document.querySelector('.experiment-carousel');
if(carousel){const slides=[...carousel.querySelectorAll('.experiment-slide')],buttons=[...carousel.querySelectorAll('.slide-select')],pause=carousel.querySelector('.slide-pause'),stage=carousel.querySelector('.experiment-stage');const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let index=0,userPaused=reduced.matches,hovered=false,focused=false,timer;
function show(i){index=i;slides.forEach((s,j)=>{s.classList.toggle('active',i===j);s.setAttribute('aria-hidden',String(i!==j))});buttons.forEach((b,j)=>b.setAttribute('aria-current',String(i===j)));stage.dataset.zoom=slides[i].getAttribute('src')}
function schedule(){clearInterval(timer);if(!userPaused&&!hovered&&!focused&&!document.hidden&&!document.querySelector('dialog[open]'))timer=setInterval(()=>show((index+1)%slides.length),4500)}
function updatePause(){pause.setAttribute('aria-pressed',String(userPaused));pause.textContent=userPaused?(english?'Play':'Riprendi'):(english?'Pause':'Pausa')}
buttons.forEach((b,i)=>b.addEventListener('click',()=>{show(i);schedule()}));pause.addEventListener('click',()=>{userPaused=!userPaused;updatePause();schedule()});carousel.addEventListener('mouseenter',()=>{hovered=true;schedule()});carousel.addEventListener('mouseleave',()=>{hovered=false;schedule()});carousel.addEventListener('focusin',()=>{focused=true;schedule()});carousel.addEventListener('focusout',()=>setTimeout(()=>{focused=carousel.contains(document.activeElement);schedule()},0));document.addEventListener('visibilitychange',schedule);document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('close',schedule);new MutationObserver(schedule).observe(d,{attributes:true,attributeFilter:['open']})});reduced.addEventListener('change',()=>{userPaused=reduced.matches;updatePause();schedule()});updatePause();schedule();}
