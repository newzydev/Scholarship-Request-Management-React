import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchStaffList } from '../../api/staff';

export default function StaffListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStaffList()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}

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
          <div className="table-responsive">
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
                        <Link
                          to={`/admin/staff/${item.id}/edit`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-pencil-square me-1" aria-hidden="true"></i>
                          แก้ไข
                        </Link>
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
    </div>
  );
}
