const { sql, ensureSchema } = require('../_lib/db');
const { requireAuth } = require('../_lib/auth');

module.exports = async (req, res) => {
  try {
    await ensureSchema();
    const uid = requireAuth(req);
    const { id } = req.query;
    if (req.method === 'DELETE') {
      const r = await sql`DELETE FROM people WHERE id = ${id} AND user_id = ${uid}`;
      if (r.rowCount === 0) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Something went wrong' });
  }
};
