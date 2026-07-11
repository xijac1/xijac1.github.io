(function () {
  let scrollHandler = null;
  let clickHandler = null;

  function getRoot() {
    return document.querySelector('[data-hd-showcase]');
  }

  function getSectionIds(root) {
    const fromTabs = Array.from(root.querySelectorAll('[data-hd-section]'))
      .map((tab) => tab.getAttribute('data-hd-section'))
      .filter(Boolean);

    if (fromTabs.length) {
      return fromTabs;
    }

    return Array.from(root.querySelectorAll('.hd-section[id]'))
      .map((section) => section.id)
      .filter(Boolean);
  }

  function setActiveTab(root, sectionId) {
    root.querySelectorAll('.hd-tab').forEach((tab) => {
      const id = tab.getAttribute('data-hd-section') || '';
      tab.classList.toggle('active', id === sectionId);
    });
  }

  function onScroll(root) {
    const sectionIds = getSectionIds(root);
    if (!sectionIds.length) {
      return;
    }

    let current = sectionIds[0];
    sectionIds.forEach((id) => {
      const el = root.querySelector('#' + CSS.escape(id));
      if (el && window.scrollY >= el.offsetTop - 140) {
        current = id;
      }
    });
    setActiveTab(root, current);
  }

  function scrollToSection(root, sectionId) {
    const el = root.querySelector('#' + CSS.escape(sectionId));
    if (!el) {
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, left: 0, behavior: 'smooth' });
    setActiveTab(root, sectionId);
  }

  function onRootClick(event) {
    const root = getRoot();

    const tab = event.target.closest('[data-hd-section]');
    if (tab && root && root.contains(tab)) {
      event.preventDefault();
      const sectionId = tab.getAttribute('data-hd-section');
      if (sectionId) {
        scrollToSection(root, sectionId);
      }
      return;
    }

    const copyBtn = event.target.closest('[data-hd-copy]');
    if (!copyBtn || !root || !root.contains(copyBtn)) {
      return;
    }

    const targetId = copyBtn.getAttribute('data-hd-copy-target');
    const codeEl = targetId ? document.getElementById(targetId) : null;
    if (!codeEl) {
      return;
    }

    const text = codeEl.innerText || codeEl.textContent || '';
    const markCopied = () => {
      const original = copyBtn.textContent;
      copyBtn.textContent = 'copied';
      window.setTimeout(() => {
        copyBtn.textContent = original || 'copy';
      }, 1200);
    };

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(markCopied).catch(() => {
        /* ignore clipboard failures */
      });
    }
  }

  function destroy() {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler);
      scrollHandler = null;
    }
    if (clickHandler) {
      document.removeEventListener('click', clickHandler);
      clickHandler = null;
    }
  }

  function init() {
    destroy();

    const root = getRoot();
    if (!root) {
      return;
    }

    scrollHandler = () => onScroll(root);
    clickHandler = onRootClick;

    window.addEventListener('scroll', scrollHandler, { passive: true });
    document.addEventListener('click', clickHandler);
    onScroll(root);
  }

  window.projectShowcase = {
    init,
    destroy,
  };

  // Back-compat alias for older references
  window.heartDiseaseShowcase = window.projectShowcase;
})();
