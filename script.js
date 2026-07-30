document.addEventListener("DOMContentLoaded", function() {
  // Mobile navigation
  var burger = document.querySelector('[data-burger]');
  var nav = document.querySelector('[data-nav]');
  if(burger && nav) {
    burger.addEventListener('click', function() {
      nav.classList.toggle('open');
    });
  }

  // 3D Grid Zoom Scroll logic
  var scenePin = document.querySelector('.scene-pin');
  var gridContainer = document.querySelector('.grid-container');
  if(scenePin && gridContainer) {
    var pinHeight = parseFloat(scenePin.getAttribute('style').match(/--pin:\s*([\d.]+)/)?.[1] || 2);
    
    // Set heights for scrolling
    scenePin.style.height = (pinHeight * 100) + 'vh';
    
    function handleScroll() {
      var rect = scenePin.getBoundingClientRect();
      var containerHeight = scenePin.clientHeight;
      var scrolled = -rect.top;
      var totalScroll = containerHeight - window.innerHeight;
      
      var progress = Math.max(0, Math.min(1, scrolled / totalScroll));
      
      // Calculate depth scale & Z transform
      // Start zoomed into Cell 5 (z = 400px), then zoom out completely to see the surrounding grid
      var scale = 1 + (progress * 1.5);
      var zDepth = Math.max(0, 420 - (progress * 420));
      var scaleOuter = 0.33 + (progress * 0.67);
      
      // Apply transforms
      gridContainer.style.transform = 'translate3d(-50%, -50%, ' + (-zDepth) + 'px) scale(' + scaleOuter + ')';
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Tilt Effect (data-tilt)
  document.querySelectorAll('[data-tilt]').forEach(function(el) {
    el.addEventListener('mousemove', function(e) {
      var r = el.getBoundingClientRect();
      var x = e.clientX - r.left - (r.width/2);
      var y = e.clientY - r.top - (r.height/2);
      var rx = -(y / r.height) * 16;
      var ry = (x / r.width) * 16;
      el.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale3d(1.02, 1.02, 1.02)';
    });
    el.addEventListener('mouseleave', function() {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // data-glow effect
  document.querySelectorAll('[data-glow]').forEach(function(el) {
    el.addEventListener('mousemove', function(e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      el.style.setProperty('--x', x + 'px');
      el.style.setProperty('--y', y + 'px');
    });
  });

  // data-magnetic button
  document.querySelectorAll('[data-magnetic]').forEach(function(el) {
    el.addEventListener('mousemove', function(e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - (rect.width/2);
      var y = e.clientY - rect.top - (rect.height/2);
      el.style.transform = 'translate3d(' + (x * 0.35) + 'px, ' + (y * 0.35) + 'px, 0)';
    });
    el.addEventListener('mouseleave', function() {
      el.style.transform = 'translate3d(0, 0, 0)';
    });
  });

  // text flip rotation (data-flip)
  document.querySelectorAll('[data-flip]').forEach(function(el) {
    var words = el.getAttribute('data-flip').split('|');
    var idx = 0;
    setInterval(function() {
      el.style.opacity = 0;
      setTimeout(function() {
        idx = (idx + 1) % words.length;
        el.textContent = words[idx];
        el.style.opacity = 1;
      }, 300);
    }, 2400);
  });

  // Video backgrounds auto play on enter viewport
  document.querySelectorAll('[data-ms-video]').forEach(function(el) {
    var v = el.querySelector('video');
    if(!v) return;
    var mp4 = v.getAttribute('data-mp4');
    
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if(entry.isIntersecting) {
          if(!v.src && mp4) {
            v.src = mp4;
            v.load();
          }
          v.play().catch(function(){});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
  });

  // Countdown timer
  var cd = document.querySelector('[data-countdown]');
  if(cd) {
    var target = new Date(cd.getAttribute('data-countdown')).getTime();
    var daysE = cd.querySelector('[data-cd="days"]');
    var hoursE = cd.querySelector('[data-cd="hours"]');
    var minsE = cd.querySelector('[data-cd="mins"]');
    var secsE = cd.querySelector('[data-cd="secs"]');
    
    function update() {
      var now = Date.now();
      var diff = target - now;
      if(diff < 0) diff = 0;
      
      var d = Math.floor(diff / (1000 * 60 * 60 * 24));
      var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var s = Math.floor((diff % (1000 * 60)) / 1000);
      
      if(daysE) daysE.textContent = d < 10 ? '0' + d : d;
      if(hoursE) hoursE.textContent = h < 10 ? '0' + h : h;
      if(minsE) minsE.textContent = m < 10 ? '0' + m : m;
      if(secsE) secsE.textContent = s < 10 ? '0' + s : s;
    }
    setInterval(update, 1000);
    update();
  }

  // fx:data-lightfall canvas particle effect
  document.querySelectorAll('[data-lightfall]').forEach(function(el) {
    var c = document.createElement('canvas');
    c.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;';
    if(getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.insertBefore(c, el.firstChild);
    var ctx = c.getContext('2d'), DPR = Math.min(2, window.devicePixelRatio || 1), lines = [];
    var col = '#ff6a3d';
    
    function size() {
      c.width = Math.max(1, el.clientWidth * DPR);
      c.height = Math.max(1, el.clientHeight * DPR);
    }
    function init() {
      lines = [];
      var n = Math.min(30, Math.floor(c.width / 40));
      for(var i=0; i<n; i++) lines.push(make());
    }
    function make() {
      return {
        x: Math.random() * c.width,
        y: Math.random() * c.height - c.height,
        len: Math.random() * 140 + 50,
        w: Math.random() * 1.5 + 0.5,
        v: Math.random() * 3.5 + 1.5
      };
    }
    size(); init();
    window.addEventListener('resize', function(){ size(); init(); });
    
    (function loop(){
      ctx.clearRect(0,0,c.width,c.height);
      lines.forEach(function(l) {
        l.y += l.v;
        if(l.y > c.height) {
          l.y = -l.len;
          l.x = Math.random() * c.width;
        }
        var g = ctx.createLinearGradient(l.x, l.y, l.x, l.y+l.len);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(0.5, col);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = l.w * DPR;
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x, l.y + l.len);
        ctx.stroke();
      });
      requestAnimationFrame(loop);
    })();
  });
});
