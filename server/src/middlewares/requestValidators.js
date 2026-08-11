import { body } from 'express-validator';
import { query } from '../config/db.js';

const typeExists = async (typeId) => {
  const { rows } = await query('SELECT 1 FROM scholarship_types WHERE id = $1', [typeId]);
  if (rows.length === 0) throw new Error('ไม่พบประเภททุนที่เลือก');
  return true;
};

// Shared field rules used by both the public submission form and the staff add/edit form,
// per exam spec 3.2(ง): staff form must validate the same way as the student form.
export const scholarshipRequestRules = (requirePdpaConsent) => [
  body('student_id').trim().notEmpty().withMessage('กรุณากรอกรหัสนักศึกษา'),
  body('first_name').trim().notEmpty().withMessage('กรุณากรอกชื่อ'),
  body('last_name').trim().notEmpty().withMessage('กรุณากรอกนามสกุล'),
  body('faculty').trim().notEmpty().withMessage('กรุณากรอกคณะ/สาขา'),
  body('year_level').isInt({ min: 1, max: 8 }).withMessage('ชั้นปีต้องเป็นตัวเลข 1-8'),
  body('gpax').isFloat({ min: 0, max: 4 }).withMessage('เกรดเฉลี่ยต้องอยู่ระหว่าง 0.00-4.00'),
  body('email').trim().isEmail().withMessage('รูปแบบอีเมลไม่ถูกต้อง'),
  body('scholarship_type_id').isInt().withMessage('กรุณาเลือกประเภททุน').bail().custom(typeExists),
  body('amount_requested').isFloat({ gt: 0 }).withMessage('จำนวนเงินที่ขอต้องมากกว่า 0'),
  body('bank_account_no').trim().notEmpty().withMessage('กรุณากรอกเลขที่บัญชีธนาคาร'),
  body('reason').trim().notEmpty().withMessage('กรุณากรอกเหตุผลการขอทุน'),
  ...(requirePdpaConsent
    ? [
        body('pdpa_consent')
          .custom((value) => value === true)
          .withMessage('กรุณายืนยันความยินยอมการเก็บและใช้ข้อมูลส่วนบุคคล (PDPA)'),
      ]
    : []),
];
