import { db } from '../config/db';
import bcrypt from 'bcrypt';
import { check, validationResult } from 'express-validator';

export async function login(req: any, res: any) {
  try {
    await check('email', 'Email is required').not().isEmpty().run(req);
    await check('password', 'Password is required').not().isEmpty().run(req);
    await check('email', 'Invalid email').isEmail().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const query = 'SELECT * FROM users WHERE email = $1 AND password_hash = $2';
    const values = [email, passwordHash];

    try {
      const users = await db.query(query, values);
      if (users.length === 0) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      res.json({ success: true, token: 'mock-jwt-token' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}