import bcrypt from 'bcryptjs';
import {
  listStaff,
  findStaffById,
  createStaff,
  updateStaff,
  softDeleteStaff,
} from '../models/staffModel.js';

const SALT_ROUNDS = 10;

export const list = async (req, res) => {
  const items = await listStaff();
  res.json({ items });
};

export const getOne = async (req, res) => {
  const item = await findStaffById(req.params.id);
  if (!item) return res.status(404).json({ message: 'ไม่พบเจ้าหน้าที่นี้' });
  res.json({ item });
};

export const create = async (req, res) => {
  const { first_name: firstName, last_name: lastName, username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const created = await createStaff({ firstName, lastName, username, passwordHash });
  res.status(201).json({ item: created });
};

export const update = async (req, res) => {
  const existing = await findStaffById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'ไม่พบเจ้าหน้าที่นี้' });

  const { first_name: firstName, last_name: lastName, username, password } = req.body;
  const passwordHash = password ? await bcrypt.hash(password, SALT_ROUNDS) : null;
  const updated = await updateStaff(req.params.id, { firstName, lastName, username, passwordHash });
  res.json({ item: updated });
};

export const remove = async (req, res) => {
  if (String(req.staff.id) === String(req.params.id)) {
    return res.status(400).json({ message: 'ไม่สามารถลบบัญชีของตนเองที่กำลังใช้งานอยู่ได้' });
  }

  const existing = await findStaffById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'ไม่พบเจ้าหน้าที่นี้' });

  await softDeleteStaff(req.params.id);
  res.json({ message: 'ลบบัญชีเจ้าหน้าที่เรียบร้อยแล้ว' });
};
