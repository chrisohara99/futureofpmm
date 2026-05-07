// Auth Guard - Requires login to view any page
// Hide page IMMEDIATELY - before anything else renders
document.documentElement.style.display = 'none';

(function() {
    // Detect Edge + tracking prevention blocking localStorage
    if (navigator.userAgent.includes('Edg/')) {
        try {
            localStorage.setItem('__edge_test', '1');
            localStorage.removeItem('__edge_test');
        } catch (e) {
            // localStorage blocked - show error page instead of redirect loop
            document.documentElement.style.display = '';
            document.body.innerHTML = '<div style="max-width:500px;margin:100px auto;padding:2rem;font-family:Inter,sans-serif;text-align:center;"><h1 style="color:#856404;font-size:1.5rem;">⚠️ Browser Issue Detected</h1><p style="color:#666;margin:1rem 0;">Microsoft Edge\'s tracking prevention is blocking the sign-in session.</p><p style="margin:1.5rem 0;"><strong>Solutions:</strong></p><ul style="text-align:left;color:#666;"><li>Use <strong>Google Chrome</strong> instead (recommended)</li><li>Or disable tracking prevention in Edge settings</li></ul><a href="/curriculum/login.html" style="display:inline-block;margin-top:1.5rem;padding:0.75rem 1.5rem;background:#4472C4;color:white;text-decoration:none;border-radius:6px;">Try Again</a></div>';
            return;
        }
    }
    
    const SUPABASE_URL = 'https://yyqzkczutlidhgyiyawc.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cXprY3p1dGxpZGhneWl5YXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjY0NzksImV4cCI6MjA5MDA0MjQ3OX0.B4mHnxZ9Ap31e4w3uE4cW6cWZvKgiLnLOcmbNbeCoTI';

    // Load Supabase synchronously via dynamic script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@supabase/supabase-js@2';
    script.onload = async function() {
        try {
            const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            const { data: { session } } = await client.auth.getSession();
            
            if (session) {
                // User is logged in - ensure profile exists (self-healing)
                try {
                    const { data: profile, error: profileError } = await client
                        .from('profiles')
                        .select('id')
                        .eq('id', session.user.id)
                        .single();
                    
                    if (profileError && profileError.code === 'PGRST116') {
                        // Profile doesn't exist - create one
                        console.log('Creating missing profile for user:', session.user.email);
                        await client.from('profiles').insert({
                            id: session.user.id,
                            email: session.user.email,
                            first_name: session.user.user_metadata?.first_name || null,
                            last_name: session.user.user_metadata?.last_name || null,
                            company: session.user.user_metadata?.company || 'SAP',
                            role: session.user.user_metadata?.role || null
                        });
                    }
                } catch (profileErr) {
                    console.warn('Profile check/create failed:', profileErr);
                    // Continue anyway - don't block page load
                }
                
                // Show page
                document.documentElement.style.display = '';
            } else {
                // Not logged in - redirect to login
                const currentPath = window.location.pathname + window.location.search;
                window.location.replace('/curriculum/login.html?redirect=' + encodeURIComponent(currentPath));
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.replace('/curriculum/login.html');
        }
    };
    script.onerror = function() {
        // If Supabase fails to load, redirect to login
        window.location.replace('/curriculum/login.html');
    };
    document.head.appendChild(script);
})();
