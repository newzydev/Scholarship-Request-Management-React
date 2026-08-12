import { body } from 'express-validator';
import { isUsernameTaken } from '../models/staffModel.js';

const usernameNotTaken = async (username, { req }) => {
  const excludeId = req.params.id || null;
  const taken = await isUsernameTaken(username, excludeId);
  if (taken) throw new Error('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่อผู้ใช้อื่น');
  return true;
};

export const staffCreateRules = [
  body('first_name').trim().notEmpty().withMessage('กรุณากรอกชื่อ'),
  body('last_name').trim().notEmpty().withMessage('กรุณากรอกนามสกุล'),
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร')
    .bail()
    .matches(/^[a-zA-Z0-9_.]+$/)
    .withMessage('ชื่อผู้ใช้ใช้ได้เฉพาะตัวอักษรอังกฤษ ตัวเลข จุด และขีดล่าง')
    .bail()
    .custom(usernameNotTaken),
  body('password')
    .isLength({ min: 6 })
    .withMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
];

export const staffUpdateRules = [
  body('first_name').trim().notEmpty().withMessage('กรุณากรอกชื่อ'),
  body('last_name').trim().notEmpty().withMessage('กรุณากรอกนามสกุล'),
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร')
    .bail()
    .matches(/^[a-zA-Z0-9_.]+$/)
    .withMessage('ชื่อผู้ใช้ใช้ได้เฉพาะตัวอักษรอังกฤษ ตัวเลข จุด และขีดล่าง')
    .bail()
    .custom(usernameNotTaken),
  body('password')
    .optional({ values: 'falsy' })
    .isLength({ min: 6 })
    .withMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร (เว้นว่างไว้หากไม่ต้องการเปลี่ยน)'),
];
