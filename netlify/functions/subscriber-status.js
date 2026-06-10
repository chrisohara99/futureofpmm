const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yyqzkczutlidhgyiyawc.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// All subscribers (known-users + dan team merged)
const ALL_SUBSCRIBERS = [
  'a.naji@sap.com', 'a.sirolli@sap.com', 'axel.schuller@sap.com', 'brian.raver@sap.com',
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
  'christopher.ohara@sap.com', 'dan.yu@sap.com', 'sean.thomson@sap.com',
  'brian.raver@sap.com', 'olivier.duvelleroy@sap.com'
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

    // Get all quiz results
    const { data: results, error: resultsError } = await supabase
      .from('results')
      .select('user_id, quiz_id, score, passed, created_at')
      .order('created_at', { ascending: false });

    if (resultsError) throw resultsError;

    // Build profile map by email
    const profileMap = {};
    profiles.forEach(p => {
      profileMap[p.email.toLowerCase()] = p;
    });

    // Build results map by user_id
    const resultsMap = {};
    results.forEach(r => {
      if (!resultsMap[r.user_id]) {
        resultsMap[r.user_id] = [];
      }
      resultsMap[r.user_id].push(r);
    });

    // Build subscriber status list
    const subscribers = ALL_SUBSCRIBERS.map(email => {
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
          scorecard: false,
          cognitive: false,
          lastActivity: null,
          registeredAt: null
        };
      }

      const userResults = resultsMap[profile.id] || [];
      
      // Check what's completed
      const unit1 = userResults.some(r => r.quiz_id === 'unit-01' && r.passed);
      const unit2 = userResults.some(r => r.quiz_id === 'unit-02' && r.passed);
      const unit3 = userResults.some(r => r.quiz_id === 'unit-03' && r.passed);
      const scorecard = userResults.some(r => r.quiz_id === '10x-scorecard');
      const cognitive = userResults.some(r => r.quiz_id === 'cognitive-assessment');

      // Find last activity
      const lastResult = userResults[0];
      const lastActivity = lastResult ? lastResult.created_at : profile.created_at;

      return {
        email,
        danTeam: isDanTeam,
        superuser: isSuperuser,
        registered: true,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || null,
        unit1,
        unit2,
        unit3,
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
      bothUnitsPassed: subscribers.filter(s => s.unit1 && s.unit2).length,
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
