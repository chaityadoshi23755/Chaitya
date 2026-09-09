(function () {
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var panel = document.getElementById('navPanel');
  var backdrop = document.getElementById('navBackdrop');

  function isOpen() {
    return document.body.classList.contains('nav-open');
  }

  function openMenu() {
    document.body.classList.add('nav-open');
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    var firstLink = panel.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu(returnFocus) {
    document.body.classList.remove('nav-open');
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  }

  if (toggle && nav && panel) {
    toggle.addEventListener('click', function () {
      if (isOpen()) {
        closeMenu(false);
      } else {
        openMenu();
      }
    });

    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu(false);
      });
    });

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        closeMenu(false);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        closeMenu(true);
      }
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    document.querySelectorAll('.hero, .pagehead').forEach(function (zone) {
      var glow = zone.querySelector('.hero__glow');
      if (!glow) return;
      zone.addEventListener('mousemove', function (e) {
        var rect = zone.getBoundingClientRect();
        var mx = ((e.clientX - rect.left) / rect.width) * 100;
        var my = ((e.clientY - rect.top) / rect.height) * 100;
        zone.style.setProperty('--mx', mx + '%');
        zone.style.setProperty('--my', my + '%');
        glow.classList.add('is-active');
      });
      zone.addEventListener('mouseleave', function () {
        glow.classList.remove('is-active');
      });
    });
  }

  // ---- hand-rolled localized particle burst (no external library) ----
  function burst(x, y, colors) {
    if (prefersReducedMotion) return;
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:999;';
    var dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    var particles = [];
    for (var i = 0; i < 26; i++) {
      var angle = Math.PI + Math.random() * Math.PI;
      var speed = 2.5 + Math.random() * 3.5;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? -1 : 1),
        vy: Math.sin(angle) * speed - 1,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.3,
        size: 3 + Math.random() * 3,
        color: colors[i % colors.length],
        life: 1
      });
    }
    var start = performance.now();
    function frame(t) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      var alive = false;
      particles.forEach(function (p) {
        if (p.life <= 0) return;
        alive = true;
        p.vy += 0.12; p.x += p.vx; p.y += p.vy; p.rot += p.vrot; p.life -= 0.016;
        ctx.save();
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      if (alive && t - start < 1600) {
        requestAnimationFrame(frame);
      } else {
        canvas.remove();
      }
    }
    requestAnimationFrame(frame);
  }

  // ---- copy-email buttons: burst + clipboard + "Copied" feedback ----
  document.querySelectorAll('[data-copy-email]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var rect = btn.getBoundingClientRect();
      burst(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#B23A2E', '#E8A33D', '#EEF1F4']);
      try {
        var writeResult = navigator.clipboard && navigator.clipboard.writeText('chaityadoshi23755@gmail.com');
        if (writeResult && writeResult.catch) writeResult.catch(function () {});
      } catch (e) {}
      var original = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(function () { btn.textContent = original; }, 1400);
    });
  });

  // ---- ink-stamp press flash on primary buttons and status stamps ----
  document.querySelectorAll('.btn--stamp, .stamp').forEach(function (el) {
    el.addEventListener('click', function () {
      if (prefersReducedMotion) return;
      el.classList.remove('is-firing');
      void el.offsetWidth;
      el.classList.add('is-firing');
    });
  });

  // ---- landing highlight for cross-page "used in" jumps ----
  if (location.hash) {
    var jumpTarget = document.getElementById(location.hash.slice(1));
    if (jumpTarget) {
      jumpTarget.classList.add('is-found');
    }
  }

  // ---- skill chip tooltip + cross-page jump ----
  var chips = document.querySelectorAll('.chip[data-jump]');
  if (chips.length) {
    var tip = document.createElement('div');
    tip.className = 'trace-tip';
    tip.innerHTML = '<span class="trace-tip__label">Used in</span><span class="trace-tip__text"></span>';
    document.body.appendChild(tip);
    var tipText = tip.querySelector('.trace-tip__text');

    function showTip(chip) {
      var rect = chip.getBoundingClientRect();
      tipText.textContent = chip.getAttribute('data-jump-label') || '';
      tip.style.left = (rect.left + rect.width / 2) + 'px';
      tip.style.top = (rect.top - 10) + 'px';
      tip.classList.add('is-visible');
    }
    function hideTip() { tip.classList.remove('is-visible'); }

    chips.forEach(function (chip) {
      chip.addEventListener('mouseenter', function () { showTip(chip); });
      chip.addEventListener('focus', function () { showTip(chip); });
      chip.addEventListener('mouseleave', hideTip);
      chip.addEventListener('blur', hideTip);
      chip.addEventListener('click', function () {
        window.location.href = chip.getAttribute('data-jump');
      });
    });
  }

  // ---- client intake form: submit via fetch, inline success/error ----
  var clientForm = document.getElementById('client-form-el');
  if (clientForm) {
    clientForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var statusEl = document.getElementById('formStatus');
      var submitBtn = clientForm.querySelector('button[type="submit"]');
      statusEl.className = 'form-status';
      submitBtn.disabled = true;
      var originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';

      fetch(clientForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(clientForm)
      }).then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          if (result.ok) {
            clientForm.hidden = true;
            statusEl.textContent = "Got it — I'll reply within a day.";
            statusEl.className = 'form-status form-status--success is-visible';
          } else {
            throw new Error('submit failed');
          }
        })
        .catch(function () {
          statusEl.textContent = "Something went wrong sending that. Please email me directly instead — chaityadoshi23755@gmail.com.";
          statusEl.className = 'form-status form-status--error is-visible';
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });
  }
})();
