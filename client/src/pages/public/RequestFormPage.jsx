import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScholarshipRequestForm from '../../components/ScholarshipRequestForm';
import { submitPublicRequest } from '../../api/publicApi';

export default function RequestFormPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setServerErrors([]);
    setGeneralError('');
    try {
      const data = await submitPublicRequest(values);
      navigate('/success', { state: { message: data.message, requestNo: data.item.request_no } });
    } catch (err) {
      setServerErrors(err.fieldErrors || []);
      setGeneralError(err.message || 'ไม่สามารถส่งคำขอทุนได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <div className="card card-primary card-outline">
          <div className="card-header">
            <h3 className="card-title">
              <i className="bi bi-file-earmark-text me-2" aria-hidden="true"></i>
              แบบฟอร์มยื่นคำขอทุนการศึกษา
            </h3>
          </div>
          <div className="card-body">
            <p className="text-secondary mb-4">
              กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง เจ้าหน้าที่จะดำเนินการตรวจสอบและแจ้งผลผ่านอีเมลที่ระบุ
            </p>
            {generalError && <div className="alert alert-danger">{generalError}</div>}
            <ScholarshipRequestForm
              onSubmit={handleSubmit}
              submitLabel="ส่งคำขอ"
              submitting={submitting}
              serverErrors={serverErrors}
              showConsent
            />
          </div>
        </div>
      </div>
    </div>
  );
}
