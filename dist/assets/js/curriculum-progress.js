// Curriculum Progress Tracking
// Manages user progress through assessments and units

(function() {
    const SUPABASE_URL = 'https://yyqzkczutlidhgyiyawc.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cXprY3p1dGxpZGhneWl5YXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjY0NzksImV4cCI6MjA5MDA0MjQ3OX0.B4mHnxZ9Ap31e4w3uE4cW6cWZvKgiLnLOcmbNbeCoTI';
    
    // Unit prerequisites map
    const UNIT_PREREQUISITES = {
        'unit-01': ['assessments'],           // Must complete assessments first
        'unit-02': ['unit-01'],               // Must pass Unit 1 quiz
        'unit-03': ['unit-02'],               // Must pass Unit 2 quiz
        'unit-04': ['unit-03'],
        'unit-05': ['unit-04'],
        'unit-06': ['unit-05'],
        'unit-07': ['unit-06']
    };
    
    // Passing score threshold
    const PASS_THRESHOLD = 80;
    
    window.CurriculumProgress = {
        supabase: null,
        userProgress: null,
        
        async init() {
            if (typeof supabase === 'undefined') {
                console.warn('Supabase not loaded yet');
                return false;
            }
            
            this.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            
            const { data: { session } } = await this.supabase.auth.getSession();
            if (!session) {
                console.log('No session - progress not available');
                return false;
            }
            
            await this.loadProgress(session.user.id);
            return true;
        },
        
        async loadProgress(userId) {
            try {
                // Load assessment results
                const { data: assessments } = await this.supabase
                    .from('assessment_results')
                    .select('assessment_type, result_key, result_data, completed_at')
                    .eq('user_id', userId);
                
                // Load quiz scores (best score per unit)
                const { data: quizzes } = await this.supabase
                    .from('quiz_scores')
                    .select('chapter, score, total, percentage, completed_at')
                    .eq('user_id', userId)
                    .order('percentage', { ascending: false });
                
                // Load chapter progress
                const { data: chapters } = await this.supabase
                    .from('chapter_progress')
                    .select('chapter, completed, completed_at')
                    .eq('user_id', userId);
                
                // Build progress object
                this.userProgress = {
                    assessments: {},
                    quizzes: {},
                    chapters: {}
                };
                
                // Process assessments
                if (assessments) {
                    assessments.forEach(a => {
                        this.userProgress.assessments[a.assessment_type] = {
                            completed: true,
                            resultKey: a.result_key,
                            resultData: a.result_data,
                            completedAt: a.completed_at
                        };
                    });
                }
                
                // Process quizzes (keep best score per unit)
                if (quizzes) {
                    quizzes.forEach(q => {
                        if (!this.userProgress.quizzes[q.chapter]) {
                            this.userProgress.quizzes[q.chapter] = {
                                bestScore: q.percentage,
                                passed: q.percentage >= PASS_THRESHOLD,
                                attempts: 1
                            };
                        } else {
                            this.userProgress.quizzes[q.chapter].attempts++;
                        }
                    });
                }
                
                // Process chapters
                if (chapters) {
                    chapters.forEach(c => {
                        this.userProgress.chapters[c.chapter] = {
                            completed: c.completed,
                            completedAt: c.completed_at
                        };
                    });
                }
                
                console.log('Progress loaded:', this.userProgress);
                return this.userProgress;
                
            } catch (err) {
                console.error('Error loading progress:', err);
                return null;
            }
        },
        
        // Check if assessments are completed
        hasCompletedAssessments() {
            if (!this.userProgress) return false;
            const a = this.userProgress.assessments;
            // 10x-scorecard saves as '10x-scorecard-content' (Content section is required)
            return !!(a['10x-scorecard-content'] && a['where-do-you-sit']);
        },
        
        // Check if a unit quiz was passed
        hasPassedUnit(unitId) {
            if (!this.userProgress) return false;
            const quiz = this.userProgress.quizzes[unitId];
            return quiz && quiz.passed;
        },
        
        // Check if user can access a specific unit
        canAccessUnit(unitId) {
            const prereqs = UNIT_PREREQUISITES[unitId];
            if (!prereqs) return true; // No prerequisites
            
            for (const prereq of prereqs) {
                if (prereq === 'assessments') {
                    if (!this.hasCompletedAssessments()) return false;
                } else {
                    if (!this.hasPassedUnit(prereq)) return false;
                }
            }
            return true;
        },
        
        // Get the next step for a user
        getNextStep() {
            if (!this.hasCompletedAssessments()) {
                return { step: 'assessments', url: '/curriculum/intro.html' };
            }
            
            // Find the first unpassed unit
            for (let i = 1; i <= 7; i++) {
                const unitId = `unit-0${i}`;
                if (!this.hasPassedUnit(unitId)) {
                    return { step: unitId, url: `/curriculum/${unitId}/` };
                }
            }
            
            return { step: 'complete', url: '/curriculum/' };
        },
        
        // Get user's assessment results
        getAssessmentResults() {
            if (!this.userProgress) return null;
            return this.userProgress.assessments;
        },
        
        // Gate a page - redirect if prerequisites not met
        async gatePage(requiredUnit) {
            await this.init();
            
            if (!this.canAccessUnit(requiredUnit)) {
                const next = this.getNextStep();
                console.log(`Cannot access ${requiredUnit}, redirecting to ${next.url}`);
                
                // Show a brief message before redirect
                const overlay = document.createElement('div');
                overlay.style.cssText = 'position:fixed;inset:0;background:rgba(255,255,255,0.95);display:flex;align-items:center;justify-content:center;z-index:9999;';
                overlay.innerHTML = `
                    <div style="text-align:center;max-width:400px;padding:2rem;">
                        <h2 style="color:#44546A;margin-bottom:1rem;">🔒 Complete Prerequisites First</h2>
                        <p style="color:#666;margin-bottom:1rem;">You need to complete the previous steps before accessing this unit.</p>
                        <p style="color:#888;font-size:0.9rem;">Redirecting you...</p>
                    </div>
                `;
                document.body.appendChild(overlay);
                
                setTimeout(() => {
                    window.location.href = next.url;
                }, 1500);
                
                return false;
            }
            
            return true;
        },
        
        // Save assessment result
        async saveAssessmentResult(assessmentType, resultKey, resultData) {
            if (!this.supabase) await this.init();
            
            const { data: { session } } = await this.supabase.auth.getSession();
            if (!session) return false;
            
            const { error } = await this.supabase
                .from('assessment_results')
                .upsert({
                    user_id: session.user.id,
                    assessment_type: assessmentType,
                    result_key: resultKey,
                    result_data: resultData,
                    completed_at: new Date().toISOString()
                }, { onConflict: 'user_id,assessment_type' });
            
            if (error) {
                console.error('Error saving assessment:', error);
                return false;
            }
            
            // Reload progress
            await this.loadProgress(session.user.id);
            return true;
        }
    };
    
    // Auto-init when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const path = window.location.pathname;
        const unitMatch = path.match(/\/curriculum\/(unit-\d+)\//);
        
        if (unitMatch) {
            const unitId = unitMatch[1];
            CurriculumProgress.gatePage(unitId);
        }
    });
})();
