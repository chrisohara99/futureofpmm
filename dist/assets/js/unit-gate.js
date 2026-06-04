// Unit Gate - Controls incremental curriculum rollout
// Updates: Just change UNLOCK_DATES to roll out new units

(function() {
    // Superusers bypass all time gates
    const SUPERUSERS = ['christopher.ohara@sap.com', 'dan.yu@sap.com', 'sean.thomson@sap.com', 'brian.raver@sap.com'];
    
    try {
        const directUser = localStorage.getItem('pmm_direct_user');
        if (directUser) {
            const email = JSON.parse(directUser).email?.toLowerCase();
            if (SUPERUSERS.includes(email)) {
                console.log('Superuser detected - bypassing unit gate');
                return; // Skip all gating
            }
        }
    } catch (e) {}
    
    const UNLOCK_DATES = {
        'unit-01': new Date('2026-05-07'),  // Available
        'unit-02': new Date('2026-05-14'),  // Available
        'unit-03': new Date('2026-06-11'),  // June 11
        'unit-04': new Date('2026-06-18'),  // June 18
        'unit-05': new Date('2026-06-25'),  // June 25
        'unit-06': new Date('2026-07-02'),  // July 2
        'unit-07': new Date('2026-07-09'),  // July 9
    };
    
    // Get current unit from URL path
    const path = window.location.pathname;
    const unitMatch = path.match(/unit-0(\d)/);
    
    if (!unitMatch) return; // Not a unit page
    
    const unitKey = 'unit-0' + unitMatch[1];
    const unlockDate = UNLOCK_DATES[unitKey];
    
    if (!unlockDate) return; // Unit not in schedule
    
    const now = new Date();
    
    if (now < unlockDate) {
        // Unit is locked - redirect to locked page with unit info
        const unlockStr = unlockDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        });
        window.location.replace('/curriculum/locked.html?unit=' + unitMatch[1] + '&date=' + encodeURIComponent(unlockStr));
    }
})();
