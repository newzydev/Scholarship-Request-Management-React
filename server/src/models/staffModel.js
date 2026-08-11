import { query } from '../config/db.js';

export const findStaffByUsername = async (username) => {
  const { rows } = await query(
    'SELECT id, first_name, last_name, username, password_hash FROM staff WHERE username = $1',
    [username]
  );
  return rows[0] || null;
};

export const findStaffById = async (id) => {
  const { rows } = await query(
    'SELECT id, first_name, last_name, username FROM staff WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};
