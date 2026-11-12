/* Keep every word of a heading on one line.
   The GSAP SplitText animation splits headings into single letters, so a word wider than its box
   (e.g. "CRANBERRY" in a narrow column) wraps letter by letter onto the next line.
   This shrinks a heading's font size ONLY when its longest word does not fit; headings that already fit
   are left exactly as they are. */
(function () {
  var SELECTOR = 'h1, h2, h3, [data-ix-reveal="chars"], [data-ix-reveal="words"], [data-ix-reveal="lines"]';

  function fit(el) {
    if (el.hasAttribute('data-fit-title')) {         // undo only our own earlier shrink
      el.style.removeProperty('font-size');
      el.removeAttribute('data-fit-title');
    }
    var text = (el.textContent || '').trim();
    if (!text) return;
    var cs = getComputedStyle(el);
    var avail = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (!(avail > 0)) return;                       // hidden (closed menu etc.) - nothing to do
    var probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;' +
      'font:inherit;letter-spacing:inherit;text-transform:inherit;word-spacing:inherit;';
    el.appendChild(probe);
    var widest = 0;
    text.split(/\s+/).forEach(function (word) {
      probe.textContent = word;
      widest = Math.max(widest, probe.getBoundingClientRect().width);
    });
    el.removeChild(probe);
    if (widest > avail) {
      var size = parseFloat(cs.fontSize) * (avail / widest) * 0.97;
      el.style.setProperty('font-size', size + 'px', 'important');
      el.setAttribute('data-fit-title', '');
    }
  }

  function fitAll() {
    document.querySelectorAll(SELECTOR).forEach(fit);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fitAll);
  else fitAll();
  window.addEventListener('load', fitAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);

  var lastW = window.innerWidth, t;
  window.addEventListener('resize', function () {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    clearTimeout(t);
    t = setTimeout(fitAll, 150);
  });
})();
