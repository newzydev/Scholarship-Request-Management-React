import { useEffect, useState } from 'react';
import { fetchReportSummary, fetchReportDetails, downloadReportExcel } from '../../api/reports';
import { fetchScholarshipTypes } from '../../api/publicApi';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import { STATUS_LABELS } from '../../constants';

const STATUS_BOX_CLASS = {
  pending: 'text-bg-warning',
  approved: 'text-bg-success',
  rejected: 'text-bg-danger',
};

const STATUS_ICON = {
  pending: 'bi-hourglass-split',
  approved: 'bi-check-circle-fill',
  rejected: 'bi-x-circle-fill',
};

export default function ReportPage() {
  const [types, setTypes] = useState([]);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState('');

  const [detail, setDetail] = useState({ items: [], total: 0, page: 1, totalPages: 1 });
  const [detailLoading, setDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState('');

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  useEffect(() => {
    fetchScholarshipTypes().then(setTypes);
  }, []);

  useEffect(() => {
    setSummaryLoading(true);
    setSummaryError('');
    fetchReportSummary({ dateFrom, dateTo, status, type })
      .then(setSummary)
      .catch((err) => setSummaryError(err.message))
      .finally(() => setSummaryLoading(false));
  }, [dateFrom, dateTo, status, type]);

  useEffect(() => {
    setDetailLoading(true);
    setDetailError('');
    fetchReportDetails({ page, dateFrom, dateTo, status, type })
      .then(setDetail)
      .catch((err) => setDetailError(err.message))
      .finally(() => setDetailLoading(false));
  }, [page, dateFrom, dateTo, status, type]);

  const resetPageAnd = (setter) => (e) => {
    setPage(1);
    setter(e.target.value);
  };

  const handleExport = async () => {
    setExporting(true);
    setExportError('');
    try {
      await downloadReportExcel({ dateFrom, dateTo, status, type });
    } catch (err) {
      setExportError(err.message || 'ไม่สามารถ export ข้อมูลได้');
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

  const formatAmount = (n) => Number(n).toLocaleString('th-TH', { minimumFractionDigits: 2 });

  const byStatusMap = summary
    ? Object.fromEntries(summary.byStatus.map((s) => [s.status, s.count]))
    : {};

  const filterSummaryText = [
    dateFrom && `ตั้งแต่ ${dateFrom}`,
    dateTo && `ถึง ${dateTo}`,
    status && `สถานะ: ${STATUS_LABELS[status]}`,
    type && `ประเภททุน: ${types.find((t) => String(t.id) === String(type))?.name_th || ''}`,
  ]
    .filter(Boolean)
    .join(' | ');

  return (
    <div>
      {/* Print-only header: hidden on screen, shown via @media print (index.css) */}
      <div className="d-none d-print-block mb-3">
        <h4 className="mb-1">รายงานสรุปคำขอทุนการศึกษา</h4>
        {filterSummaryText && <div className="text-secondary small">เงื่อนไข: {filterSummaryText}</div>}
        <div className="text-secondary small">พิมพ์เมื่อ {new Date().toLocaleString('th-TH')}</div>
      </div>

      {summaryError && <div className="alert alert-danger d-print-none">{summaryError}</div>}
      {detailError && <div className="alert alert-danger d-print-none">{detailError}</div>}
      {exportError && <div className="alert alert-danger d-print-none">{exportError}</div>}

      <div className="card card-primary card-outline mb-3 d-print-none">
        <div className="card-header">
          <h3 className="card-title">
            <i className="bi bi-funnel me-2" aria-hidden="true"></i>
            เงื่อนไขรายงาน
          </h3>
          <div className="card-tools d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => window.print()}
            >
              <i className="bi bi-printer me-1" aria-hidden="true"></i>
              พิมพ์รายงาน
            </button>
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={handleExport}
              disabled={exporting}
            >
              <i className="bi bi-file-earmark-excel me-1" aria-hidden="true"></i>
              {exporting ? 'กำลัง Export...' : 'Export Excel'}
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label small mb-1">วันที่ยื่นตั้งแต่</label>
              <input
                type="date"
                className="form-control"
                value={dateFrom}
                onChange={resetPageAnd(setDateFrom)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small mb-1">ถึงวันที่</label>
              <input
                type="date"
                className="form-control"
                value={dateTo}
                onChange={resetPageAnd(setDateTo)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small mb-1">สถานะ</label>
              <select className="form-select" value={status} onChange={resetPageAnd(setStatus)}>
                <option value="">ทุกสถานะ</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small mb-1">ประเภททุน</label>
              <select className="form-select" value={type} onChange={resetPageAnd(setType)}>
                <option value="">ทุกประเภททุน</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name_th}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {summaryLoading ? (
        <div className="d-flex justify-content-center py-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        summary && (
          <>
            <div className="row g-3 mb-2">
              <div className="col-lg-3 col-6">
                <div className="small-box text-bg-primary">
                  <div className="inner">
                    <h3>{summary.total}</h3>
                    <p>คำขอทั้งหมด</p>
                  </div>
                  <i className="bi bi-collection-fill small-box-icon" aria-hidden="true"></i>
                </div>
              </div>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <div className="col-lg-3 col-6" key={key}>
                  <div className={`small-box ${STATUS_BOX_CLASS[key]}`}>
                    <div className="inner">
                      <h3>{byStatusMap[key] || 0}</h3>
                      <p>{label}</p>
                    </div>
                    <i className={`bi ${STATUS_ICON[key]} small-box-icon`} aria-hidden="true"></i>
                  </div>
                </div>
              ))}
            </div>

            <div className="card mb-3">
              <div className="card-header">
                <h3 className="card-title">สรุปจำนวนคำขอและยอดเงินรวม แยกตามประเภททุน</h3>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>ประเภททุน</th>
                        <th className="text-end">จำนวนคำขอ</th>
                        <th className="text-end">ยอดเงินรวมที่ขอ (บาท)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.byType.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-3 text-secondary">
                            ไม่พบข้อมูล
                          </td>
                        </tr>
                      )}
                      {summary.byType.map((t) => (
                        <tr key={t.code}>
                          <td>{t.name_th}</td>
                          <td className="text-end">{t.count}</td>
                          <td className="text-end">{formatAmount(t.total_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="fw-semibold">
                        <td>รวมทั้งหมด</td>
                        <td className="text-end">{summary.total}</td>
                        <td className="text-end">{formatAmount(summary.totalAmount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </>
        )
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">รายการละเอียด</h3>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>เลขที่คำขอ</th>
                  <th>ชื่อ-รหัสนักศึกษา</th>
                  <th>ประเภททุน</th>
                  <th className="text-end">จำนวนเงินที่ขอ</th>
                  <th>สถานะ</th>
                  <th>วันที่ยื่น</th>
                </tr>
              </thead>
              <tbody>
                {detailLoading && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-secondary">
                      กำลังโหลดข้อมูล...
                    </td>
                  </tr>
                )}
                {!detailLoading && detail.items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-secondary">
                      ไม่พบรายการคำขอทุน
                    </td>
                  </tr>
                )}
                {!detailLoading &&
                  detail.items.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold">{item.request_no}</td>
                      <td>
                        {item.first_name} {item.last_name}
                        <div className="text-secondary small">{item.student_id}</div>
                      </td>
                      <td>{item.scholarship_type_name}</td>
                      <td className="text-end">{formatAmount(item.amount_requested)}</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td>{formatDate(item.submitted_at)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center d-print-none">
          <span className="text-secondary small">ทั้งหมด {detail.total} รายการ</span>
          <Pagination page={detail.page} totalPages={detail.totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
