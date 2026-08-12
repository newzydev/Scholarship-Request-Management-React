import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import StaffForm from '../../components/StaffForm';
import ConfirmModal from '../../components/ConfirmModal';
import { useAuth } from '../../context/AuthContext';
import { fetchStaffById, createStaff, updateStaff, deleteStaff } from '../../api/staff';

export default function StaffFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { staff: currentStaff } = useAuth();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const isSelf = isEdit && currentStaff && String(currentStaff.id) === String(id);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    fetchStaffById(id)
      .then(setInitialValues)
      .catch((err) => setGeneralError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setServerErrors([]);
    setGeneralError('');
    setSuccessMessage('');
    try {
      if (isEdit) {
        const updated = await updateStaff(id, payload);
        setInitialValues(updated);
        setSuccessMessage('บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว');
      } else {
        await createStaff(payload);
        navigate('/admin/staff');
      }
    } catch (err) {
      setServerErrors(err.fieldErrors || []);
      setGeneralError(err.message || 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteStaff(id);
      navigate('/admin/staff');
    } catch (err) {
      setDeleteError(err.message || 'ไม่สามารถลบบัญชีนี้ได้');
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
                    แก้ไขบัญชีเจ้าหน้าที่ {initialValues?.username || ''}
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus-fill me-2" aria-hidden="true"></i>
                    เพิ่มเจ้าหน้าที่ใหม่
                  </>
                )}
              </h3>
              <div className="card-tools">
                <Link to="/admin/staff" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>
                  กลับไปยังรายการ
                </Link>
              </div>
            </div>
            <div className="card-body">
              {generalError && <div className="alert alert-danger">{generalError}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}

              <StaffForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                submitLabel={isEdit ? 'บันทึกการเปลี่ยนแปลง' : 'บันทึก'}
                isEdit={isEdit}
                submitting={submitting}
                serverErrors={serverErrors}
              />
            </div>
          </div>
        </div>

        {isEdit && (
          <div className="col-lg-4">
            <div className="card card-outline card-danger">
              <div className="card-header">
                <h3 className="card-title text-danger">
                  <i className="bi bi-trash3 me-2" aria-hidden="true"></i>
                  ลบบัญชีเจ้าหน้าที่
                </h3>
              </div>
              <div className="card-body">
                {isSelf ? (
                  <p className="small text-secondary mb-0">
                    ไม่สามารถลบบัญชีของตนเองที่กำลังใช้งานอยู่ได้
                  </p>
                ) : (
                  <>
                    <p className="small text-secondary">
                      บัญชีที่ถูกลบจะไม่สามารถเข้าสู่ระบบได้อีก แต่ประวัติคำขอทุนที่เคยดำเนินการไว้จะยังคงอยู่
                    </p>
                    <button
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <i className="bi bi-trash3 me-1" aria-hidden="true"></i>
                      ลบบัญชีนี้
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        show={showDeleteModal}
        title="ยืนยันการลบบัญชีเจ้าหน้าที่"
        message={`ต้องการลบบัญชีเจ้าหน้าที่ "${initialValues?.username || ''}" ใช่หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้`}
        confirmText="ลบบัญชี"
        confirmVariant="danger"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
