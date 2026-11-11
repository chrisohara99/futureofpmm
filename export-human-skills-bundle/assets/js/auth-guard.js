// Auth gate for NextGen PMM site - DISABLED
(function() {
  // Gate disabled - auto-authenticate all visitors
  document.documentElement.style.display = '';
  window.pmmCurrentUser = { email: 'guest@sap.com', name: 'Guest' };
})();
