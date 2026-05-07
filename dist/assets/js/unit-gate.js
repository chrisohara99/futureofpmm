// Unit Gate - Controls incremental curriculum rollout
// Updates: Just change UNLOCK_DATES to roll out new units

(function() {
    const UNLOCK_DATES = {
        'unit-01': new Date('2026-05-07'),  // Week 1 - Now
        'unit-02': new Date('2026-05-14'),  // Week 2
        'unit-03': new Date('2026-05-21'),  // Week 3
        'unit-04': new Date('2026-05-28'),  // Week 4
        'unit-05': new Date('2026-06-04'),  // Week 5
        'unit-06': new Date('2026-06-11'),  // Week 6
        'unit-07': new Date('2026-06-18'),  // Week 7
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
