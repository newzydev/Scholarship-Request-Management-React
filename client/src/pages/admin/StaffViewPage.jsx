import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StaffForm from '../../components/StaffForm';
import { fetchStaffById } from '../../api/staff';

export default function StaffViewPage() {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchStaffById(id)
      .then(setInitialValues)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="card card-primary card-outline">
      <div className="card-header">
        <h3 className="card-title">
          <i className="bi bi-eye me-2" aria-hidden="true"></i>
          ดูบัญชีเจ้าหน้าที่ {initialValues.username}
        </h3>
        <div className="card-tools">
          <Link to="/admin/staff" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>
            กลับไปยังรายการ
          </Link>
        </div>
      </div>
      <div className="card-body">
        {initialValues.created_at && (
          <p className="text-secondary small">
            วันที่สร้างบัญชี: {formatDate(initialValues.created_at)}
          </p>
        )}
        <StaffForm
          initialValues={initialValues}
          onSubmit={() => {}}
          showPassword={false}
          readOnly
          extraActions={
            <Link to={`/admin/staff/${id}/edit`} className="btn btn-primary">
              <i className="bi bi-pencil-square me-1" aria-hidden="true"></i>
              แก้ไขบัญชีนี้
            </Link>
          }
        />
      </div>
    </div>
  );
}
