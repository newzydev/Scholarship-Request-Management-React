import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { findStaffByUsername, findStaffById } from '../models/staffModel.js';

const COOKIE_NAME = 'token';

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: env.nodeEnv === 'production',
  maxAge: 8 * 60 * 60 * 1000, // 8 hours
});

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
  }

  const staff = await findStaffByUsername(username);
  if (!staff) {
    return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  }

  const isMatch = await bcrypt.compare(password, staff.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  }

  const token = jwt.sign({ sub: staff.id, username: staff.username }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  res.cookie(COOKIE_NAME, token, cookieOptions());
  res.json({
    staff: {
      id: staff.id,
      username: staff.username,
      firstName: staff.first_name,
      lastName: staff.last_name,
    },
  });
};

export const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions());
  res.json({ message: 'ออกจากระบบเรียบร้อย' });
};

export const me = async (req, res) => {
  const staff = await findStaffById(req.staff.id);
  if (!staff) {
    return res.status(401).json({ message: 'ไม่พบข้อมูลผู้ใช้' });
  }
  res.json({
    staff: {
      id: staff.id,
      username: staff.username,
      firstName: staff.first_name,
      lastName: staff.last_name,
    },
  });
};
