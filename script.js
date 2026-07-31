// Site behaviours — A.Culturals'26 (cleaned + fixed)
(function(){
  // scroll reveal
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  // mobile nav
  document.querySelectorAll('[data-burger]').forEach(function(b){
    b.addEventListener('click',function(){
      var n=b.closest('[data-nav]');
      if(n){
        var open=n.classList.toggle('open');
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    });
  });
  document.querySelectorAll('[data-nav] .nav-links a').forEach(function(a){
    a.addEventListener('click',function(){
      var n=a.closest('[data-nav]');
      if(n){ n.classList.remove('open'); var burger=n.querySelector('[data-burger]'); if(burger) burger.setAttribute('aria-expanded','false'); }
    });
  });

  // countdowns
  document.querySelectorAll('[data-countdown]').forEach(function(cd){
    var target=new Date(cd.getAttribute('data-countdown')).getTime();
    if(isNaN(target))return;
    function pad(v){return (v<10?'0':'')+v;}
    function set(k,v){var el=cd.querySelector('[data-cd="'+k+'"]');if(el)el.textContent=pad(v);}
    function tick(){
      var d=target-Date.now();if(d<0)d=0;
      set('days',Math.floor(d/864e5));
      set('hours',Math.floor(d%864e5/36e5));
      set('mins',Math.floor(d%36e5/6e4));
      set('secs',Math.floor(d%6e4/1e3));
    }
    tick();setInterval(tick,1000);
  });

  /* NOTE: the old hand-rolled "grid-scene zoom" script has been removed.
     The generic scene-layer engine at the bottom of this file already
     drives the --p / --vp custom properties that styles.css uses to
     scale .grid-wrap and fade .hero-frame. Having both scripts write to
     the same transform caused the jittery/incorrect hero zoom. */
})();


/* ── effects kit ── */
(function(){
  document.querySelectorAll('[data-typewriter]').forEach(function(el){
    var words=(el.getAttribute('data-typewriter')||el.textContent||'').split('|').filter(Boolean);
    if(!words.length)return; el.textContent=''; var wi=0,ci=0,del=false;
    (function loop(){ var w=words[wi%words.length];
      el.textContent=w.slice(0,ci); el.classList.add('tw-caret');
      if(!del){ ci++; if(ci>w.length){del=true; return setTimeout(loop,1400);} }
      else { ci--; if(ci<0){del=false; wi++; ci=0; return setTimeout(loop,180);} }
      setTimeout(loop, del?45:75);
    })();
  });

  document.querySelectorAll('[data-flip]').forEach(function(el){
    var words=(el.getAttribute('data-flip')||'').split('|').filter(Boolean); if(!words.length)return;
    var s=document.createElement('span'); s.textContent=words[0]; el.textContent=''; el.appendChild(s); var i=0;
    setInterval(function(){ s.style.opacity='0'; s.style.transform='rotateX(-90deg)';
      setTimeout(function(){ i=(i+1)%words.length; s.textContent=words[i]; s.style.transform='rotateX(90deg)';
        requestAnimationFrame(function(){ s.style.opacity='1'; s.style.transform='none'; }); },500);
    },2600);
  });

  document.querySelectorAll('[data-magnetic]').forEach(function(el){
    el.style.transition='transform .2s var(--ease,ease)';
    el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.25)+'px,'+((e.clientY-r.top-r.height/2)*.35)+'px)';});
    el.addEventListener('mouseleave',function(){el.style.transform='';});
  });

  document.querySelectorAll('[data-tilt]').forEach(function(el){
    el.style.transition='transform .2s var(--ease,ease)';el.style.transformStyle='preserve-3d';
    el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();var x=(e.clientX-r.left)/r.width-.5;var y=(e.clientY-r.top)/r.height-.5;el.style.transform='perspective(900px) rotateY('+(x*9)+'deg) rotateX('+(-y*9)+'deg)';});
    el.addEventListener('mouseleave',function(){el.style.transform='';});
  });

  document.querySelectorAll('[data-glow]').forEach(function(el){
    el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--gx',(e.clientX-r.left)+'px');el.style.setProperty('--gy',(e.clientY-r.top)+'px');});
  });

  document.querySelectorAll('[data-spotlight]').forEach(function(el){
    el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--spx',(e.clientX-r.left)+'px');el.style.setProperty('--spy',(e.clientY-r.top)+'px');});
  });

  document.querySelectorAll('[data-sparkles]').forEach(function(el){
    var c=document.createElement('canvas');c.style.cssText='position:absolute;inset:0;z-index:0;pointer-events:none';
    if(getComputedStyle(el).position==='static')el.style.position='relative';
    el.insertBefore(c,el.firstChild); Array.prototype.forEach.call(el.children,function(ch){if(ch!==c)ch.style.position=ch.style.position||'relative';});
    var ctx=c.getContext('2d'),ps=[],DPR=Math.min(2,window.devicePixelRatio||1);
    function size(){c.width=el.clientWidth*DPR;c.height=el.clientHeight*DPR;}
    function make(){return{x:Math.random()*c.width,y:Math.random()*c.height,r:(Math.random()*1.4+.3)*DPR,a:Math.random(),s:Math.random()*.02+.004};}
    for(var i=0;i<70;i++)ps.push(make()); size();window.addEventListener('resize',size);
    var col=getComputedStyle(el).getPropertyValue('--accent')||'#fff';
    (function draw(){ctx.clearRect(0,0,c.width,c.height);ps.forEach(function(p){p.a+=p.s;var o=(Math.sin(p.a)*.5+.5);ctx.globalAlpha=o*.8;ctx.fillStyle=col.trim()||'#fff';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();});ctx.globalAlpha=1;requestAnimationFrame(draw);})();
  });

  document.querySelectorAll('[data-nav-spotlight]').forEach(function(nav){
    var links=nav.querySelectorAll('a'); if(!links.length)return;
    var ind=document.createElement('div');ind.className='nav-ind';nav.appendChild(ind);
    function moveTo(el){if(!el)return;var nr=nav.getBoundingClientRect(),r=el.getBoundingClientRect();ind.style.left=(r.left-nr.left)+'px';ind.style.width=r.width+'px';}
    nav.addEventListener('mousemove',function(e){var r=nav.getBoundingClientRect();nav.style.setProperty('--nspx',(e.clientX-r.left)+'px');});
    links.forEach(function(a){a.addEventListener('mouseenter',function(){moveTo(a);});});
    nav.addEventListener('mouseleave',function(){nav.style.setProperty('--nspx','-999px');moveTo(nav.querySelector('a.active')||links[0]);});
    setTimeout(function(){moveTo(nav.querySelector('a.active')||links[0]);},80);
  });

  document.querySelectorAll('[data-dock]').forEach(function(dock){
    var items=Array.prototype.slice.call(dock.children);
    dock.addEventListener('mousemove',function(e){items.forEach(function(it){var r=it.getBoundingClientRect();var d=Math.abs(e.clientX-(r.left+r.width/2));var s=Math.max(1,1.55-d/150);it.style.transform='scale('+s.toFixed(3)+') translateY('+(-(s-1)*16).toFixed(1)+'px)';});});
    dock.addEventListener('mouseleave',function(){items.forEach(function(it){it.style.transform='';});});
  });

  document.querySelectorAll('[data-carousel]').forEach(function(car){
    var track=car.querySelector('.car-track'); if(!track)return;
    var slides=Array.prototype.slice.call(track.querySelectorAll('.car-slide')); if(!slides.length)return;
    var prev=document.createElement('button');prev.className='car-btn car-prev';prev.setAttribute('aria-label','Previous');prev.innerHTML='&#8249;';
    var next=document.createElement('button');next.className='car-btn car-next';next.setAttribute('aria-label','Next');next.innerHTML='&#8250;';
    var dots=document.createElement('div');dots.className='car-dots';
    car.appendChild(prev);car.appendChild(next);car.appendChild(dots);
    slides.forEach(function(s,i){var d=document.createElement('button');d.className='car-dot'+(i?'':' on');d.setAttribute('aria-label','Slide '+(i+1));d.addEventListener('click',function(){s.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});});dots.appendChild(d);});
    function step(dir){track.scrollBy({left:dir*(slides[0].offsetWidth+16),behavior:'smooth'});}
    prev.addEventListener('click',function(){step(-1);});next.addEventListener('click',function(){step(1);});
    track.addEventListener('scroll',function(){var c=track.scrollLeft+track.clientWidth/2,best=0,bd=1e9;
      slides.forEach(function(s,i){var d=Math.abs((s.offsetLeft+s.offsetWidth/2)-c);if(d<bd){bd=d;best=i;}});
      Array.prototype.forEach.call(dots.children,function(d,i){d.classList.toggle('on',i===best);});});
  });

  document.querySelectorAll('.fx-meteors').forEach(function(el){
    for(var i=0;i<14;i++){var m=document.createElement('span');m.className='meteor';m.style.left=(Math.random()*100)+'%';m.style.animationDelay=(Math.random()*8).toFixed(2)+'s';m.style.animationDuration=(4+Math.random()*6).toFixed(2)+'s';el.insertBefore(m,el.firstChild);}
  });

  document.querySelectorAll('[data-encrypt]').forEach(function(el){
    var box=document.createElement('div');box.className='enc';el.insertBefore(box,el.firstChild);
    var CH='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',n=0;
    function gen(){var s='';for(var i=0;i<900;i++)s+=CH.charAt(Math.floor(Math.random()*CH.length));return s;}
    box.textContent=gen();
    el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--ex',(e.clientX-r.left)+'px');el.style.setProperty('--ey',(e.clientY-r.top)+'px');if((n++%5)===0)box.textContent=gen();});
  });

  document.querySelectorAll('[data-stars]').forEach(function(el){
    var c=document.createElement('canvas');c.style.cssText='position:absolute;inset:0;z-index:0;pointer-events:none';
    if(getComputedStyle(el).position==='static')el.style.position='relative';
    el.insertBefore(c,el.firstChild);
    var ctx=c.getContext('2d'),DPR=Math.min(2,window.devicePixelRatio||1),st=[];
    var col=(getComputedStyle(el).getPropertyValue('--accent')||'').trim()||'#ffffff';
    function size(){c.width=Math.max(1,el.clientWidth*DPR);c.height=Math.max(1,el.clientHeight*DPR);}
    function init(){st=[];var n=Math.min(260,Math.floor(c.width*c.height/7000));for(var i=0;i<n;i++)st.push({x:Math.random()*c.width,y:Math.random()*c.height,r:(Math.random()*1.2+.25)*DPR,a:Math.random()*6.28,s:Math.random()*.03+.006,v:(Math.random()*.14+.03)*DPR});}
    size();init();window.addEventListener('resize',function(){size();init();});
    (function loop(){ctx.clearRect(0,0,c.width,c.height);
      st.forEach(function(p){p.a+=p.s;p.y+=p.v;if(p.y>c.height+2){p.y=-2;p.x=Math.random()*c.width;}
        ctx.globalAlpha=(Math.sin(p.a)*.5+.5)*.85;ctx.fillStyle=p.r>1.1*DPR?col:'#ffffff';
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();});
      ctx.globalAlpha=1;requestAnimationFrame(loop);})();
  });

  document.querySelectorAll('[data-clickspark]').forEach(function(el){
    var c=document.createElement('canvas');c.style.cssText='position:absolute;inset:0;z-index:3;pointer-events:none';
    if(getComputedStyle(el).position==='static')el.style.position='relative';
    el.appendChild(c);
    var ctx=c.getContext('2d'),DPR=Math.min(2,window.devicePixelRatio||1),sp=[];
    var col=(getComputedStyle(el).getPropertyValue('--accent')||'').trim()||'#ffffff';
    function size(){c.width=Math.max(1,el.clientWidth*DPR);c.height=Math.max(1,el.clientHeight*DPR);}
    size();window.addEventListener('resize',size);
    el.addEventListener('click',function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left)*DPR,y=(e.clientY-r.top)*DPR,now=performance.now();
      for(var i=0;i<8;i++)sp.push({x:x,y:y,a:6.28318*i/8,t0:now});});
    (function draw(now){ctx.clearRect(0,0,c.width,c.height);ctx.strokeStyle=col;ctx.lineWidth=2*DPR;
      sp=sp.filter(function(s){var e=now-s.t0;if(e>=420)return false;var p=e/420,k=p*(2-p);
        var d=k*18*DPR,L=10*DPR*(1-k);
        ctx.beginPath();ctx.moveTo(s.x+d*Math.cos(s.a),s.y+d*Math.sin(s.a));
        ctx.lineTo(s.x+(d+L)*Math.cos(s.a),s.y+(d+L)*Math.sin(s.a));ctx.stroke();return true;});
      requestAnimationFrame(draw);})(performance.now());
  });
})();

