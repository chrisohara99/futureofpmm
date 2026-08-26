const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yyqzkczutlidhgyiyawc.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// All subscribers (known-users + dan team merged)
const ALL_SUBSCRIBERS = [
  'a.naji@sap.com', 'a.sirolli@sap.com', 'axel.schuller@sap.com', 'brian.raver@sap.com',
  'markdonahue23@gmail.com', 'terry.penner@sap.com',
  'cathy.citarelli@sap.com', 'chrisohara1968@gmail.com', 'christine.baratta@sap.com',
  'christopher.ohara@sap.com', 'corrie.birkeness@sap.com', 'dan.yu@sap.com',
  'daniel.dukes@sap.com', 'dee.houchen@sap.com', 'eemaan.ikhlaq@sap.com',
  'erika.jackson@sap.com', 'esther.rodrigo.ortiz@sap.com', 'fiona.ashley@sap.com',
  'j.kiermeier@sap.com', 'jacob.brass@sap.com', 'jose.chicas@sap.com',
  'josh.ledbetter@sap.com', 'justin.ham@sap.com', 'kaiser.larsen@sap.com',
  'kara.reed@sap.com', 'karsten.ruf@sap.com', 'katryn.cheng@sap.com',
  'kendall.dignam@sap.com', 'kuba.kufel@sap.com', 'lauren.cochrane@sap.com',
  'lauren.moreno@sap.com', 'lauren.wong@sap.com', 'liam.clarke@sap.com',
  'mairtin.keane@sap.com', 'matthew.lyman@sap.com', 'max.law@sap.com',
  'megan.hoy@sap.com', 'necla.catakli@sap.com', 'neil.whitehead@sap.com',
  'olivier.duvelleroy@sap.com', 'orla.cullen@sap.com', 'pam.barrowcliffe@sap.com',
  'peter.baskin@sap.com', 'robert.mcgrath@sap.com', 'rossana.bobadilla.echegoyen@sap.com',
  's.neal@sap.com', 'saely.espaillat@sap.com', 'savannah.voll@sap.com',
  'scott.mackenzie@sap.com', 'sean.thomson@sap.com', 'sim.patara@sap.com',
  'simone.maienfisch@sap.com', 'steffen.hofstetter@sap.com', 'stephanie.craig@sap.com',
  'stuart.giles@sap.com', 'tara.rogers@sap.com', 'teuta.elezaj@sap.com',
  'thierry.audas@sap.com', 'tiffany.baker@sap.com', 'tony.fassette@sap.com',
  'tony.truong@sap.com', 'tunir.kapil@sap.com', 'venkata.giduthuri@sap.com',
  'wanda.ni.laighin@sap.com', 'yanhong.tong@sap.com'
];

const DAN_TEAM = new Set([
  'a.naji@sap.com', 'axel.schuller@sap.com', 'brian.raver@sap.com', 'cathy.citarelli@sap.com',
  'christopher.ohara@sap.com', 'corrie.birkeness@sap.com', 'dan.yu@sap.com', 'daniel.dukes@sap.com',
  'jacob.brass@sap.com', 'jose.chicas@sap.com', 'josh.ledbetter@sap.com', 'justin.ham@sap.com',
  'kaiser.larsen@sap.com', 'kara.reed@sap.com', 'karsten.ruf@sap.com', 'katryn.cheng@sap.com',
  'kendall.dignam@sap.com', 'kuba.kufel@sap.com', 'lauren.wong@sap.com', 'liam.clarke@sap.com',
  'matthew.lyman@sap.com', 'max.law@sap.com', 'megan.hoy@sap.com', 'neil.whitehead@sap.com',
  'olivier.duvelleroy@sap.com', 'orla.cullen@sap.com', 'pam.barrowcliffe@sap.com',
  'saely.espaillat@sap.com', 'savannah.voll@sap.com', 'scott.mackenzie@sap.com',
  'sim.patara@sap.com', 'stuart.giles@sap.com', 'tara.rogers@sap.com', 'teuta.elezaj@sap.com',
  'thierry.audas@sap.com', 'tiffany.baker@sap.com', 'tony.fassette@sap.com', 'tony.truong@sap.com',
  'venkata.giduthuri@sap.com', 'yanhong.tong@sap.com'
]);

