const bcrypt = require('bcryptjs');
const { sql, ensureSchema } = require('../_lib/db');
const { sign } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await ensureSchema();

    const { email, password } = req.body || {};

    console.log('LOGIN: request received');
    console.log('LOGIN: email:', email);

    const r = await sql`
      SELECT * FROM users
      WHERE email = ${(email || '').toLowerCase()}
    `;

    console.log('LOGIN: query completed');
    console.log('LOGIN: users found:', r.length);

    const user = r[0];

    if (!user) {
      console.log('LOGIN: user not found');
      return res.status(401).json({
        error: 'Incorrect email or password'
      });
    }

    console.log('LOGIN: user found:', user.id);

    const passwordValid = bcrypt.compareSync(
      password || '',
      user.password_hash
    );

    console.log('LOGIN: password valid:', passwordValid);

    if (!passwordValid) {
      return res.status(401).json({
        error: 'Incorrect email or password'
      });
    }

    console.log('LOGIN: creating token');

    const token = sign(user.id);

    console.log('LOGIN: token created:', !!token);

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (e) {
    console.error('LOGIN ERROR:', e);

    return res.status(e.status || 500).json({
      error: e.message || 'Something went wrong'
    });
  }
};
