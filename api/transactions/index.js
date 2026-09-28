const crypto = require('crypto');
const { sql, ensureSchema } = require('../_lib/db');
const { requireAuth } = require('../_lib/auth');

const toApi = (r) => ({
  id: r.id, type: r.type, amount: Number(r.amount), category: r.category,
  accountId: r.account_id, toAccountId: r.to_account_id, personId: r.person_id,
  date: r.date, desc: r.desc,
});

module.exports = async (req, res) => {
  try {
    await ensureSchema();
    const uid = requireAuth(req);
    if (req.method === 'GET') {
      const r = await sql`SELECT * FROM transactions WHERE user_id = ${uid} ORDER BY date DESC, created_at DESC`;
      return res.status(200).json(r.map(toApi));
    }
    if (req.method === 'POST') {
      const b = req.body || {};
      if (!b.type || !b.amount) return res.status(400).json({ error: 'Type and amount are required' });
      const id = crypto.randomBytes(9).toString('hex');
      await sql`INSERT INTO transactions (id, user_id, type, amount, category, account_id, to_account_id, person_id, date, "desc")
        VALUES (${id}, ${uid}, ${b.type}, ${b.amount}, ${b.category || null}, ${b.accountId || null}, ${b.toAccountId || null}, ${b.personId || null}, ${b.date || null}, ${b.desc || ''})`;
      return res.status(201).json({ id, ...b });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Something went wrong' });
  }
};
