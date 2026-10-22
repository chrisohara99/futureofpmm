// Curriculum Progress Tracking
// Manages user progress through assessments and units
// Uses Netlify functions to bypass corporate proxy issues with direct Supabase calls

(function() {
    // Unit prerequisites map
    const UNIT_PREREQUISITES = {
        'unit-01': ['assessments'],
        'unit-02': ['unit-01'],
        'unit-03': ['unit-02'],
        'unit-04': ['unit-03'],
        'unit-05': ['unit-04'],
        'unit-06': ['unit-05'],
        'unit-07': ['unit-06']
    };
    
    // Passing score threshold
    const PASS_THRESHOLD = 80;
    
    window.CurriculumProgress = {
        userProgress: null,
        userEmail: null,
        
        async init() {
            // Get user email from localStorage
            try {
                const directUser = localStorage.getItem('pmm_direct_user');
                if (directUser) {
                    const parsed = JSON.parse(directUser);
                    this.userEmail = parsed.email;
                }
            } catch (e) {
                console.error('Failed to get user email:', e);
            }
            
            if (!this.userEmail) {
                console.log('No user email - progress not available');
                return false;
            }
            
            await this.loadProgress();
            return true;
        },
        
        async loadProgress() {
            try {
                // Use serverless function to fetch all user data
                const res = await fetch('/.netlify/functions/get-user-scores', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.userEmail })
                });
                
                const data = await res.json();
                console.log('Progress data from server:', data);
                
                if (data.error) {
                    console.error('Server error:', data.error);
                    return null;
                }
                
                // Build progress object
                this.userProgress = {
                    assessments: {},
                    quizzes: {},
                    chapters: {}
                };
                
                // Process assessments
                if (data.assessments) {
                    data.assessments.forEach(a => {
                        this.userProgress.assessments[a.assessment_type] = {
                            completed: true,
                            resultKey: a.result_name,
                            resultData: a.result_data,
                            completedAt: a.completed_at
                        };
                    });
                }
                
                // Process quizzes (keep best score per unit)
                if (data.scores) {
                    data.scores.forEach(q => {
                        if (!this.userProgress.quizzes[q.chapter]) {
                            this.userProgress.quizzes[q.chapter] = {
                                bestScore: q.percentage,
                                passed: q.percentage >= PASS_THRESHOLD,
                                attempts: 1
                            };
                        } else {
                            // Keep best score
                            if (q.percentage > this.userProgress.quizzes[q.chapter].bestScore) {
                                this.userProgress.quizzes[q.chapter].bestScore = q.percentage;
                                this.userProgress.quizzes[q.chapter].passed = q.percentage >= PASS_THRESHOLD;
                            }
                            this.userProgress.quizzes[q.chapter].attempts++;
                        }
                    });
                }
                
                // Derive chapter completion from quiz passes
                Object.keys(this.userProgress.quizzes).forEach(unitId => {
                    if (this.userProgress.quizzes[unitId].passed) {
                        this.userProgress.chapters[unitId] = {
                            completed: true
                        };
                    }
                });
                
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
            return !!(a['10x-scorecard-content'] && a['where-do-you-sit']);
        },
        
        // Check if a unit quiz was passed
        hasPassedUnit(unitId) {
            if (!this.userProgress) return false;
            const quiz = this.userProgress.quizzes[unitId];
            return quiz && quiz.passed;
        },
        
        // Get best score for a unit
        getUnitScore(unitId) {
            if (!this.userProgress) return null;
            const quiz = this.userProgress.quizzes[unitId];
            return quiz ? quiz.bestScore : null;
        },
        
        // Check if user can access a unit
        canAccessUnit(unitId) {
            const prereqs = UNIT_PREREQUISITES[unitId];
            if (!prereqs) return true;
            
            for (const prereq of prereqs) {
                if (prereq === 'assessments') {
                    if (!this.hasCompletedAssessments()) return false;
                } else {
                    if (!this.hasPassedUnit(prereq)) return false;
                }
            }
            return true;
        },
        
        // Get count of completed units
        getCompletedUnitCount() {
            if (!this.userProgress) return 0;
            return Object.values(this.userProgress.quizzes)
                .filter(q => q.passed).length;
        },
        
        // Get total unit count
        getTotalUnitCount() {
            return 12;
        },
        
        // Get overall progress percentage
        getOverallProgress() {
            const completed = this.getCompletedUnitCount();
            const total = this.getTotalUnitCount();
            return Math.round((completed / total) * 100);
        },
        
        // Get next unit to work on
        getNextUnit() {
            const units = ['unit-01', 'unit-02', 'unit-03', 'unit-04', 'unit-05', 'unit-06', 'unit-07', 'unit-08', 'unit-09', 'unit-10', 'unit-11', 'unit-12'];
            for (const unit of units) {
                if (!this.hasPassedUnit(unit)) {
                    return unit;
                }
            }
            return null; // All complete
        },
        
        // Get assessment result
        getAssessmentResult(type) {
            if (!this.userProgress) return null;
            return this.userProgress.assessments[type] || null;
        }
    };
})();
