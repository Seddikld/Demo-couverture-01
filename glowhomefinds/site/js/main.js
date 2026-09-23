/* GlowHomeFinds — small progressive enhancements. The site works fully without JavaScript. */
(function () {
  var cfg = window.SITE_CONFIG || {};

  // Keep every product link in sync with config.js (links are also baked in at build time).
  if (cfg.AFFILIATE_LINK) {
    document.querySelectorAll('a[data-affiliate]').forEach(function (a) {
      a.href = cfg.AFFILIATE_LINK;
    });
  }

  // Show the sticky mobile call-to-action once the main hero button has scrolled out of view.
  var bar = document.querySelector('.sticky-cta');
  var heroCta = document.querySelector('[data-hero-cta]');
  if (bar && heroCta && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      bar.classList.toggle('is-visible', !e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe(heroCta);
  }

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
