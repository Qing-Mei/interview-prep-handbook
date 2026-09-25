(() => {
 const zh=document.documentElement.lang.startsWith('zh');
 const $=s=>document.querySelector(s);
 const all=[...document.querySelectorAll('input[data-task]')];
 const articles=[...document.querySelectorAll('[data-article]')];
 const key='interview-prep:'+new URL('.',location.href).pathname+':progress:v1';
 let state={}; let mode='guide'; let persistent=true;
 try {const data=JSON.parse(localStorage.getItem(key)||'{}'); if(data && typeof data==='object'&&!Array.isArray(data)) state=data;} catch {persistent=false;}
 function note(){if(!persistent) $('#storage-note').textContent=zh?'浏览器存储不可用；本次勾选仅在当前页面有效。':'Browser storage is unavailable; progress lasts only on this page.';}
 function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{persistent=false;}note();}
 function progress(){
  const scope=mode==='quick'?all.filter(x=>x.closest('article').id==='section-8'):all;
  const n=scope.filter(x=>x.checked).length;
  $('#done').textContent=n;$('#total').textContent=` / ${scope.length}`;
  $('#progress').max=scope.length;$('#progress').value=n;
 }
 all.forEach(input=>{input.checked=state[input.dataset.task]===true;input.addEventListener('change',()=>{state[input.dataset.task]=input.checked;save();progress();});});
 function filter(){const q=$('#search').value.trim().toLocaleLowerCase();let visible=0;
  for(const a of articles){const matches=(!q||a.textContent.toLocaleLowerCase().includes(q))&&(mode==='guide'||a.id==='section-8');a.hidden=!matches;if(matches)visible++;}
  $('#empty').hidden=visible>0;$('#results').textContent=q?(zh?`${visible} 个章节`:`${visible} sections`):'';
 }
 function setMode(next){mode=next;$('#guide').setAttribute('aria-pressed',String(mode==='guide'));$('#quick').setAttribute('aria-pressed',String(mode==='quick'));filter();progress();const u=new URL(location);if(mode==='quick')u.searchParams.set('mode','quick');else u.searchParams.delete('mode');history.replaceState(null,'',u);}
 $('#search').addEventListener('input',filter);
 $('#guide').addEventListener('click',()=>setMode('guide'));
 $('#quick').addEventListener('click',()=>setMode('quick'));
 $('#reset').addEventListener('click',()=>{if(!confirm(zh?'清除所有勾选，开始新一轮练习？':'Clear all checkmarks and start a new practice?'))return;state={};all.forEach(x=>x.checked=false);save();progress();});
 $('#print').addEventListener('click',()=>window.print());
 $('#language').addEventListener('click',e=>{e.preventDefault();const u=new URL(e.currentTarget.href);if(mode==='quick')u.searchParams.set('mode','quick');u.hash=location.hash;location.href=u;});
 document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{$('#search').value='';setMode('guide');}));
 const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.dataset.section===e.target.id));}},{rootMargin:'-10% 0px -65% 0px'});
 articles.forEach(a=>observer.observe(a));
 window.addEventListener('storage',e=>{if(e.key!==key)return;try{const d=JSON.parse(e.newValue||'{}');state=d&&typeof d==='object'&&!Array.isArray(d)?d:{};all.forEach(x=>x.checked=state[x.dataset.task]===true);progress();}catch{}});
 note();setMode(new URL(location).searchParams.get('mode')==='quick'?'quick':'guide');
})();
