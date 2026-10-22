// Curriculum Gate - DISABLED
// Password protection removed per Chris's request (2026-04-25)
// Access now controlled solely by Supabase auth (auth-guard.js)

(function() {
    // Auto-grant access - no password required
    sessionStorage.setItem('curriculum_access', 'granted');
})();
