// Simple password gate for curriculum pages (in addition to Supabase auth)
(function() {
    // Check if already authenticated this session
    if (sessionStorage.getItem('curriculum_access') === 'granted') {
        return; // Already authenticated, don't show gate
    }
    
    // Create and inject the gate overlay
    const gateHTML = `
    <div id="curriculumGate" style="
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(135deg, #44546A 0%, #4472C4 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
    ">
        <div style="
            background: white;
            padding: 2.5rem;
            border-radius: 16px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        ">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔐</div>
            <h2 style="font-size: 1.4rem; color: #44546A; margin-bottom: 0.5rem; font-family: Inter, sans-serif;">
                Curriculum Preview Access
            </h2>
            <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.95rem; font-family: Inter, sans-serif;">
                This content is under development.<br>Enter the preview code to continue.
            </p>
            <input type="password" id="curriculumCode" placeholder="Enter access code" style="
                width: 100%;
                padding: 0.875rem 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 1rem;
                margin-bottom: 1rem;
                font-family: Inter, sans-serif;
            ">
            <button id="curriculumSubmit" style="
                width: 100%;
                padding: 0.875rem;
                background: #ED7D31;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                font-family: Inter, sans-serif;
            ">Access Curriculum</button>
            <div id="curriculumError" style="
                color: #dc2626;
                margin-top: 1rem;
                font-size: 0.9rem;
                display: none;
                font-family: Inter, sans-serif;
            "></div>
        </div>
    </div>`;
    
    // Wait for DOM to be ready
    if (document.body) {
        document.body.insertAdjacentHTML('afterbegin', gateHTML);
        setupGate();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.insertAdjacentHTML('afterbegin', gateHTML);
            setupGate();
        });
    }
    
    function setupGate() {
        const submitBtn = document.getElementById('curriculumSubmit');
        const codeInput = document.getElementById('curriculumCode');
        const errorDiv = document.getElementById('curriculumError');
        const gate = document.getElementById('curriculumGate');
        
        function checkCode() {
            const code = codeInput.value.trim().toLowerCase();
            if (code === 'porsche911') {
                sessionStorage.setItem('curriculum_access', 'granted');
                gate.style.display = 'none';
            } else {
                errorDiv.textContent = 'Invalid access code. Please try again.';
                errorDiv.style.display = 'block';
                codeInput.value = '';
                codeInput.focus();
            }
        }
        
        submitBtn.addEventListener('click', checkCode);
        codeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') checkCode();
        });
        
        // Focus the input
        setTimeout(function() { codeInput.focus(); }, 100);
    }
})();
