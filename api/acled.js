// ========================================
// Vercel Serverless Function: ACLED API Proxy
// Route: /api/acled
// Handles OAuth token + fetches conflict data server-side
// ========================================

let cachedToken = null;
let tokenExpiry = 0;

async function getACLEDToken() {
  // Return cached token if still valid (with 5 min buffer)
  if (cachedToken && Date.now() < tokenExpiry - 300000) {
    return cachedToken;
  }

  const email = process.env.ACLED_EMAIL;
  const password = process.env.ACLED_PASSWORD;

  if (!email || !password) {
    throw new Error('ACLED credentials not configured');
  }

  const body = new URLSearchParams({
    username: email,
    password: password,
    grant_type: 'password',
    client_id: 'acled',
  });

  const res = await fetch('https://acleddata.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ACLED auth failed: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000);
  return cachedToken;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const token = await getACLEDToken();

    // Build ACLED API query from request params
    const { limit = 100, country, event_type, days = 90 } = req.query;

    // Calculate date range (last N days)
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];

    let url = `https://acleddata.com/api/acled/read?limit=${limit}&event_date=${startDate}|${endDate}&event_date_where=BETWEEN`;

    if (country) url += `&country=${encodeURIComponent(country)}`;
    if (event_type) url += `&event_type=${encodeURIComponent(event_type)}`;

    const acledRes = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!acledRes.ok) {
      // Token might be expired, try refresh
      cachedToken = null;
      throw new Error(`ACLED API error: ${acledRes.status}`);
    }

    const data = await acledRes.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('ACLED proxy error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
