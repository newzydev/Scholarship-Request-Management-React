import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'bootstrap';
import { fetchStaffList, deleteStaff } from '../../api/staff';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/ConfirmModal';

export default function StaffListPage() {
  const { staff: currentStaff } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const tableRef = useRef(null);

  const loadItems = () => {
    setLoading(true);
    fetchStaffList()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (!tableRef.current) return undefined;
    const triggers = [...tableRef.current.querySelectorAll('[data-bs-toggle="tooltip"]')];
    const tooltips = triggers.map((el) => new Tooltip(el));
    return () => tooltips.forEach((t) => t.dispose());
  }, [items]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteStaff(deleteTarget.id);
      setDeleteTarget(null);
      loadItems();
    } catch (err) {
      setDeleteError(err.message || 'ไม่สามารถลบบัญชีนี้ได้');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      {deleteError && <div className="alert alert-danger">{deleteError}</div>}

      <div className="card card-primary card-outline">
        <div className="card-header">
          <h3 className="card-title">
            <i className="bi bi-people-fill me-2" aria-hidden="true"></i>
            จัดการเจ้าหน้าที่
          </h3>
          <div className="card-tools">
            <Link to="/admin/staff/new" className="btn btn-primary btn-sm">
              <i className="bi bi-plus-lg me-1" aria-hidden="true"></i>
              เพิ่มเจ้าหน้าที่
            </Link>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive" ref={tableRef}>
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>ชื่อ-นามสกุล</th>
                  <th>ชื่อผู้ใช้</th>
                  <th>วันที่สร้างบัญชี</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-secondary">
                      กำลังโหลดข้อมูล...
                    </td>
                  </tr>
                )}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-secondary">
                      ไม่พบข้อมูลเจ้าหน้าที่
                    </td>
                  </tr>
                )}
                {!loading &&
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.first_name} {item.last_name}
                      </td>
                      <td>{item.username}</td>
                      <td>{formatDate(item.created_at)}</td>
                      <td className="text-end">
                        <div className="btn-group" role="group">
                          <Link
                            to={`/admin/staff/${item.id}`}
                            className="btn btn-success btn-sm"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="ดูรายละเอียด"
                          >
                            <i className="bi bi-eye" aria-hidden="true"></i>
                          </Link>
                          <Link
                            to={`/admin/staff/${item.id}/edit`}
                            className="btn btn-warning btn-sm"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="แก้ไขบัญชี"
                          >
                            <i className="bi bi-pencil-square" aria-hidden="true"></i>
                          </Link>
                          {currentStaff && String(currentStaff.id) === String(item.id) ? (
                            <span
                              className="d-inline-block"
                              style={{ marginLeft: 'calc(var(--bs-border-width) * -1)' }}
                              tabIndex={0}
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="ไม่สามารถลบบัญชีของตนเองที่กำลังใช้งานอยู่ได้"
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
                          ) : (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="ลบบัญชี"
                              onClick={() => setDeleteTarget(item)}
                            >
                              <i className="bi bi-trash3" aria-hidden="true"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer">
          <span className="text-secondary small">ทั้งหมด {items.length} คน</span>
        </div>
      </div>

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="ยืนยันการลบบัญชีเจ้าหน้าที่"
        message={`ต้องการลบบัญชีเจ้าหน้าที่ "${deleteTarget?.username || ''}" ใช่หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้`}
        confirmText="ลบบัญชี"
        confirmVariant="danger"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
