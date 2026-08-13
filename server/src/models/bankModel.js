import { query } from '../config/db.js';

export const listBanks = async () => {
  const { rows } = await query('SELECT id, code, name_th FROM banks ORDER BY id');
  return rows;
};