const SUPERUSERS = new Set([
  'christopher.ohara@sap.com', 'sean.thomson@sap.com', 'brian.raver@sap.com',
  'olivier.duvelleroy@sap.com', 'j.chen02@sap.com', 'kelly.amaroso@sap.com',
  'sarah.sternberg@sap.com',
  'dahra.williams@sap.com', 'jasmine.churchill@sap.com', 'dante.ricci@sap.com',
  'kasier.larsen@sap.com', 'markdonahue23@gmail.com', 'brenda.bown@sap.com',
  'matthew.montgomery@sap.com', 'terry.penner@sap.com', 's.laughlin@sap.com'
]);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Get all profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, created_at');

    if (profileError) throw profileError;

    // Get all quiz scores
    const { data: quizScores, error: quizError } = await supabase
      .from('quiz_scores')
      .select('user_id, chapter, score, percentage');

    if (quizError) throw quizError;

    // Get all assessment results
    const { data: assessments, error: assessError } = await supabase
      .from('assessment_results')
      .select('user_id, assessment_type');

    if (assessError) throw assessError;

    // Build profile map by email
    const profileMap = {};
    profiles.forEach(p => {
      profileMap[p.email.toLowerCase()] = p;
    });

    // Build quiz scores map by user_id
    const quizMap = {};
    (quizScores || []).forEach(r => {
      if (!quizMap[r.user_id]) {
        quizMap[r.user_id] = [];
      }
      quizMap[r.user_id].push(r);
    });

    // Build assessments map by user_id
    const assessMap = {};
    (assessments || []).forEach(a => {
      if (!assessMap[a.user_id]) {
        assessMap[a.user_id] = [];
      }
      assessMap[a.user_id].push(a);
    });

    // Build subscriber status list from ALL profiles in database
    // Plus any in ALL_SUBSCRIBERS who haven't registered yet
    const allEmails = new Set([
      ...ALL_SUBSCRIBERS.map(e => e.toLowerCase()),
      ...profiles.map(p => p.email.toLowerCase())
    ]);

    const subscribers = Array.from(allEmails).map(email => {
      const profile = profileMap[email.toLowerCase()];
      const isDanTeam = DAN_TEAM.has(email);
      const isSuperuser = SUPERUSERS.has(email);

      if (!profile) {
        return {
          email,
          danTeam: isDanTeam,
          superuser: isSuperuser,
          registered: false,
          name: null,
          unit1: false,
          unit2: false,
          unit3: false,
          unit4: false,
          unit5: false,
          unit6: false,
          unit7: false,
          unit8: false,
          unit9: false,
          unit10: false,
          scorecard: false,
          cognitive: false,
          lastActivity: null,
          registeredAt: null
        };
      }

      const userQuizzes = quizMap[profile.id] || [];
      const userAssessments = assessMap[profile.id] || [];
      
      // Check what's completed (80% pass threshold)
      const unit1 = userQuizzes.some(r => r.chapter === 'unit-01' && r.percentage >= 80);
      const unit2 = userQuizzes.some(r => r.chapter === 'unit-02' && r.percentage >= 80);
      const unit3 = userQuizzes.some(r => r.chapter === 'unit-03' && r.percentage >= 80);
      const unit4 = userQuizzes.some(r => r.chapter === 'unit-04' && r.percentage >= 80);
      const unit5 = userQuizzes.some(r => r.chapter === 'unit-05' && r.percentage >= 80);
      const unit6 = userQuizzes.some(r => r.chapter === 'unit-06' && r.percentage >= 80);
      const unit7 = userQuizzes.some(r => r.chapter === 'unit-07' && r.percentage >= 80);
      const unit8 = userQuizzes.some(r => r.chapter === 'unit-08' && r.percentage >= 80);
      const unit9 = userQuizzes.some(r => r.chapter === 'unit-09' && r.percentage >= 80);
      const unit10 = userQuizzes.some(r => r.chapter === 'unit-10' && r.percentage >= 80);
      const scorecard = userAssessments.some(a => a.assessment_type === '10x-scorecard');
      const cognitive = userAssessments.some(a => a.assessment_type === 'cognitive');

      // Last activity = most recent quiz or registration date
      const quizDates = userQuizzes.map(q => new Date(q.completed_at)).filter(d => !isNaN(d));
      const lastActivity = quizDates.length > 0 
        ? new Date(Math.max(...quizDates)).toISOString()
        : profile.created_at;

      return {
        email,
        danTeam: isDanTeam,
        superuser: isSuperuser,
        registered: true,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || null,
        unit1,
        unit2,
        unit3,
        unit4,
        unit5,
        unit6,
        unit7,
        unit8,
        unit9,
        unit10,
        scorecard,
        cognitive,
        lastActivity,
        registeredAt: profile.created_at
      };
    });

    // Sort: registered first, then by last activity
    subscribers.sort((a, b) => {
      if (a.registered !== b.registered) return b.registered - a.registered;
      if (!a.lastActivity) return 1;
      if (!b.lastActivity) return -1;
      return new Date(b.lastActivity) - new Date(a.lastActivity);
    });

    // Summary stats
    const stats = {
      total: subscribers.length,
      registered: subscribers.filter(s => s.registered).length,
      notRegistered: subscribers.filter(s => !s.registered).length,
      unit1Passed: subscribers.filter(s => s.unit1).length,
      unit2Passed: subscribers.filter(s => s.unit2).length,
      unit3Passed: subscribers.filter(s => s.unit3).length,
      unit4Passed: subscribers.filter(s => s.unit4).length,
      unit5Passed: subscribers.filter(s => s.unit5).length,
      unit6Passed: subscribers.filter(s => s.unit6).length,
      unit7Passed: subscribers.filter(s => s.unit7).length,
      unit8Passed: subscribers.filter(s => s.unit8).length,
      unit9Passed: subscribers.filter(s => s.unit9).length,
      unit10Passed: subscribers.filter(s => s.unit10).length,
      scorecardDone: subscribers.filter(s => s.scorecard).length,
      cognitiveDone: subscribers.filter(s => s.cognitive).length,
      danTeamCount: subscribers.filter(s => s.danTeam).length,
      superuserCount: subscribers.filter(s => s.superuser).length
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ stats, subscribers })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
