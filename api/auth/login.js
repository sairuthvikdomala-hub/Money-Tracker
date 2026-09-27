const bcrypt = require('bcryptjs');
const { sql, ensureSchema } = require('../_lib/db');
const { sign } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    await ensureSchema();
    const { email, password } = req.body || {};
    const r = await sql`SELECT * FROM users WHERE email = ${(email || '').toLowerCase()}`;
    const user = r[0]; 
    if (!user || !bcrypt.compareSync(password || '', user.password_hash)) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }
    res.status(200).json({ token: sign(user.id), user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Something went wrong' });
  }
};
