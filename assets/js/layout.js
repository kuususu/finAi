/* ==========================================================================
   FinAI — shared layout component
   Injects the canonical Sidebar and TopDashboard (statement banner) from the
   Categories page into every page, resolves the active navigation state from
   <body data-page="…"> and wires all page-to-page navigation.
   Usage: <body data-page="categories"> … <div id="page-content"> … </div>
          <script src="assets/js/layout.js"></script>
   ========================================================================== */
(function () {
  'use strict';

  var PAGES = {
    overview: 'reviewFin.html',
    transactions: 'transactionsFin.html',
    categories: 'categoriesFin.html',
    subscriptions: 'subscriptionsFin.html',
    insights: 'insightsFin.html',
    import: 'importFin.html'
  };

  var MAIN_NAV = [
    { id: 'overview', icon: 'dashboard', label: 'Обзор' },
    { id: 'transactions', icon: 'receipt_long', label: 'Транзакции' },
    { id: 'categories', icon: 'pie_chart', label: 'Категории' },
    { id: 'subscriptions', icon: 'event_repeat', label: 'Подписки' },
    { id: 'insights', icon: 'lightbulb', label: 'Инсайты' },
    { id: 'import', icon: 'upload_file', label: 'Импорт' }
  ];

  var page = document.body.getAttribute('data-page') || '';
  var content = document.getElementById('page-content');
  if (!content) { return; }

  function elementFromString(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  /* ---- Sidebar (canonical Categories implementation) --------------------- */

  function navLink(item) {
    var isActive = item.id === page;
    var classes = 'flex items-center gap-space-sm px-space-md py-space-sm rounded-xl font-title-sm text-title-sm ' +
      (isActive
        ? 'bg-primary text-on-primary font-semibold shadow-sm transition-all'
        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors');
    var iconClass = 'material-symbols-outlined text-[22px]' + (isActive ? ' text-on-primary' : '');
    var href = PAGES[item.id] || '#';
    return '<a ' + (isActive ? 'aria-current="page" ' : '') +
      'class="' + classes + '" data-path="' + item.id + '" href="' + href + '">' +
      '<span class="' + iconClass + '">' + item.icon + '</span>' +
      '<span>' + item.label + '</span></a>';
  }

  function buildSidebar() {
    return elementFromString(
      '<aside id="finai-sidebar" aria-label="Основная навигация FinAI" class="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest z-50 flex flex-col justify-between border-r border-surface-container-high/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">' +
        '<div class="flex flex-col">' +
          '<div class="h-16 px-space-lg flex items-center gap-space-sm border-b border-surface-container-low">' +
            '<div class="w-9 h-9 rounded-xl bg-[#00a551] flex items-center justify-center text-white shadow-sm shrink-0">' +
              '<span class="material-symbols-outlined text-[22px]">finance</span>' +
            '</div>' +
            '<span class="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">FinAI</span>' +
          '</div>' +
          '<nav class="flex flex-col gap-space-2xs px-space-sm pt-space-md">' +
            MAIN_NAV.map(navLink).join('') +
          '</nav>' +
        '</div>' +
      '</aside>'
    );
  }

  /* ---- TopDashboard (canonical Categories statement banner) -------------- */

  function buildTopDashboard() {
    return elementFromString(
      '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest border border-surface-container-high/80 rounded-xl px-space-md py-2.5 mb-space-lg shadow-sm">' +
        '<div class="flex flex-wrap items-center gap-space-xs text-body-sm text-on-surface-variant">' +
          '<button id="sidebar-toggle" type="button" aria-label="Открыть меню" aria-controls="finai-sidebar" class="lg:hidden -ml-1 mr-1 inline-flex items-center justify-center w-9 h-9 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors shrink-0">' +
            '<span class="material-symbols-outlined text-[20px]">menu</span>' +
          '</button>' +
          '<span class="relative flex h-2 w-2">' +
            '<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>' +
            '<span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>' +
          '</span>' +
          '<span class="font-semibold text-on-surface">Выписка активна</span>' +
          '<span class="text-outline-variant">•</span>' +
          '<span>СберБанк (01.09 – 30.09.2026)</span>' +
          '<span class="text-outline-variant">•</span>' +
          '<span class="font-tabular-num">1 248 операций обработано</span>' +
          '<span class="inline-flex items-center gap-1 font-label-caps text-label-caps font-semibold text-primary bg-secondary-container/50 px-2 py-0.5 rounded-full ml-1">' +
            '<span class="material-symbols-outlined text-[14px]">check_circle</span>Анализ завершён' +
          '</span>' +
        '</div>' +
        '<div class="flex items-center gap-space-sm shrink-0">' +
          '<div class="finai-select flex items-center bg-surface-container-high p-1 rounded-xl">' +
            '<button class="px-space-md py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-title-sm text-title-sm shadow-sm transition-all flex items-center gap-1" type="button" data-dropdown-trigger="topMonthMenu">' +
              '<span class="material-symbols-outlined text-[18px] text-on-surface-variant">calendar_today</span>' +
              '<span class="data-dropdown-label" data-dropdown-label-of="topMonthMenu">Сентябрь 2026</span>' +
              '<span class="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_drop_down</span>' +
            '</button>' +
            '<div class="finai-select-menu" id="topMonthMenu">' +
              '<button class="finai-option is-selected" type="button" data-value="2026-09"><span class="finai-option-label">Сентябрь 2026</span></button>' +
              '<button class="finai-option" type="button" data-value="2026-08"><span class="finai-option-label">Август 2026</span></button>' +
              '<button class="finai-option" type="button" data-value="2026-07"><span class="finai-option-label">Июль 2026</span></button>' +
              '<button class="finai-option" type="button" data-value="2026-06"><span class="finai-option-label">Июнь 2026</span></button>' +
            '</div>' +
          '</div>' +
          '<button class="btn btn-secondary" type="button" data-navigate="import">' +
            '<span class="material-symbols-outlined text-[18px] text-primary">add_circle</span>' +
            '<span>Добавить выписку</span>' +
          '</button>' +
        '</div>' +
      '</div>'
    );
  }

  /* ---- Assemble shared layout -------------------------------------------- */

  var sidebar = buildSidebar();
  var backdrop = elementFromString('<div id="finai-backdrop" aria-hidden="true"></div>');
  var shell = elementFromString(
    '<div id="layout-shell" class="pl-64">' +
      '<main id="layout-main" class="relative bg-background min-h-screen px-space-xl py-space-lg max-w-max-content-width mx-auto"></main>' +
    '</div>'
  );

  var main = shell.querySelector('#layout-main');
  main.appendChild(buildTopDashboard());
  main.appendChild(content);

  document.body.insertBefore(sidebar, document.body.firstChild);
  document.body.appendChild(backdrop);
  document.body.appendChild(shell);

  /* ---- Reveal page after layout is fully assembled ----------------------
     The inline <style> in <head> keeps html at opacity:0. Once the sidebar
     + top dashboard are injected and in the DOM, add .layout-ready so the
     page fades in cleanly. The double-rAF guarantees styles are computed
     before reveal, preventing any FOUC / sidebar flash / layout jump. */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.documentElement.classList.add('layout-ready');
    });
  });
  /* Safety fallback: if rAF doesn't fire, reveal after 800ms max. */
  setTimeout(function () {
    document.documentElement.classList.add('layout-ready');
  }, 800);

  /* ---- Mobile drawer ------------------------------------------------------ */

  function openSidebar() { document.body.classList.add('sidebar-open'); }
  function closeSidebar() { document.body.classList.remove('sidebar-open'); }

  /* ---- Navigation --------------------------------------------------------- */

  function go(id) {
    if (PAGES[id]) { window.location.href = PAGES[id]; }
  }

  document.addEventListener('click', function (e) {
    if (!e.target || !e.target.closest) { return; }

    var toggle = e.target.closest('#sidebar-toggle');
    if (toggle) {
      if (document.body.classList.contains('sidebar-open')) { closeSidebar(); } else { openSidebar(); }
      return;
    }

    if (e.target.closest('#finai-backdrop')) { closeSidebar(); return; }

    var link = e.target.closest('a[data-path]');
    if (link) {
      e.preventDefault();
      closeSidebar();
      go(link.getAttribute('data-path'));
      return;
    }

    var navButton = e.target.closest('[data-navigate]');
    if (navButton) {
      e.preventDefault();
      closeSidebar();
      go(navButton.getAttribute('data-navigate'));
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeSidebar(); }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024) { closeSidebar(); }
  });

})();
