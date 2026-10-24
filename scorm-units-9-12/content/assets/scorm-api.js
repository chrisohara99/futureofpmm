/**
 * SCORM 1.2 API Wrapper
 * For SAP SuccessFactors Learning Integration
 */

var SCORM = (function() {
    var API = null;
    var initialized = false;
    var completed = false;
    
    // Find the SCORM API
    function findAPI(win) {
        var attempts = 0;
        while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
            attempts++;
            if (attempts > 10) return null;
            win = win.parent;
        }
        return win.API;
    }
    
    function getAPI() {
        if (API == null) {
            API = findAPI(window);
            if (API == null && window.opener != null) {
                API = findAPI(window.opener);
            }
        }
        return API;
    }
    
    // Initialize connection to LMS
    function initialize() {
        var api = getAPI();
        if (api == null) {
            console.warn('SCORM API not found - running in standalone mode');
            return false;
        }
        
        var result = api.LMSInitialize('');
        if (result === 'true' || result === true) {
            initialized = true;
            
            // Set initial status if not already set
            var status = api.LMSGetValue('cmi.core.lesson_status');
            if (status === 'not attempted' || status === '') {
                api.LMSSetValue('cmi.core.lesson_status', 'incomplete');
            }
            
            console.log('SCORM initialized successfully');
            return true;
        }
        
        console.error('SCORM initialization failed');
        return false;
    }
    
    // Set lesson status
    function setStatus(status) {
        var api = getAPI();
        if (api == null || !initialized) return false;
        
        var result = api.LMSSetValue('cmi.core.lesson_status', status);
        api.LMSCommit('');
        return result === 'true' || result === true;
    }
    
    // Set score
    function setScore(score, max, min) {
        var api = getAPI();
        if (api == null || !initialized) return false;
        
        max = max || 100;
        min = min || 0;
        
        api.LMSSetValue('cmi.core.score.raw', score.toString());
        api.LMSSetValue('cmi.core.score.max', max.toString());
        api.LMSSetValue('cmi.core.score.min', min.toString());
        api.LMSCommit('');
        
        console.log('SCORM score set: ' + score + '/' + max);
        return true;
    }
    
    // Mark as complete
    function complete(score) {
        if (completed) return true;
        
        var api = getAPI();
        if (api == null || !initialized) {
            console.log('Standalone mode - marking complete locally');
            completed = true;
            return true;
        }
        
        // Set score if provided
        if (score !== undefined) {
            setScore(score);
            // Set passed/failed based on score
            if (score >= 70) {
                setStatus('passed');
            } else {
                setStatus('failed');
            }
        } else {
            setStatus('completed');
        }
        
        completed = true;
        console.log('SCORM lesson completed');
        return true;
    }
    
    // Save bookmark/location
    function setLocation(location) {
        var api = getAPI();
        if (api == null || !initialized) return false;
        
        api.LMSSetValue('cmi.core.lesson_location', location);
        api.LMSCommit('');
        return true;
    }
    
    // Get bookmark/location
    function getLocation() {
        var api = getAPI();
        if (api == null || !initialized) return '';
        
        return api.LMSGetValue('cmi.core.lesson_location');
    }
    
    // Save suspend data (for state persistence)
    function setSuspendData(data) {
        var api = getAPI();
        if (api == null || !initialized) return false;
        
        var dataStr = typeof data === 'string' ? data : JSON.stringify(data);
        api.LMSSetValue('cmi.suspend_data', dataStr);
        api.LMSCommit('');
        return true;
    }
    
    // Get suspend data
    function getSuspendData() {
        var api = getAPI();
        if (api == null || !initialized) return null;
        
        var data = api.LMSGetValue('cmi.suspend_data');
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                return data;
            }
        }
        return null;
    }
    
    // Terminate connection
    function terminate() {
        var api = getAPI();
        if (api == null || !initialized) return false;
        
        api.LMSCommit('');
        var result = api.LMSFinish('');
        initialized = false;
        
        console.log('SCORM session terminated');
        return result === 'true' || result === true;
    }
    
    // Auto-initialize on load
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
    
    // Auto-terminate on unload
    window.addEventListener('beforeunload', function() {
        if (initialized && !completed) {
            setStatus('incomplete');
        }
        terminate();
    });
    
    // Public API
    return {
        initialize: initialize,
        setStatus: setStatus,
        setScore: setScore,
        complete: complete,
        setLocation: setLocation,
        getLocation: getLocation,
        setSuspendData: setSuspendData,
        getSuspendData: getSuspendData,
        terminate: terminate,
        isInitialized: function() { return initialized; },
        isComplete: function() { return completed; }
    };
})();

// Convenience function for quiz completion
function submitQuizToSCORM(score, totalQuestions) {
    var percentage = Math.round((score / totalQuestions) * 100);
    SCORM.complete(percentage);
    return percentage;
}
