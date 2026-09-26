const jwt = require('jsonwebtoken');

// Set a real JWT_SECRET env var in the Vercel project settings before
// relying on this for real data — this default is a local-dev fallback.
const JWT_SECRET = process.env.JWT_SECRET || 'nivesh-dev-secret-change-me';

function sign(uid) {
  return jwt.sign({ uid }, JWT_SECRET, { expiresIn: '30d' });
}

function requireAuth(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) { const e = new Error('Not authenticated'); e.status = 401; throw e; }
  try {
    return jwt.verify(token, JWT_SECRET).uid;
  } catch (e) {
    const err = new Error('Invalid or expired session'); err.status = 401; throw err;
  }
}

module.exports = { sign, requireAuth };
