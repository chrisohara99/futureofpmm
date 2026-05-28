// Netlify function to fetch team leaderboard data
const SUPABASE_URL = 'https://yyqzkczutlidhgyiyawc.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Dan's team - 40 members (excluding Dan and Chris in the filter below)
const TEAM_EMAILS = [
  "a.naji@sap.com",
  "axel.schuller@sap.com",
  "brian.raver@sap.com",
  "cathy.citarelli@sap.com",
  "corrie.birkeness@sap.com",
  "daniel.dukes@sap.com",
  "jacob.brass@sap.com",
  "jose.chicas@sap.com",
  "josh.ledbetter@sap.com",
  "justin.ham@sap.com",
  "kaiser.larsen@sap.com",
  "kara.reed@sap.com",
  "karsten.ruf@sap.com",
  "katryn.cheng@sap.com",
  "kendall.dignam@sap.com",
  "kuba.kufel@sap.com",
  "lauren.wong@sap.com",
  "liam.clarke@sap.com",
  "matthew.lyman@sap.com",
  "max.law@sap.com",
  "megan.hoy@sap.com",
  "neil.whitehead@sap.com",
  "olivier.duvelleroy@sap.com",
  "orla.cullen@sap.com",
  "pam.barrowcliffe@sap.com",
  "saely.espaillat@sap.com",
  "savannah.voll@sap.com",
  "scott.mackenzie@sap.com",
  "sim.patara@sap.com",
  "stuart.giles@sap.com",
  "tara.rogers@sap.com",
  "teuta.elezaj@sap.com",
  "thierry.audas@sap.com",
  "tiffany.baker@sap.com",
  "tony.fassette@sap.com",
  "tony.truong@sap.com",
  "venkata.giduthuri@sap.com",
  "yanhong.tong@sap.com"
];

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
    // Get team members by email list
    const emailList = TEAM_EMAILS.map(e => `"${e}"`).join(',');
    const profilesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?email=in.(${emailList})&select=id,first_name,last_name,email,created_at`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );
    
    let profiles = await profilesRes.json();
    
    // Handle error response
    if (profiles.error || profiles.message) {
      console.error('Supabase error:', profiles);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database error', details: profiles }) };
    }

    // Get all quiz scores for these users
    const userIds = profiles.map(p => p.id);
    
    if (userIds.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ leaderboard: [] }) };
    }

    // Fetch quiz scores for all team members
    const scoresRes = await fetch(
      `${SUPABASE_URL}/rest/v1/quiz_scores?user_id=in.(${userIds.join(',')})&select=user_id,chapter,score,percentage,passed`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );
    const allScores = await scoresRes.json();

    // Fetch assessment results for all team members
    const assessRes = await fetch(
      `${SUPABASE_URL}/rest/v1/assessment_results?user_id=in.(${userIds.join(',')})&select=user_id,assessment_type,result_data`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );
    const allAssessments = await assessRes.json();

    // Build leaderboard
    const leaderboard = profiles.map(profile => {
      const userScores = allScores.filter(s => s.user_id === profile.id);
      const userAssessments = allAssessments.filter(a => a.user_id === profile.id);
      
      // Count unique units passed (80%+ threshold)
      const unitsPassed = new Set(
        userScores
          .filter(s => s.passed || s.percentage >= 80)
          .map(s => s.chapter)
      ).size;
      
      // Calculate average quiz percentage
      const avgPercentage = userScores.length > 0
        ? userScores.reduce((sum, s) => sum + (s.percentage || 0), 0) / userScores.length
        : 0;
      
      // Check if baseline assessments completed
      const hasScorecard = userAssessments.some(a => a.assessment_type?.startsWith('10x-scorecard'));
      const hasCognitive = userAssessments.some(a => a.assessment_type === 'where-do-you-sit');
      
      // Get 10x scorecard score if available
      const scorecardResult = userAssessments.find(a => a.assessment_type === '10x-scorecard-content');
      const scorecardScore = scorecardResult?.result_data?.average || null;
      
      // Calculate total points: units passed * 100 + avg percentage + baseline bonuses
      const baselineBonus = (hasScorecard ? 50 : 0) + (hasCognitive ? 50 : 0);
      const totalPoints = (unitsPassed * 100) + Math.round(avgPercentage) + baselineBonus;
      
      // Format display name (First + Last Initial for privacy)
      let displayName;
      if (profile.first_name && profile.last_name) {
        displayName = `${profile.first_name} ${profile.last_name[0]}.`;
      } else if (profile.first_name) {
        displayName = profile.first_name;
      } else {
        // Fallback to email username, capitalize first letter
        const username = profile.email.split('@')[0].replace(/[._]/g, ' ');
        displayName = username.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      
      return {
        displayName,
        unitsPassed,
        totalUnits: 7,
        quizzesTaken: userScores.length,
        avgPercentage: Math.round(avgPercentage),
        hasScorecard,
        hasCognitive,
        scorecardScore,
        totalPoints,
        joinedAt: profile.created_at
      };
    });

    // Sort by total points descending
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

    // Add rank
    leaderboard.forEach((entry, i) => {
      entry.rank = i + 1;
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        leaderboard,
        totalMembers: profiles.length,
        lastUpdated: new Date().toISOString()
      })
    };

  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error', details: err.message }) };
  }
};
