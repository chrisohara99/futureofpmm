// Auth gate for NextGen PMM site
(function() {
  // Skip gate check if we're already on the gate page
  if (window.location.pathname === '/gate.html' || window.location.pathname === '/gate') {
    return;
  }

  // Check for valid authentication
  try {
    const auth = JSON.parse(localStorage.getItem('pmm_gate_auth'));
    if (auth && auth.authenticated) {
      // Optional: Add expiry check (e.g., 7 days)
      const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - auth.timestamp < SEVEN_DAYS) {
        // Authenticated - show page
        document.documentElement.style.display = '';
        window.pmmCurrentUser = JSON.parse(localStorage.getItem('pmm_direct_user') || 'null') || { email: 'sap-user@sap.com' };
        return;
      }
    }
  } catch(e) {}

  // Not authenticated - redirect to gate
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = '/gate.html?redirect=' + encodeURIComponent(currentPath);
})();
