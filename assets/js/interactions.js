/* ==========================================================================
   FinAI — shared micro-interaction helpers
   Lightweight dropdown/select handling used across pages:
     - a trigger with [data-dropdown-trigger="ID"] toggles the menu #ID
     - .finai-option buttons update the trigger label, set the selected
       state and fire any handler registered via FinAI.onSelect(id, fn)
     - menus close on outside click or Esc
   ========================================================================== */
(function () {
  'use strict';

  var handlers = {};

  function allMenus() {
    return Array.prototype.slice.call(document.querySelectorAll('.finai-select-menu'));
  }

  function closeAll(exceptId) {
    allMenus().forEach(function (m) {
      if (m.id !== exceptId) { m.classList.remove('is-open'); }
    });
  }

  window.FinAI = window.FinAI || {};
  window.FinAI.onSelect = function (id, fn) { handlers[id] = fn; };

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !e.target.closest) { return; }

    if (e.target.closest('#finai-backdrop')) { closeAll(); return; }

    var trigger = t.closest('[data-dropdown-trigger]');
    if (trigger) {
      var id = trigger.getAttribute('data-dropdown-trigger');
      var menu = document.getElementById(id);
      closeAll(id);
      if (menu) { menu.classList.toggle('is-open'); }
      return;
    }

    var option = t.closest('.finai-option');
    if (option) {
      var menuEl = option.closest('.finai-select-menu');
      if (!menuEl) { return; }
      var menuId = menuEl.id;
      var labelEl = option.querySelector('.finai-option-label') || option;
      var label = labelEl.textContent.trim();
      var value = option.getAttribute('data-value') || '';
      var labelSpan = document.querySelector('[data-dropdown-label-of="' + menuId + '"]');
      if (labelSpan) { labelSpan.textContent = label; }
      Array.prototype.forEach.call(menuEl.querySelectorAll('.finai-option'), function (o) {
        o.classList.remove('is-selected');
      });
      option.classList.add('is-selected');
      menuEl.classList.remove('is-open');
      if (handlers[menuId]) { handlers[menuId](value, label); }
      return;
    }

    closeAll();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAll(); }
  });

  /* ---- Transaction row checkbox selection -----------------------------
     Any .tx-row input[type=checkbox] toggles the .is-selected class on
     its parent row, giving the same green highlight as the Ozon prototype. */
  document.addEventListener('change', function (e) {
    if (!e.target || !e.target.matches('.tx-row input[type="checkbox"]')) { return; }
    var row = e.target.closest('.tx-row');
    if (row) { row.classList.toggle('is-selected', e.target.checked); }
  });
})();