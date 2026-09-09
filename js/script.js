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
})();
