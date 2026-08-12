import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'bootstrap';
import { fetchRequests, deleteRequest } from '../../api/requests';
import { fetchScholarshipTypes } from '../../api/publicApi';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/ConfirmModal';
import { STATUS_LABELS } from '../../constants';

export default function RequestsListPage() {
  const [types, setTypes] = useState([]);
  const [data, setData] = useState({ items: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [refreshIndex, setRefreshIndex] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const tableRef = useRef(null);

  useEffect(() => {
    fetchScholarshipTypes().then(setTypes);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchRequests({ page, search, status, type })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, search, status, type, refreshIndex]);

  useEffect(() => {
    if (!tableRef.current) return undefined;
    const triggers = [...tableRef.current.querySelectorAll('[data-bs-toggle="tooltip"]')];
    const tooltips = triggers.map((el) => new Tooltip(el));
    return () => tooltips.forEach((t) => t.dispose());
  }, [data]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteRequest(deleteTarget.id);
      setDeleteTarget(null);
      setRefreshIndex((i) => i + 1);
    } catch (err) {
      setDeleteError(err.message || 'ไม่สามารถลบคำขอนี้ได้');
    } finally {
      setDeleting(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

  const formatAmount = (n) => Number(n).toLocaleString('th-TH', { minimumFractionDigits: 2 });

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      {deleteError && <div className="alert alert-danger">{deleteError}</div>}

      <div className="card card-primary card-outline">
        <div className="card-header">
          <h3 className="card-title">
            <i className="bi bi-card-list me-2" aria-hidden="true"></i>
            รายการคำขอทุนการศึกษา
          </h3>
          <div className="card-tools">
            <Link to="/admin/requests/new" className="btn btn-primary btn-sm">
              <i className="bi bi-plus-lg me-1" aria-hidden="true"></i>
              เพิ่มคำขอทุน
            </Link>
          </div>
        </div>

        <div className="card-body border-bottom">
          <div className="row g-2 align-items-end">
            <div className="col-md-5">
              <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="ค้นหาชื่อหรือรหัสนักศึกษา..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  autoComplete="off"
                />
                <button type="submit" className="btn btn-outline-secondary">
                  <i className="bi bi-search" aria-hidden="true"></i>
                </button>
              </form>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                autoComplete="off"
              >
                <option value="">ทุกสถานะ</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPage(1);
                }}
                autoComplete="off"
              >
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

        <div className="card-body p-0">
          <div className="table-responsive" ref={tableRef}>
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>เลขที่คำขอ</th>
                  <th>ชื่อ-รหัสนักศึกษา</th>
                  <th>ประเภททุน</th>
                  <th className="text-end">จำนวนเงินที่ขอ</th>
                  <th>สถานะ</th>
                  <th>วันที่ยื่น</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-secondary">
                      กำลังโหลดข้อมูล...
                    </td>
                  </tr>
                )}
                {!loading && data.items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-secondary">
                      ไม่พบรายการคำขอทุน
                    </td>
                  </tr>
                )}
                {!loading &&
                  data.items.map((item) => (
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
                      <td className="text-end">
                        <div className="btn-group" role="group">
                          <Link
                            to={`/admin/requests/${item.id}`}
                            className="btn btn-success btn-sm"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="ดูรายละเอียด"
                          >
                            <i className="bi bi-eye" aria-hidden="true"></i>
                          </Link>
                          <Link
                            to={`/admin/requests/${item.id}/edit`}
                            className="btn btn-warning btn-sm"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="แก้ไขคำขอ"
                          >
                            <i className="bi bi-pencil-square" aria-hidden="true"></i>
                          </Link>
                          {item.status === 'pending' ? (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="ลบคำขอ"
                              onClick={() => setDeleteTarget(item)}
                            >
                              <i className="bi bi-trash3" aria-hidden="true"></i>
                            </button>
                          ) : (
                            <span
                              className="d-inline-block"
                              style={{ marginLeft: 'calc(var(--bs-border-width) * -1)' }}
                              tabIndex={0}
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="ลบได้เฉพาะคำขอที่อยู่ในสถานะรอพิจารณา"
                            >
                              <button
                                type="button"
                                className="btn btn-danger btn-sm rounded-start-0"
                                style={{ pointerEvents: 'none' }}
                                disabled
                              >
                                <i className="bi bi-trash3" aria-hidden="true"></i>
                              </button>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <span className="text-secondary small">ทั้งหมด {data.total} รายการ</span>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </div>
      </div>

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="ยืนยันการลบคำขอทุน"
        message={`ต้องการลบคำขอทุน ${deleteTarget?.request_no || ''} ใช่หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้`}
        confirmText="ลบคำขอ"
        confirmVariant="danger"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
