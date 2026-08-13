import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ScholarshipRequestForm from '../../components/ScholarshipRequestForm';
import { fetchRequestById, createRequest, updateRequest } from '../../api/requests';

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

  const loadRequest = () => {
    setLoading(true);
    fetchRequestById(id)
      .then(setInitialValues)
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
  );
}
