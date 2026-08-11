import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ScholarshipRequestForm from '../../components/ScholarshipRequestForm';
import ConfirmModal from '../../components/ConfirmModal';
import StatusBadge from '../../components/StatusBadge';
import {
  fetchRequestById,
  createRequest,
  updateRequest,
  changeRequestStatus,
  deleteRequest,
} from '../../api/requests';
import { STATUS_LABELS } from '../../constants';

export default function RequestFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [statusValue, setStatusValue] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [statusError, setStatusError] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadRequest = () => {
    setLoading(true);
    fetchRequestById(id)
      .then((item) => {
        setInitialValues(item);
        setStatusValue(item.status);
        setStatusNote(item.status_note || '');
      })
      .catch((err) => setGeneralError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isEdit) loadRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setServerErrors([]);
    setGeneralError('');
    setSuccessMessage('');
    try {
      if (isEdit) {
        const updated = await updateRequest(id, values);
        setInitialValues(updated);
        setSuccessMessage('บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว');
      } else {
        await createRequest(values);
        navigate('/admin/requests');
      }
    } catch (err) {
      setServerErrors(err.fieldErrors || []);
      setGeneralError(err.message || 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setStatusSubmitting(true);
    setStatusError('');
    try {
      const updated = await changeRequestStatus(id, statusValue, statusNote);
      setInitialValues(updated);
    } catch (err) {
      setStatusError(err.message || 'ไม่สามารถเปลี่ยนสถานะได้');
    } finally {
      setStatusSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteRequest(id);
      navigate('/admin/requests');
    } catch (err) {
      setDeleteError(err.message || 'ไม่สามารถลบคำขอนี้ได้');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">{isEdit ? `แก้ไขคำขอทุน ${initialValues?.request_no || ''}` : 'เพิ่มคำขอทุนใหม่'}</h4>
        <Link to="/admin/requests" className="btn btn-outline-secondary btn-sm">
          &larr; กลับไปยังรายการ
        </Link>
      </div>

      {deleteError && <div className="alert alert-danger">{deleteError}</div>}

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              {generalError && <div className="alert alert-danger">{generalError}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              <ScholarshipRequestForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                submitLabel={isEdit ? 'บันทึกการเปลี่ยนแปลง' : 'บันทึก'}
                submitting={submitting}
                serverErrors={serverErrors}
                showConsent={!isEdit}
              />
            </div>
          </div>
        </div>

        {isEdit && (
          <div className="col-lg-4">
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h6 className="card-title">สถานะปัจจุบัน</h6>
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
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-sm btn-primary w-100" disabled={statusSubmitting}>
                    {statusSubmitting ? 'กำลังบันทึก...' : 'บันทึกสถานะ'}
                  </button>
                </form>
              </div>
            </div>

            <div className="card shadow-sm border-danger-subtle">
              <div className="card-body">
                <h6 className="card-title text-danger">ลบคำขอทุน</h6>
                <p className="small text-muted">
                  ลบได้เฉพาะคำขอที่อยู่ในสถานะ &quot;รอพิจารณา&quot; เท่านั้น และเป็นการลบแบบ Soft Delete
                </p>
                <button
                  className="btn btn-outline-danger btn-sm w-100"
                  disabled={initialValues.status !== 'pending'}
                  onClick={() => setShowDeleteModal(true)}
                >
                  ลบคำขอนี้
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        show={showDeleteModal}
        title="ยืนยันการลบคำขอทุน"
        message={`ต้องการลบคำขอทุน ${initialValues?.request_no || ''} ใช่หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้`}
        confirmText="ลบคำขอ"
        confirmVariant="danger"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
