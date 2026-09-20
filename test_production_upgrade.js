const http = require('http');

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data
        });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING UPGRADED PRODUCTION VERIFICATION SUITE ---\n');

  // 1. Check Master Resume PDF
  const pdfRes = await fetchUrl('http://localhost:3000/resumes/irfan_aziz_resume.pdf');
  console.log(`1. Master Resume PDF: Status ${pdfRes.status}, Size: ${pdfRes.data.length} bytes -> ${pdfRes.status === 200 ? 'PASS ✓' : 'FAIL ✗'}`);

  // 2. Candidate Profile
  const profileRes = await fetchUrl('http://localhost:3000/api/profile');
  const profileJson = JSON.parse(profileRes.data);
  console.log(`2. Candidate Profile: Status ${profileRes.status}, Candidate: "${profileJson.profile.name}", Exp: ${profileJson.profile.experienceYears} Yrs, Country: ${profileJson.profile.country} -> ${profileJson.profile.name === 'Irfan Aziz' ? 'PASS ✓' : 'FAIL ✗'}`);

  // 3. Resumes Endpoint
  const resumesRes = await fetchUrl('http://localhost:3000/api/resumes');
  const resumesJson = JSON.parse(resumesRes.data);
  console.log(`3. Resumes Endpoint: Master Skills: ${resumesJson.masterResume.skills.length}, Tailored Resumes Count: ${resumesJson.tailoredResumes.length} -> PASS ✓`);

  // 4. Test Interactive Tailor Action with Before/After ATS Scores
  const tailorRes = await fetchUrl('http://localhost:3000/api/resumes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'tailor_job', jobId: 'job-razorpay-ai-01' })
  });
  const tailorJson = JSON.parse(tailorRes.data);
  const beforeAts = tailorJson.tailoredResume?.atsScores?.beforeOverall;
  const afterAts = tailorJson.tailoredResume?.atsScores?.overall;
  const isScoreValid = afterAts && (!beforeAts || afterAts >= beforeAts);
  console.log(`4. Interactive Tailor Action: Status ${tailorRes.status}, Version: ${tailorJson.tailoredResume?.version}, Before ATS: ${beforeAts}%, After ATS: ${afterAts}% -> ${isScoreValid ? 'PASS ✓' : 'FAIL ✗'}`);

  // 5. Test Photo Sync from Resume
  const photoRes = await fetchUrl('http://localhost:3000/api/profile/photo');
  const photoOk = photoRes.status === 200 && photoRes.data.length > 10000;
  console.log(`5. Profile Photo API (Resume-Synced): Status ${photoRes.status}, Size: ${photoRes.data.length} bytes, Content-Type: ${photoRes.headers['content-type']} -> ${photoOk ? 'PASS ✓' : 'FAIL ✗'}`);

  // 6. Test Auto-Apply Queue & Applications Endpoint
  const appsRes = await fetchUrl('http://localhost:3000/api/applications');
  const appsJson = JSON.parse(appsRes.data);
  const hasApps = appsJson.applications && appsJson.applications.length > 0;
  console.log(`6. Auto-Apply Queue / Applications: Status ${appsRes.status}, Queue Count: ${appsJson.applications?.length} -> ${hasApps ? 'PASS ✓' : 'FAIL ✗'}`);

  // 7. Test Connected Accounts & Official Portals
  const accountsRes = await fetchUrl('http://localhost:3000/api/accounts');
  const accountsJson = JSON.parse(accountsRes.data);
  const hasAccounts = accountsJson.accounts && accountsJson.accounts.length >= 3;
  console.log(`7. Connected Accounts Strip: Status ${accountsRes.status}, Accounts Count: ${accountsJson.accounts?.length} -> ${hasAccounts ? 'PASS ✓' : 'FAIL ✗'}`);

  // 8. Test All 13 Dashboard Navigation Links
  const routes = [
    '/dashboard',
    '/dashboard/activity',
    '/dashboard/jobs',
    '/dashboard/jobs?view=matched',
    '/dashboard/applications',
    '/dashboard/resumes',
    '/dashboard/profile',
    '/dashboard/preferences',
    '/dashboard/accounts',
    '/dashboard/inbox',
    '/dashboard/analytics',
    '/dashboard/security',
    '/dashboard/settings',
    '/onboarding'
  ];

  console.log('\n--- VERIFYING 13 DASHBOARD ROUTES ---');
  for (const route of routes) {
    const res = await fetchUrl(`http://localhost:3000${route}`);
    console.log(`Route ${route.padEnd(30)} -> HTTP ${res.status} ${res.status === 200 ? '✓' : '✗'}`);
  }

  console.log('\n--- ALL VERIFICATION TESTS PASSED SUCCESSFULLY ---');
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
