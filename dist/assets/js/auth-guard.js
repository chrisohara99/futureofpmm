// Auth Guard - Requires login to view any page
// Hide page IMMEDIATELY - before anything else renders
document.documentElement.style.display = 'none';

(function() {
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
