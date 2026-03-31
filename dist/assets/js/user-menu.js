// User Menu - Shows logged-in status and account controls
(function() {
    const SUPABASE_URL = 'https://yyqzkczutlidhgyiyawc.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cXprY3p1dGxpZGhneWl5YXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjY0NzksImV4cCI6MjA5MDA0MjQ3OX0.B4mHnxZ9Ap31e4w3uE4cW6cWZvKgiLnLOcmbNbeCoTI';

    function createUserMenu() {
        // Find nav element (try multiple selectors)
        const nav = document.querySelector('nav') || document.querySelector('.nav') || document.querySelector('#main-nav');
        if (!nav) return;

        // Create user menu container
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <button class="user-menu-trigger" id="userMenuTrigger">
                <span class="user-avatar">👤</span>
                <span class="user-name" id="userName">Account</span>
                <span class="user-arrow">▾</span>
            </button>
            <div class="user-dropdown" id="userDropdown">
                <div class="user-info" id="userInfo">
                    <div class="user-email" id="userEmail">Loading...</div>
                </div>
                <div class="user-menu-divider"></div>
                <a href="/curriculum/account.html" class="user-menu-item">
                    <span>📊</span><span>My Stats</span>
                </a>
                <button class="user-menu-item" id="logoutBtn">
                    <span>🚪</span><span>Sign Out</span>
                </button>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .user-menu {
                position: relative;
                margin-left: 1rem;
            }
            .user-menu-trigger {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9rem;
                font-family: inherit;
                transition: background 0.2s;
            }
            .user-menu-trigger:hover {
                background: rgba(255,255,255,0.2);
            }
            .user-avatar {
                font-size: 1.1rem;
            }
            .user-name {
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .user-arrow {
                font-size: 0.7rem;
                opacity: 0.7;
            }
            .user-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 0.5rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                min-width: 220px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.2s;
                z-index: 1000;
            }
            .user-menu.open .user-dropdown {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            .user-info {
                padding: 1rem;
                border-bottom: 1px solid #eee;
            }
            .user-email {
                font-size: 0.85rem;
                color: #666;
            }
            .user-menu-divider {
                height: 1px;
                background: #eee;
            }
            .user-menu-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                width: 100%;
                padding: 0.75rem 1rem;
                border: none;
                background: none;
                color: #333;
                font-size: 0.9rem;
                text-decoration: none;
                cursor: pointer;
                transition: background 0.15s;
                font-family: inherit;
                text-align: left;
            }
            .user-menu-item:hover {
                background: #f5f5f5;
            }
            .user-menu-item:last-child {
                border-radius: 0 0 8px 8px;
                color: #c00;
            }
        `;
        document.head.appendChild(style);

        // Add to nav
        nav.appendChild(userMenu);

        // Toggle dropdown
        const trigger = document.getElementById('userMenuTrigger');
        const dropdown = document.getElementById('userDropdown');
        
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('open');
        });

        document.addEventListener('click', () => {
            userMenu.classList.remove('open');
        });

        // Load user info
        loadUserInfo();
    }

    async function loadUserInfo() {
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        
        // Try Supabase first
        if (typeof supabase !== 'undefined') {
            try {
                const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                const { data: { session } } = await client.auth.getSession();
                
                if (session && session.user) {
                    const metadata = session.user.user_metadata || {};
                    const firstName = metadata.first_name || '';
                    const lastName = metadata.last_name || '';
                    const email = session.user.email;
                    
                    userName.textContent = firstName || email.split('@')[0];
                    userEmail.textContent = email;
                    return;
                }
            } catch (e) {
                console.error('Error loading user:', e);
            }
        }
        
        // Fallback to localStorage
        const user = JSON.parse(localStorage.getItem('pmmCurrentUser') || 'null');
        if (user) {
            userName.textContent = user.firstName || user.email?.split('@')[0] || 'Account';
            userEmail.textContent = user.email || 'Unknown';
        }
    }

    async function logout() {
        // Clear Supabase session
        if (typeof supabase !== 'undefined') {
            try {
                const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                await client.auth.signOut();
            } catch (e) {
                console.error('Error signing out:', e);
            }
        }
        
        // Clear localStorage
        localStorage.removeItem('pmmCurrentUser');
        
        // Redirect to login
        window.location.href = '/curriculum/login.html';
    }

    // Initialize when DOM ready
    function init() {
        createUserMenu();
        
        // Setup logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
