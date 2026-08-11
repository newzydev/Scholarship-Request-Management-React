import {
  listRequests,
  getRequestById,
  createRequest,
  updateRequest,
  updateStatus as updateStatusModel,
  softDeleteRequest,
} from '../models/requestModel.js';
import { maskBankAccount } from '../utils/mask.js';

const VALID_STATUSES = ['pending', 'approved', 'rejected'];

export const list = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = 10;
  const search = (req.query.search || '').trim();
  const status = VALID_STATUSES.includes(req.query.status) ? req.query.status : '';
  const typeId = req.query.type ? Number(req.query.type) : '';

  const result = await listRequests({ page, pageSize, search, status, typeId });
  // Data masking (bonus): mask sensitive bank account number in the list view
  result.items = result.items.map((item) => ({
    ...item,
    bank_account_no: maskBankAccount(item.bank_account_no),
  }));
  res.json(result);
};

export const getOne = async (req, res) => {
  const item = await getRequestById(req.params.id);
  if (!item) return res.status(404).json({ message: 'ไม่พบคำขอทุนนี้' });
  res.json({ item });
};

export const create = async (req, res) => {
  const created = await createRequest(req.body, req.staff.id);
  res.status(201).json({ item: created });
};

export const update = async (req, res) => {
  const existing = await getRequestById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'ไม่พบคำขอทุนนี้' });

  const updated = await updateRequest(req.params.id, req.body);
  res.json({ item: updated });
};

export const changeStatus = async (req, res) => {
  const { status, status_note: statusNote } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'สถานะไม่ถูกต้อง' });
  }
  const existing = await getRequestById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'ไม่พบคำขอทุนนี้' });

  const updated = await updateStatusModel(req.params.id, status, statusNote);
  res.json({ item: updated });
};

export const remove = async (req, res) => {
  const existing = await getRequestById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'ไม่พบคำขอทุนนี้' });
  if (existing.status !== 'pending') {
    return res.status(400).json({ message: 'ลบได้เฉพาะคำขอที่อยู่ในสถานะ "รอพิจารณา" เท่านั้น' });
  }

  const deleted = await softDeleteRequest(req.params.id);
  if (!deleted) {
    return res.status(400).json({ message: 'ไม่สามารถลบคำขอนี้ได้' });
  }
  res.json({ message: 'ลบคำขอทุนเรียบร้อยแล้ว' });
};
