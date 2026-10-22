// Auth gate - redirects to login if not authenticated
(function() {
    // Skip on gate page itself
    if (window.location.pathname === '/gate.html' || window.location.pathname === '/gate') return;
    
    // Check if authenticated
    if (localStorage.getItem('pmm_access') !== 'granted') {
        // Redirect to gate with return URL
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = '/gate.html?r=' + returnUrl;
    }
})();
