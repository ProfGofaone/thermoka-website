// Thermoka Green Energy — site behaviours
// Header on scroll, mobile menu, live South African clock,
// count-up numbers and scroll animations.

document.documentElement.classList.add('js');

(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: solid once you scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var closeBtn = document.querySelector('.nav-close');

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open && closeBtn) closeBtn.focus();
    if (!open) toggle.focus();
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(true); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false);
    });
  }

  /* ---------- One-page menu: highlight the section you're in ---------- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    spyLinks.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute('href').slice(1));
      if (sec) byId[sec.id] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        spyLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
        var link = byId[e.target.id];
        if (link) link.setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  /* ---------- Live South African clock and date ---------- */
  var tz = 'Africa/Johannesburg';
  var timeFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  var dateFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
  });
  var timeEls = document.querySelectorAll('[data-clock="time"]');
  var dateEls = document.querySelectorAll('[data-clock="date"]');
  var bigEls = document.querySelectorAll('[data-clock="big"]');

  // Big clock: every digit in a fixed-width box so it doesn't jitter
  function digits(str) {
    return str.split('').map(function (ch) {
      return ch === ':' ? '<span class="c">:</span>' : '<span class="d">' + ch + '</span>';
    }).join('');
  }

  function tick() {
    var now = new Date();
    var t = timeFmt.format(now);
    var d = dateFmt.format(now).replace(/,/g, '');
    timeEls.forEach(function (el) { el.textContent = t; });
    dateEls.forEach(function (el) { el.textContent = d; });
    if (bigEls.length) {
      var parts = t.split(':');
      var html = digits(parts[0] + ':' + parts[1]) + '<span class="sec">' + digits(parts[2]) + '</span>';
      bigEls.forEach(function (el) { el.innerHTML = html; el.setAttribute('aria-label', t + ' South African time'); });
    }
  }
  if (timeEls.length || dateEls.length || bigEls.length) {
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Count-up numbers ---------- */
  function formatNumber(n) {
    // South African style: spaces between thousands (260 000)
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var duration = 1800;
    if (reduceMotion) { el.textContent = formatNumber(target); return; }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatNumber(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  /* ---------- Scroll animations ---------- */
  var watched = document.querySelectorAll('.reveal, .panel, [data-count]');

  if (!('IntersectionObserver' in window)) {
    watched.forEach(function (el) {
      el.classList.add('in-view');
      if (el.hasAttribute('data-count')) el.textContent = formatNumber(parseFloat(el.getAttribute('data-count')));
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add('in-view');
      if (el.hasAttribute('data-count') && !el.dataset.counted) {
        el.dataset.counted = '1';
        countUp(el);
      }
      observer.unobserve(el);
    });
  }, { threshold: 0.2 });

  watched.forEach(function (el) { observer.observe(el); });
})();
