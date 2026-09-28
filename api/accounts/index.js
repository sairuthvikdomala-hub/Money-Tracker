const crypto = require('crypto');
const { sql, ensureSchema } = require('../_lib/db');
const { requireAuth } = require('../_lib/auth');

const toApi = (r) => ({ id: r.id, name: r.name, type: r.type, initial: Number(r.initial) });

module.exports = async (req, res) => {
  try {
    await ensureSchema();
    const uid = requireAuth(req);
    if (req.method === 'GET') {
      const r = await sql`SELECT * FROM accounts WHERE user_id = ${uid} ORDER BY created_at`;
      return res.status(200).json(r.map(toApi));
    }
    if (req.method === 'POST') {
      const { name, type, initial } = req.body || {};
      if (!name) return res.status(400).json({ error: 'Account name is required' });
      const id = crypto.randomBytes(9).toString('hex');
      await sql`INSERT INTO accounts (id, user_id, name, type, initial) VALUES (${id}, ${uid}, ${name}, ${type || 'Other'}, ${initial || 0})`;
      return res.status(201).json({ id, name, type: type || 'Other', initial: initial || 0 });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Something went wrong' });
  }
};
