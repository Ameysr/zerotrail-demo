import { db } from "../config/db";
import bcrypt from "bcrypt";

export async function login(req: any, res: any) {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const query = "SELECT * FROM users WHERE email = $1 AND password_hash = $2";
  const values = [email, passwordHash];

  try {
    const users = await db.query(query, values);
    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    res.json({ success: true, token: "mock-jwt-token" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}