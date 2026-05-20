import { db } from '../config/db';
import bcrypt from 'bcrypt';
import { check, validationResult, matchedData } from 'express-validator';
import { encrypt, decrypt } from '../utils/encryption';

export async function login(req: any, res: any) {
  try {
    await check('email', 'Email is required').not().isEmpty().isEmail().run(req);
    await check('password', 'Password is required').not().isEmpty().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = matchedData(req, { locations: ['body'] });

    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = TRUE';
    const values = [email];

    try {
      const users = await db.query(query, values);
      if (users.length === 0) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const storedPasswordHash = users[0].password_hash;
      const isValidPassword = await bcrypt.compare(password, storedPasswordHash);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Encrypt sensitive data before sending it back to the client
      const encryptedUserData = encrypt(JSON.stringify({
        id: users[0].id,
        email: users[0].email
      }));

      res.json({ success: true, token: 'mock-jwt-token', userData: encryptedUserData });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}