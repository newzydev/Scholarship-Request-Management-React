import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRequests } from '../../api/requests';
import { fetchScholarshipTypes } from '../../api/publicApi';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
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
  }, [page, search, status, type]);

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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">รายการคำขอทุนการศึกษา</h4>
        <Link to="/admin/requests/new" className="btn btn-primary">
          + เพิ่มคำขอทุน
        </Link>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-5">
              <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="ค้นหาชื่อหรือรหัสนักศึกษา..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" className="btn btn-outline-secondary">
                  ค้นหา
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
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
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
                  <td colSpan={7} className="text-center py-4 text-muted">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              )}
              {!loading && data.items.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
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
                      <div className="text-muted small">{item.student_id}</div>
                    </td>
                    <td>{item.scholarship_type_name}</td>
                    <td className="text-end">{formatAmount(item.amount_requested)}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>{formatDate(item.submitted_at)}</td>
                    <td className="text-end">
                      <Link to={`/admin/requests/${item.id}/edit`} className="btn btn-sm btn-outline-primary">
                        แก้ไข
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <span className="text-muted small">ทั้งหมด {data.total} รายการ</span>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
