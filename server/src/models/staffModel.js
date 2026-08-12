import { query } from '../config/db.js';

export const findStaffByUsername = async (username) => {
  const { rows } = await query(
    'SELECT id, first_name, last_name, username, password_hash FROM staff WHERE username = $1 AND deleted_at IS NULL',
    [username]
  );
  return rows[0] || null;
};

export const findStaffById = async (id) => {
  const { rows } = await query(
    'SELECT id, first_name, last_name, username FROM staff WHERE id = $1 AND deleted_at IS NULL',
    [id]
  );
  return rows[0] || null;
};

export const listStaff = async () => {
  const { rows } = await query(
    `SELECT id, first_name, last_name, username, created_at
     FROM staff WHERE deleted_at IS NULL ORDER BY created_at DESC`
  );
  return rows;
};

export const isUsernameTaken = async (username, excludeId = null) => {
  const { rows } = await query(
    `SELECT id FROM staff WHERE username = $1 AND deleted_at IS NULL AND id IS DISTINCT FROM $2`,
    [username, excludeId]
  );
  return rows.length > 0;
};

export const createStaff = async ({ firstName, lastName, username, passwordHash }) => {
  const { rows } = await query(
    `INSERT INTO staff (first_name, last_name, username, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [firstName, lastName, username, passwordHash]
  );
  return findStaffById(rows[0].id);
};

export const updateStaff = async (id, { firstName, lastName, username, passwordHash }) => {
  if (passwordHash) {
    await query(
      `UPDATE staff SET first_name=$1, last_name=$2, username=$3, password_hash=$4
       WHERE id=$5 AND deleted_at IS NULL`,
      [firstName, lastName, username, passwordHash, id]
    );
  } else {
    await query(
      `UPDATE staff SET first_name=$1, last_name=$2, username=$3
       WHERE id=$4 AND deleted_at IS NULL`,
      [firstName, lastName, username, id]
    );
  }
  return findStaffById(id);
};

export const softDeleteStaff = async (id) => {
  const { rows } = await query(
    `UPDATE staff SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
    [id]
  );
  return rows[0] || null;
};
