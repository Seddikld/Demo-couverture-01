/* ===========================================================
   Toiture Prestige 33 — Script principal
   Menu mobile, header au scroll, animations, formulaire
   =========================================================== */
(function () {
  "use strict";

  /* ---------- Header : effet au scroll ---------- */
  var header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");
  var navOverlay = document.getElementById("nav-overlay");

  function openNav() {
    mainNav.classList.add("open");
    navOverlay.classList.add("active");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Fermer le menu");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    mainNav.classList.remove("open");
    navOverlay.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Ouvrir le menu");
    document.body.style.overflow = "";
  }
  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.contains("open");
    if (isOpen) { closeNav(); } else { openNav(); }
  });
  navOverlay.addEventListener("click", closeNav);
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* ---------- Animations au scroll (reveal) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Année dynamique dans le footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---------- Formulaire de devis ---------- */
  var form = document.getElementById("devis-form");
  var feedback = document.getElementById("form-feedback");

  if (form) {
    form.addEventListener("submit", function (e) {
      // Validation native HTML5 déjà en place (required, type=email, etc.)
      if (!form.checkValidity()) {
        return; // le navigateur affiche les messages natifs
      }

      // Sur Netlify, ce formulaire est intercepté et envoyé automatiquement
      // grâce à data-netlify="true" (voir index.html). Le code ci-dessous
      // sert uniquement à afficher un message de confirmation convivial
      // lorsque le site tourne en local (hors Netlify), où l'envoi réel
      // n'est pas disponible.
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:") {
        e.preventDefault();
        feedback.textContent = "Aperçu local : le formulaire sera fonctionnel une fois déployé sur Netlify.";
        feedback.className = "form-note success";
        form.reset();
      }
      // En production sur Netlify, on laisse la soumission suivre son cours normal.
    });
  }
})();
