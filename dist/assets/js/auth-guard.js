// Auth Guard - Requires login to view any page
(function() {
    const SUPABASE_URL = 'https://yyqzkczutlidhgyiyawc.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cXprY3p1dGxpZGhneWl5YXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjY0NzksImV4cCI6MjA5MDA0MjQ3OX0.B4mHnxZ9Ap31e4w3uE4cW6cWZvKgiLnLOcmbNbeCoTI';
    
    // Hide page content until auth check completes
    document.documentElement.style.visibility = 'hidden';
    
    // Load Supabase if not already loaded
    function loadSupabase(callback) {
        if (typeof supabase !== 'undefined' && supabase.createClient) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@supabase/supabase-js@2';
        script.onload = callback;
        document.head.appendChild(script);
    }
    
    function checkAuth() {
        loadSupabase(async function() {
            try {
                const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                const { data: { session } } = await client.auth.getSession();
                
                if (session) {
                    // User is logged in - show page
                    document.documentElement.style.visibility = 'visible';
                } else {
                    // Not logged in - redirect to login
                    const currentPath = window.location.pathname;
                    window.location.href = '/curriculum/login.html?redirect=' + encodeURIComponent(currentPath);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                // On error, redirect to login for safety
                window.location.href = '/curriculum/login.html';
            }
        });
    }
    
    // Run auth check when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAuth);
    } else {
        checkAuth();
    }
})();
