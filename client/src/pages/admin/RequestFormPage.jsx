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
      {deleteError && <div className="alert alert-danger">{deleteError}</div>}

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card card-primary card-outline">
            <div className="card-header">
              <h3 className="card-title">
                {isEdit ? (
                  <>
                    <i className="bi bi-pencil-square me-2" aria-hidden="true"></i>
                    แก้ไขคำขอทุน {initialValues?.request_no || ''}
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle me-2" aria-hidden="true"></i>
                    เพิ่มคำขอทุนใหม่
                  </>
                )}
              </h3>
              <div className="card-tools">
                <Link to="/admin/requests" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>
                  กลับไปยังรายการ
                </Link>
              </div>
            </div>
            <div className="card-body">
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
            <div className="card card-outline mb-3">
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

            <div className="card card-outline card-danger">
              <div className="card-header">
                <h3 className="card-title text-danger">
                  <i className="bi bi-trash3 me-2" aria-hidden="true"></i>
                  ลบคำขอทุน
                </h3>
              </div>
              <div className="card-body">
                <p className="small text-secondary">
                  ลบได้เฉพาะคำขอที่อยู่ในสถานะ &quot;รอพิจารณา&quot; เท่านั้น และเป็นการลบแบบ Soft Delete
                </p>
                <button
                  className="btn btn-outline-danger btn-sm w-100"
                  disabled={initialValues.status !== 'pending'}
                  onClick={() => setShowDeleteModal(true)}
                >
                  <i className="bi bi-trash3 me-1" aria-hidden="true"></i>
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
