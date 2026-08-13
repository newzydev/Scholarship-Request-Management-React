import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ScholarshipRequestForm from '../../components/ScholarshipRequestForm';
import StatusBadge from '../../components/StatusBadge';
import { fetchRequestById, changeRequestStatus } from '../../api/requests';
import { maskBankAccount } from '../../utils/mask';
import { STATUS_LABELS } from '../../constants';

export default function RequestViewPage() {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusValue, setStatusValue] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [statusError, setStatusError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchRequestById(id)
      .then((item) => {
        setInitialValues({ ...item, bank_account_no: maskBankAccount(item.bank_account_no) });
        setStatusValue(item.status);
        setStatusNote(item.status_note || '');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setStatusSubmitting(true);
    setStatusError('');
    try {
      const updated = await changeRequestStatus(id, statusValue, statusNote);
      setInitialValues({ ...updated, bank_account_no: maskBankAccount(updated.bank_account_no) });
    } catch (err) {
      setStatusError(err.message || 'ไม่สามารถเปลี่ยนสถานะได้');
    } finally {
      setStatusSubmitting(false);
    }
  };

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
    <div className="row g-3">
      <div className="col-lg-8">
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
      </div>

      <div className="col-lg-4">
        <div className="card card-outline">
          <div className="card-header">
            <h3 className="card-title">
              <i className="bi bi-flag me-2" aria-hidden="true"></i>
              สถานะปัจจุบัน
            </h3>
          </div>
          <div className="card-body">
            <StatusBadge status={initialValues.status} />
            <hr />
            {statusError && <div className="alert alert-danger py-2">{statusError}</div>}
            <form onSubmit={handleStatusSubmit}>
              <div className="mb-2">
                <label className="form-label small">เปลี่ยนสถานะ</label>
                <select
                  className="form-select form-select-sm"
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                  autoComplete="off"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label small">หมายเหตุประกอบ</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  placeholder="ระบุหมายเหตุ (ถ้ามี)"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="btn btn-sm btn-primary w-100"
                disabled={statusSubmitting}
              >
                {statusSubmitting ? 'กำลังบันทึก...' : 'บันทึกสถานะ'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
