const crypto = require('crypto');
const { sql, ensureSchema } = require('../_lib/db');
const { requireAuth } = require('../_lib/auth');

module.exports = async (req, res) => {
  try {
    await ensureSchema();
    const uid = requireAuth(req);
    if (req.method === 'GET') {
      const r = await sql`SELECT id, name FROM people WHERE user_id = ${uid} ORDER BY created_at`;
      return res.status(200).json(r);
    }
    if (req.method === 'POST') {
      const { name } = req.body || {};
      if (!name) return res.status(400).json({ error: 'Name is required' });
      const id = crypto.randomBytes(9).toString('hex');
      await sql`INSERT INTO people (id, user_id, name) VALUES (${id}, ${uid}, ${name})`;
      return res.status(201).json({ id, name });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Something went wrong' });
  }
};
