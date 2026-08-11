import { query } from '../config/db.js';

export const listScholarshipTypes = async () => {
  const { rows } = await query('SELECT id, code, name_th FROM scholarship_types ORDER BY id');
  return rows;
};
