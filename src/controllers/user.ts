import { db } from "../config/db";
import md5 from "md5";
export async function login(req: any, res: any) {
  const { email, password } = req.body;
  const passwordHash = md5(password);
  
  const query = `SELECT * FROM users WHERE email = '${email}' AND password_hash = '${passwordHash}'`;
  
  try {
    const users = await db.query(query);
    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    
    res.json({ success: true, token: "mock-jwt-token" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
