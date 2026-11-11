(function () {
  var dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));

  function closeDropdown(d) {
    var m = d.querySelector('.nav-dropdown-menu');
    var b = d.querySelector('.nav-dropdown-btn');
    if (m) m.classList.remove('open');
    if (b) b.setAttribute('aria-expanded', 'false');
  }

  function closeAllExcept(keep) {
    dropdowns.forEach(function (d) { if (d !== keep) closeDropdown(d); });
  }

  dropdowns.forEach(function (dropdown) {
    var btn  = dropdown.querySelector('.nav-dropdown-btn');
    var menu = dropdown.querySelector('.nav-dropdown-menu');
    if (!btn || !menu) return;
    var items = Array.from(menu.querySelectorAll('a[role="menuitem"]'));

    function open()   { menu.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    function close()  { closeDropdown(dropdown); }
    function isOpen() { return menu.classList.contains('open'); }

    btn.addEventListener('click', function () {
      if (isOpen()) { close(); } else { closeAllExcept(dropdown); open(); }
    });

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isOpen() ? close() : open(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); closeAllExcept(dropdown); open(); if (items[0]) items[0].focus(); }
      if (e.key === 'Escape') { close(); }
    });

    menu.addEventListener('keydown', function (e) {
      var idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); if (idx < items.length - 1) items[idx + 1].focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); if (idx === 0) { close(); btn.focus(); } else items[idx - 1].focus(); }
      if (e.key === 'Escape') { close(); btn.focus(); }
      if (e.key === 'Tab')    { close(); }
    });
  });

  document.addEventListener('click',   function (e) { dropdowns.forEach(function (d) { if (!d.contains(e.target)) closeDropdown(d); }); });
  document.addEventListener('focusin', function (e) { dropdowns.forEach(function (d) { if (!d.contains(e.target)) closeDropdown(d); }); });
})();
