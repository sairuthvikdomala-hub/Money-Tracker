const { sql, ensureSchema } = require('./_lib/db');
const { requireAuth } = require('./_lib/auth');

module.exports = async (req, res) => {
  try {
    await ensureSchema();
    const uid = requireAuth(req);
    const r = await sql`SELECT id, name, email FROM users WHERE id = ${uid}`;
    if (!r.rows.length) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(r[0]);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Something went wrong' });
  }
};