/* ── media tier ── */
(function(){
  var vids=document.querySelectorAll('[data-ms-video]');
  if(!vids.length)return;
  var conn=navigator.connection||{};
  var skip=(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        || conn.saveData===true || /2g/.test(conn.effectiveType||'') || window.innerWidth<=600;
  if(skip)return;
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      var v=e.target.querySelector('.ms-vid'); if(!v)return;
      if(e.isIntersecting){
        if(!v.src&&!v.dataset.wired){
          v.dataset.wired='1';
          v.src=v.getAttribute('data-mp4');
          var r=parseFloat(e.target.getAttribute('data-ms-rate'));
          if(r>0)v.playbackRate=r;
          v.addEventListener('canplay',function(){v.classList.add('ms-on');},{once:true});
          v.addEventListener('error',function(){v.remove();},{once:true});
        }
        var p=v.play(); if(p&&p.catch)p.catch(function(){});
      }else if(!v.paused){ v.pause(); }
    });
  },{rootMargin:'200px'});
  vids.forEach(function(el){io.observe(el);});
})();

/* ── scene layer (single source of truth for --p / --vp) ── */
(function(){
  var scenes=[].slice.call(document.querySelectorAll('[data-scene]'));
  if(!scenes.length)return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var live=[],raf=0;
  function clamp(v){return v<0?0:(v>1?1:v);}
  var EASE=0.14;
  function tick(){
    var vh=window.innerHeight||1,moving=false;
    for(var i=0;i<live.length;i++){
      var el=live[i];
      var pin=el.parentNode&&el.parentNode.className&&/\bscene-pin\b/.test(el.parentNode.className)?el.parentNode:null;
      var box=(pin||el).getBoundingClientRect();
      var p;
      if(pin){ var span=box.height-vh; p=span>0?clamp(-box.top/span):0; }
      else { p=clamp((vh-box.top)/(vh+box.height)); }
      var vp=clamp((vh-box.top)/(vh*0.85));
      if(el._p===undefined){el._p=p;el._vp=vp;}
      el._p+=(p-el._p)*EASE;
      el._vp+=(vp-el._vp)*EASE;
      if(Math.abs(p-el._p)>0.0005||Math.abs(vp-el._vp)>0.0005)moving=true;
      el.style.setProperty('--p',el._p.toFixed(4));
      el.style.setProperty('--vp',el._vp.toFixed(4));
    }
    raf=(live.length||moving)?requestAnimationFrame(tick):0;
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      var i=live.indexOf(e.target);
      if(e.isIntersecting){ if(i<0)live.push(e.target); }
      else if(i>=0){ live.splice(i,1); }
    });
    if(live.length&&!raf)raf=requestAnimationFrame(tick);
  },{rootMargin:'25% 0px 25% 0px'});
  scenes.forEach(function(el){io.observe(el);});
})();
