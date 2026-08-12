import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ScholarshipRequestForm from '../../components/ScholarshipRequestForm';
import StatusBadge from '../../components/StatusBadge';
import { fetchRequestById } from '../../api/requests';
import { maskBankAccount } from '../../utils/mask';

export default function RequestViewPage() {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchRequestById(id)
      .then((item) =>
        setInitialValues({ ...item, bank_account_no: maskBankAccount(item.bank_account_no) })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

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
          ดูคำขอทุน {initialValues.request_no}
        </h3>
        <div className="card-tools">
          <Link to="/admin/requests" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>
            กลับไปยังรายการ
          </Link>
        </div>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <StatusBadge status={initialValues.status} />
        </div>
        <ScholarshipRequestForm
          initialValues={initialValues}
          onSubmit={() => {}}
          showConsent={false}
          readOnly
          extraActions={
            <Link to={`/admin/requests/${id}/edit`} className="btn btn-primary">
              <i className="bi bi-pencil-square me-1" aria-hidden="true"></i>
              แก้ไขคำขอนี้
            </Link>
          }
        />
      </div>
    </div>
  );
}
