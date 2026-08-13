import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import StaffForm from '../../components/StaffForm';
import { fetchStaffById, createStaff, updateStaff } from '../../api/staff';

export default function StaffFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
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
  );
}
