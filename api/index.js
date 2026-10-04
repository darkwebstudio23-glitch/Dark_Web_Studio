// D'ARK Web Studio — Vercel serverless API
// Required Vercel environment variables:
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//
// Create the owner account once in Supabase Dashboard:
// Authentication -> Users -> Add user.
// Use the same email/password that you will enter at /admin.html.

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function json(res, status, body) {
  res.status(status).setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
}

function requireConfig(res) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    json(res, 500, {
      ok: false,
      error: 'Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel Environment Variables.'
    });
    return false;
  }
  return true;
}

async function supabase(path, options = {}) {
  const headers = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const r = await fetch(`${SUPABASE_URL}${path}`, { ...options, headers });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (_) {}
  return { r, data, text };
}

async function getUser(accessToken) {
  if (!accessToken) return null;
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!r.ok) return null;
  return await r.json();
}

async function getSiteData() {
  const { r, data, text } = await supabase('/rest/v1/site_content?id=eq.1&select=data');
  if (!r.ok) throw new Error(data?.message || data?.hint || text || 'Could not read site content.');
  return data?.[0]?.data || null;
}

async function saveSiteData(value) {
  const { r, data, text } = await supabase('/rest/v1/site_content?id=eq.1', {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ data: value, updated_at: new Date().toISOString() })
  });
  if (!r.ok) throw new Error(data?.message || data?.hint || text || 'Could not save site content.');
  return data?.[0]?.data || value;
}

function bearer(req) {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : '';
}

module.exports = async (req, res) => {
  if (!requireConfig(res)) return;

  const action = String(req.query?.action || 'site').toLowerCase();

  try {
    if (action === 'login') {
      if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed.' });

      const email = String(req.body?.email || '').trim();
      const password = String(req.body?.password || '');
      if (!email || !password) return json(res, 400, { ok: false, error: 'Email and password are required.' });

      const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          apikey: SERVICE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.access_token) {
        return json(res, 401, { ok: false, error: data.error_description || data.msg || 'Invalid email or password.' });
      }

      return json(res, 200, {
        ok: true,
        access_token: data.access_token,
        username: data.user?.email || email
      });
    }

    if (action === 'session') {
      const user = await getUser(bearer(req));
      return json(res, 200, { ok: true, authenticated: !!user, username: user?.email || '' });
    }

    if (action === 'site') {
      if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'Method not allowed.' });
      const data = await getSiteData();
      return json(res, 200, { ok: true, data });
    }

    if (action === 'save') {
      if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed.' });
      const user = await getUser(bearer(req));
      if (!user) return json(res, 401, { ok: false, error: 'Please log in again.' });

      const value = req.body?.data;
      if (!value || typeof value !== 'object') {
        return json(res, 400, { ok: false, error: 'Invalid site data.' });
      }
      const data = await saveSiteData(value);
      return json(res, 200, { ok: true, data });
    }

    if (action === 'password') {
      if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed.' });
      const token = bearer(req);
      const user = await getUser(token);
      if (!user) return json(res, 401, { ok: false, error: 'Please log in again.' });

      const newPassword = String(req.body?.new_password || '');
      if (newPassword.length < 10) {
        return json(res, 400, { ok: false, error: 'Password must be at least 10 characters.' });
      }

      const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword })
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) return json(res, 400, { ok: false, error: data.message || data.msg || 'Could not change password.' });

      return json(res, 200, { ok: true });
    }

    return json(res, 404, { ok: false, error: 'Unknown action.' });
  } catch (e) {
    return json(res, 500, { ok: false, error: e.message || 'Server error.' });
  }
};
