// Shared authentication utilities for PMM Curriculum
const SUPABASE_URL = 'https://yyqzkczutlidhgyiyawc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cXprY3p1dGxpZGhneWl5YXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjY0NzksImV4cCI6MjA5MDA0MjQ3OX0.B4mHnxZ9Ap31e4w3uE4cW6cWZvKgiLnLOcmbNbeCoTI';

let supabaseClient = null;

// Initialize Supabase
function initSupabase() {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return true;
    }
    return false;
}

// Get current user
async function getCurrentUser() {
    if (supabaseClient) {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user) {
            return {
                id: session.user.id,
                email: session.user.email,
                firstName: session.user.user_metadata?.first_name || '',
                lastName: session.user.user_metadata?.last_name || '',
                isLoggedIn: true
            };
        }
    }
    
    // Fallback to localStorage
    const stored = localStorage.getItem('pmmCurrentUser');
    if (stored) {
        const user = JSON.parse(stored);
        return { ...user, isLoggedIn: true };
    }
    
    return { isLoggedIn: false };
}

// Sign out
async function signOut() {
    if (supabaseClient) {
        await supabaseClient.auth.signOut();
    }
    localStorage.removeItem('pmmCurrentUser');
    window.location.href = '/curriculum/';
}

// Save quiz score
async function saveQuizScore(chapter, score, total) {
    const user = await getCurrentUser();
    if (!user.isLoggedIn) return false;
    
    const percentage = Math.round((score / total) * 100);
    
    // Save to localStorage always
    const progress = JSON.parse(localStorage.getItem('pmmCurriculumProgress') || '{"activities":[],"chapters":[],"quizScores":{}}');
    progress.quizScores = progress.quizScores || {};
    progress.quizScores[chapter] = { score, total, percentage, date: new Date().toISOString() };
    
    if (percentage >= 70 && !progress.chapters.includes(parseInt(chapter.replace('chapter-', '')))) {
        progress.chapters.push(parseInt(chapter.replace('chapter-', '')));
    }
    localStorage.setItem('pmmCurriculumProgress', JSON.stringify(progress));
    
    // Also save to Supabase if available
    if (supabaseClient && user.id) {
        try {
            await supabaseClient.from('quiz_scores').insert({
                user_id: user.id,
                chapter: chapter,
                score: score,
                total: total,
                percentage: percentage
            });
        } catch (e) {
            console.log('Could not save to database:', e);
        }
    }
    
    return true;
}

// Get progress
function getProgress() {
    return JSON.parse(localStorage.getItem('pmmCurriculumProgress') || '{"activities":[],"chapters":[],"quizScores":{}}');
}

// Initialize on load
if (typeof window !== 'undefined') {
    initSupabase();
}
