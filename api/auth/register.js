const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sql, ensureSchema } = require('../_lib/db');
const { sign } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    await ensureSchema();
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
    if (existing.length) return res.status(409).json({ error: 'An account with that email already exists' });
    const id = crypto.randomBytes(9).toString('hex');
    const hash = bcrypt.hashSync(password, 10);
    await sql`INSERT INTO users (id, name, email, password_hash) VALUES (${id}, ${name}, ${email.toLowerCase()}, ${hash})`;
    res.status(200).json({ token: sign(id), user: { id, name, email: email.toLowerCase() } });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Something went wrong' });
  }
};
