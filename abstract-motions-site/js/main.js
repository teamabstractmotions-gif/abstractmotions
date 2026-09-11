// Abstract Motions — shared interactions
// Nav toggle, single hero entrance sequence, restrained scroll-reveal, footer year.

(function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.site-nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Hero: one orchestrated entrance (aperture open + focus-rise), triggers once.
  var hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(function () {
      setTimeout(function () { hero.classList.add('is-open'); }, 40);
    });
  }

  // Timecode readout — elapsed time on page, real editing-suite style HH:MM:SS:FF (24fps).
  var tc = document.querySelector('[data-timecode]');
  if (tc) {
    var start = performance.now();
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function pad(n, w) { w = w || 2; n = String(n); while (n.length < w) n = '0' + n; return n; }
    function tick() {
      var elapsed = performance.now() - start;
      var totalFrames = Math.floor(elapsed / (1000 / 24));
      var ff = totalFrames % 24;
      var totalSeconds = Math.floor(totalFrames / 24);
      var ss = totalSeconds % 60;
      var mm = Math.floor(totalSeconds / 60) % 60;
      var hh = Math.floor(totalSeconds / 3600);
      tc.textContent = pad(hh) + ':' + pad(mm) + ':' + pad(ss) + ':' + pad(ff);
      if (!reduced) requestAnimationFrame(tick);
    }
    tick();
  }

  // Restrained scroll reveal — section-level only, respects reduced motion.
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
