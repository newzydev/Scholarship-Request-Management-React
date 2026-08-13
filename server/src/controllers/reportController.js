import ExcelJS from 'exceljs';
import { reportSummary, reportDetails, reportDetailsAll } from '../models/requestModel.js';
import { maskBankAccount } from '../utils/mask.js';

const VALID_STATUSES = ['pending', 'approved', 'rejected'];
const STATUS_LABELS_TH = { pending: 'รอพิจารณา', approved: 'อนุมัติ', rejected: 'ไม่อนุมัติ' };

const parseFilters = (queryParams) => ({
  dateFrom: queryParams.dateFrom || '',
  dateTo: queryParams.dateTo || '',
  status: VALID_STATUSES.includes(queryParams.status) ? queryParams.status : '',
  typeId: queryParams.type ? Number(queryParams.type) : '',
});

export const summary = async (req, res) => {
  const data = await reportSummary(parseFilters(req.query));
  res.json(data);
};

export const details = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = Math.min(1000, Math.max(1, parseInt(req.query.pageSize, 10) || 10));

  const result = await reportDetails({ ...parseFilters(req.query), page, pageSize });
  // Data masking (bonus): mask sensitive bank account number, consistent with the request list view
  result.items = result.items.map((item) => ({
    ...item,
    bank_account_no: maskBankAccount(item.bank_account_no),
  }));
  res.json(result);
};

export const exportExcel = async (req, res) => {
  const filters = parseFilters(req.query);
  const [data, items] = await Promise.all([reportSummary(filters), reportDetailsAll(filters)]);

  const workbook = new ExcelJS.Workbook();

  const summarySheet = workbook.addWorksheet('สรุปตามประเภททุน');
  summarySheet.columns = [
    { header: 'ประเภททุน', key: 'name_th', width: 32 },
    { header: 'จำนวนคำขอ', key: 'count', width: 14 },
    { header: 'ยอดเงินรวมที่ขอ (บาท)', key: 'total_amount', width: 22 },
  ];
  data.byType.forEach((t) => summarySheet.addRow({ ...t, total_amount: Number(t.total_amount) }));
  summarySheet.addRow({});
  summarySheet.addRow({ name_th: 'รวมทั้งหมด', count: data.total, total_amount: Number(data.totalAmount) });
  summarySheet.getColumn('total_amount').numFmt = '#,##0.00';

  const detailSheet = workbook.addWorksheet('รายการละเอียด');
  detailSheet.columns = [
    { header: 'เลขที่คำขอ', key: 'request_no', width: 18 },
    { header: 'ชื่อ-สกุล', key: 'full_name', width: 24 },
    { header: 'รหัสนักศึกษา', key: 'student_id', width: 16 },
    { header: 'ประเภททุน', key: 'scholarship_type_name', width: 28 },
    { header: 'จำนวนเงินที่ขอ (บาท)', key: 'amount_requested', width: 20 },
    { header: 'สถานะ', key: 'status_label', width: 14 },
    { header: 'วันที่ยื่น', key: 'submitted_at', width: 18 },
  ];
  items.forEach((item) =>
    detailSheet.addRow({
      request_no: item.request_no,
      full_name: `${item.first_name} ${item.last_name}`,
      student_id: item.student_id,
      scholarship_type_name: item.scholarship_type_name,
      amount_requested: Number(item.amount_requested),
      status_label: STATUS_LABELS_TH[item.status] || item.status,
      submitted_at: new Date(item.submitted_at).toLocaleDateString('th-TH'),
    })
  );
  detailSheet.getColumn('amount_requested').numFmt = '#,##0.00';

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="scholarship-report-${new Date().toISOString().slice(0, 10)}.xlsx"`
  );
  await workbook.xlsx.write(res);
  res.end();
};
