import { query } from '../config/db.js';

const BASE_SELECT = `
  SELECT
    r.id, r.request_no, r.student_id, r.first_name, r.last_name, r.faculty, r.year_level,
    r.gpax, r.email, r.scholarship_type_id, t.code AS scholarship_type_code,
    t.name_th AS scholarship_type_name, r.amount_requested, r.bank_id, bk.code AS bank_code,
    bk.name_th AS bank_name, r.bank_account_no, r.reason, r.pdpa_consent, r.status,
    r.status_note, r.submitted_at, r.created_by, r.updated_at
  FROM scholarship_requests r
  JOIN scholarship_types t ON t.id = r.scholarship_type_id
  JOIN banks bk ON bk.id = r.bank_id
`;

export const listRequests = async ({ page = 1, pageSize = 10, search = '', status = '', typeId = '' }) => {
  const conditions = ['r.deleted_at IS NULL'];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(
      `(r.student_id ILIKE $${params.length} OR r.first_name ILIKE $${params.length} OR r.last_name ILIKE $${params.length} OR (r.first_name || ' ' || r.last_name) ILIKE $${params.length})`
    );
  }
  if (status) {
    params.push(status);
    conditions.push(`r.status = $${params.length}`);
  }
  if (typeId) {
    params.push(typeId);
    conditions.push(`r.scholarship_type_id = $${params.length}`);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const countResult = await query(
    `SELECT count(*) FROM scholarship_requests r ${where}`,
    params
  );
  const total = Number(countResult.rows[0].count);

  const limit = pageSize;
  const offset = (page - 1) * pageSize;
  params.push(limit, offset);

  const { rows } = await query(
    `${BASE_SELECT} ${where} ORDER BY r.submitted_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return {
    items: rows,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
};

export const getRequestById = async (id) => {
  const { rows } = await query(`${BASE_SELECT} WHERE r.id = $1 AND r.deleted_at IS NULL`, [id]);
  return rows[0] || null;
};

export const createRequest = async (data, createdBy = null) => {
  const {
    student_id, first_name, last_name, faculty, year_level, gpax, email,
    scholarship_type_id, amount_requested, bank_id, bank_account_no, reason, pdpa_consent,
  } = data;

  const { rows } = await query(
    `INSERT INTO scholarship_requests
      (request_no, student_id, first_name, last_name, faculty, year_level, gpax, email,
       scholarship_type_id, amount_requested, bank_id, bank_account_no, reason, pdpa_consent, created_by)
     VALUES
      ('SRQ-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('scholarship_request_no_seq')::text, 6, '0'),
       $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING id`,
    [student_id, first_name, last_name, faculty, year_level, gpax, email,
      scholarship_type_id, amount_requested, bank_id, bank_account_no, reason, pdpa_consent, createdBy]
  );
  return getRequestById(rows[0].id);
};

export const updateRequest = async (id, data) => {
  const {
    student_id, first_name, last_name, faculty, year_level, gpax, email,
    scholarship_type_id, amount_requested, bank_id, bank_account_no, reason,
  } = data;

  await query(
    `UPDATE scholarship_requests SET
       student_id=$1, first_name=$2, last_name=$3, faculty=$4, year_level=$5, gpax=$6, email=$7,
       scholarship_type_id=$8, amount_requested=$9, bank_id=$10, bank_account_no=$11, reason=$12
     WHERE id=$13 AND deleted_at IS NULL`,
    [student_id, first_name, last_name, faculty, year_level, gpax, email,
      scholarship_type_id, amount_requested, bank_id, bank_account_no, reason, id]
  );
  return getRequestById(id);
};

export const updateStatus = async (id, status, statusNote) => {
  await query(
    `UPDATE scholarship_requests SET status=$1, status_note=$2 WHERE id=$3 AND deleted_at IS NULL`,
    [status, statusNote || null, id]
  );
  return getRequestById(id);
};

export const softDeleteRequest = async (id) => {
  const { rows } = await query(
    `UPDATE scholarship_requests SET deleted_at = now()
     WHERE id = $1 AND deleted_at IS NULL AND status = 'pending'
     RETURNING id`,
    [id]
  );
  return rows[0] || null;
};

// --- SECTION: Report (filtered by date range / status / type) ---

const buildReportConditions = ({ dateFrom = '', dateTo = '', status = '', typeId = '' }) => {
  const conditions = ['r.deleted_at IS NULL'];
  const params = [];

  if (dateFrom) {
    params.push(dateFrom);
    conditions.push(`r.submitted_at >= $${params.length}::date`);
  }
  if (dateTo) {
    params.push(dateTo);
    conditions.push(`r.submitted_at < ($${params.length}::date + interval '1 day')`);
  }
  if (status) {
    params.push(status);
    conditions.push(`r.status = $${params.length}`);
  }
  if (typeId) {
    params.push(typeId);
    conditions.push(`r.scholarship_type_id = $${params.length}`);
  }

  return { where: `WHERE ${conditions.join(' AND ')}`, params };
};

export const reportSummary = async (filters) => {
  const { where, params } = buildReportConditions(filters);

  const totalsByStatus = await query(
    `SELECT r.status, count(*)::int AS count,
            COALESCE(SUM(r.amount_requested), 0)::numeric AS total_amount
     FROM scholarship_requests r ${where}
     GROUP BY r.status`,
    params
  );

  const totalsByType = await query(
    `SELECT t.id, t.code, t.name_th, count(r.id)::int AS count,
            COALESCE(SUM(r.amount_requested), 0)::numeric AS total_amount
     FROM scholarship_requests r
     JOIN scholarship_types t ON t.id = r.scholarship_type_id
     ${where}
     GROUP BY t.id, t.code, t.name_th
     ORDER BY t.id`,
    params
  );

  const totalResult = await query(
    `SELECT count(*)::int AS count,
            COALESCE(SUM(r.amount_requested), 0)::numeric AS total_amount
     FROM scholarship_requests r ${where}`,
    params
  );

  return {
    total: totalResult.rows[0].count,
    totalAmount: totalResult.rows[0].total_amount,
    byStatus: totalsByStatus.rows,
    byType: totalsByType.rows,
  };
};

export const reportDetails = async ({ page = 1, pageSize = 10, ...filters }) => {
  const { where, params } = buildReportConditions(filters);

  const countResult = await query(`SELECT count(*) FROM scholarship_requests r ${where}`, params);
  const total = Number(countResult.rows[0].count);

  const listParams = [...params, pageSize, (page - 1) * pageSize];

  const { rows } = await query(
    `${BASE_SELECT} ${where} ORDER BY r.submitted_at DESC LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
    listParams
  );

  return {
    items: rows,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
};

// Used for Excel export: all matching rows in one go (capped to avoid unbounded memory use)
const REPORT_EXPORT_MAX_ROWS = 5000;

export const reportDetailsAll = async (filters) => {
  const { where, params } = buildReportConditions(filters);

  const { rows } = await query(
    `${BASE_SELECT} ${where} ORDER BY r.submitted_at DESC LIMIT ${REPORT_EXPORT_MAX_ROWS}`,
    params
  );

  return rows;
};

export const dashboardSummary = async () => {
  const totalsByStatus = await query(
    `SELECT status, count(*)::int AS count
     FROM scholarship_requests WHERE deleted_at IS NULL GROUP BY status`
  );
  const totalsByType = await query(
    `SELECT t.code, t.name_th, count(r.id)::int AS count,
            COALESCE(SUM(r.amount_requested), 0)::numeric AS total_amount
     FROM scholarship_types t
     LEFT JOIN scholarship_requests r ON r.scholarship_type_id = t.id AND r.deleted_at IS NULL
     GROUP BY t.id, t.code, t.name_th
     ORDER BY t.id`
  );
  const totalResult = await query(
    `SELECT count(*)::int AS count FROM scholarship_requests WHERE deleted_at IS NULL`
  );

  return {
    total: totalResult.rows[0].count,
    byStatus: totalsByStatus.rows,
    byType: totalsByType.rows,
  };
};
