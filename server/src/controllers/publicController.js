import { listScholarshipTypes } from '../models/typeModel.js';
import { listBanks } from '../models/bankModel.js';
import { createRequest } from '../models/requestModel.js';

export const getScholarshipTypes = async (req, res) => {
  const types = await listScholarshipTypes();
  res.json({ items: types });
};

export const getBanks = async (req, res) => {
  const banks = await listBanks();
  res.json({ items: banks });
};

export const submitRequest = async (req, res) => {
  const created = await createRequest(req.body, null);
  res.status(201).json({
    message: `ส่งคำขอทุนสำเร็จ เลขที่คำขอของท่านคือ ${created.request_no} ระบบได้บันทึกคำขอในสถานะ "รอพิจารณา"`,
    item: created,
  });
};
