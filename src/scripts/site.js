/**
 * Accelity Partners — client script.
 *
 * Everything here is progressive enhancement. With JavaScript unavailable the
 * pages are complete and readable; the mobile navigation falls back to the
 * links already present in the footer, and no content is hidden behind script.
 */
(function () {
  'use strict';

  /* --- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector('[data-nav-toggle]');
  var panel = document.querySelector('[data-mobile-nav]');

  if (toggle && panel) {
    var lastFocus = null;
    var trapHandler = null;
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      panel.setAttribute('data-open', String(open));
      if (open) {
        lastFocus = document.activeElement;
        // focus first focusable element inside the panel
        var first = panel.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');
        if (first) first.focus();
        // trap Tab within the panel
        trapHandler = function (ev) {
          if (ev.key !== 'Tab') return;
          var focusables = Array.from(panel.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')).filter(function (n) { return !n.disabled; });
          if (!focusables.length) return;
          var firstEl = focusables[0];
          var lastEl = focusables[focusables.length - 1];
          if (ev.shiftKey && document.activeElement === firstEl) { ev.preventDefault(); lastEl.focus(); }
          else if (!ev.shiftKey && document.activeElement === lastEl) { ev.preventDefault(); firstEl.focus(); }
        };
        document.addEventListener('keydown', trapHandler);
      } else {
        if (trapHandler) { document.removeEventListener('keydown', trapHandler); trapHandler = null; }
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
        lastFocus = null;
      }
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
      }
    });

    // Close when the viewport reaches the desktop layout, so the button and the
    // panel never disagree about state.
    var desktop = window.matchMedia('(min-width: 60rem)');
    var onChange = function (event) { if (event.matches) setOpen(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* --- Header rule on scroll -------------------------------------------- */
  var header = document.querySelector('[data-site-header]');
  if (header && 'IntersectionObserver' in window) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;height:1px;width:1px;';
    document.body.prepend(sentinel);

    new IntersectionObserver(function (entries) {
      header.setAttribute('data-scrolled', String(!entries[0].isIntersecting));
    }).observe(sentinel);
  }

  /* --- Role grid interactions (Build / Own / Partner / Enable) ---------- */
  var roleGrid = document.querySelector('.role-grid');
  if (roleGrid) {
    var cards = Array.from(roleGrid.querySelectorAll('.role-card'));

    function clearActive() {
      cards.forEach(function (c) { c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
    }

    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () { clearActive(); card.classList.add('active'); });
      card.addEventListener('mouseleave', function () { card.classList.remove('active'); });
      card.addEventListener('focus', function () { clearActive(); card.classList.add('active'); });
      card.addEventListener('blur', function () { card.classList.remove('active'); });

      card.addEventListener('click', function (e) {
        // Toggle persistent selection on click
        var pressed = card.getAttribute('aria-pressed') === 'true';
        if (pressed) { card.setAttribute('aria-pressed', 'false'); card.classList.remove('active'); }
        else { clearActive(); card.setAttribute('aria-pressed', 'true'); card.classList.add('active'); }
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); card.click();
        } else if (e.key === 'Escape') {
          e.preventDefault(); clearActive();
        }
      });
    });
  }
}());
