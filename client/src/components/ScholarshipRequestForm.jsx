import { useEffect, useState } from 'react';
import { fetchScholarshipTypes } from '../api/publicApi';

const emptyValues = {
  student_id: '',
  first_name: '',
  last_name: '',
  faculty: '',
  year_level: '',
  gpax: '',
  email: '',
  scholarship_type_id: '',
  amount_requested: '',
  bank_account_no: '',
  reason: '',
  pdpa_consent: false,
};

export default function ScholarshipRequestForm({
  initialValues,
  onSubmit,
  submitLabel = 'บันทึก',
  showConsent = true,
  submitting = false,
  serverErrors = [],
  extraActions = null,
}) {
  const [values, setValues] = useState({ ...emptyValues, ...initialValues });
  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  useEffect(() => {
    fetchScholarshipTypes()
      .then(setTypes)
      .finally(() => setLoadingTypes(false));
  }, []);

  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const errorFor = (field) => serverErrors.find((e) => e.field === field)?.message;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...values,
      year_level: Number(values.year_level),
      gpax: Number(values.gpax),
      scholarship_type_id: Number(values.scholarship_type_id),
      amount_requested: Number(values.amount_requested),
    });
  };

  const fieldClass = (field) => `form-control${errorFor(field) ? ' is-invalid' : ''}`;
  const selectClass = (field) => `form-select${errorFor(field) ? ' is-invalid' : ''}`;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">รหัสนักศึกษา *</label>
          <input
            type="text"
            name="student_id"
            className={fieldClass('student_id')}
            value={values.student_id}
            onChange={handleChange}
            required
          />
          {errorFor('student_id') && <div className="invalid-feedback">{errorFor('student_id')}</div>}
        </div>
        <div className="col-md-4">
          <label className="form-label">ชื่อ *</label>
          <input
            type="text"
            name="first_name"
            className={fieldClass('first_name')}
            value={values.first_name}
            onChange={handleChange}
            required
          />
          {errorFor('first_name') && <div className="invalid-feedback">{errorFor('first_name')}</div>}
        </div>
        <div className="col-md-4">
          <label className="form-label">นามสกุล *</label>
          <input
            type="text"
            name="last_name"
            className={fieldClass('last_name')}
            value={values.last_name}
            onChange={handleChange}
            required
          />
          {errorFor('last_name') && <div className="invalid-feedback">{errorFor('last_name')}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">คณะ/สาขา *</label>
          <input
            type="text"
            name="faculty"
            className={fieldClass('faculty')}
            value={values.faculty}
            onChange={handleChange}
            required
          />
          {errorFor('faculty') && <div className="invalid-feedback">{errorFor('faculty')}</div>}
        </div>
        <div className="col-md-3">
          <label className="form-label">ชั้นปี *</label>
          <input
            type="number"
            name="year_level"
            min="1"
            max="8"
            className={fieldClass('year_level')}
            value={values.year_level}
            onChange={handleChange}
            required
          />
          {errorFor('year_level') && <div className="invalid-feedback">{errorFor('year_level')}</div>}
        </div>
        <div className="col-md-3">
          <label className="form-label">เกรดเฉลี่ย (GPAX) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            name="gpax"
            className={fieldClass('gpax')}
            value={values.gpax}
            onChange={handleChange}
            required
          />
          {errorFor('gpax') && <div className="invalid-feedback">{errorFor('gpax')}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">อีเมล *</label>
          <input
            type="email"
            name="email"
            className={fieldClass('email')}
            value={values.email}
            onChange={handleChange}
            required
          />
          {errorFor('email') && <div className="invalid-feedback">{errorFor('email')}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">ประเภททุน *</label>
          <select
            name="scholarship_type_id"
            className={selectClass('scholarship_type_id')}
            value={values.scholarship_type_id}
            onChange={handleChange}
            required
            disabled={loadingTypes}
          >
            <option value="">-- เลือกประเภททุน --</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name_th}
              </option>
            ))}
          </select>
          {errorFor('scholarship_type_id') && (
            <div className="invalid-feedback">{errorFor('scholarship_type_id')}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">จำนวนเงินที่ขอ (บาท) *</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            name="amount_requested"
            className={fieldClass('amount_requested')}
            value={values.amount_requested}
            onChange={handleChange}
            required
          />
          {errorFor('amount_requested') && (
            <div className="invalid-feedback">{errorFor('amount_requested')}</div>
          )}
        </div>
        <div className="col-md-6">
          <label className="form-label">เลขที่บัญชีธนาคาร *</label>
          <input
            type="text"
            name="bank_account_no"
            className={fieldClass('bank_account_no')}
            value={values.bank_account_no}
            onChange={handleChange}
            required
          />
          {errorFor('bank_account_no') && (
            <div className="invalid-feedback">{errorFor('bank_account_no')}</div>
          )}
        </div>

        <div className="col-12">
          <label className="form-label">เหตุผลการขอทุน *</label>
          <textarea
            name="reason"
            rows="3"
            className={fieldClass('reason')}
            value={values.reason}
            onChange={handleChange}
            required
          />
          {errorFor('reason') && <div className="invalid-feedback">{errorFor('reason')}</div>}
        </div>

        {showConsent && (
          <div className="col-12">
            <div className={`form-check${errorFor('pdpa_consent') ? ' is-invalid' : ''}`}>
              <input
                type="checkbox"
                name="pdpa_consent"
                id="pdpa_consent"
                className="form-check-input"
                checked={values.pdpa_consent}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="pdpa_consent">
                ข้าพเจ้ายินยอมให้เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า
                เพื่อวัตถุประสงค์ในการพิจารณาคำขอทุนการศึกษา ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)
              </label>
              {errorFor('pdpa_consent') && (
                <div className="invalid-feedback d-block">{errorFor('pdpa_consent')}</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="d-flex gap-2 mt-4">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'กำลังบันทึก...' : submitLabel}
        </button>
        {extraActions}
      </div>
    </form>
  );
}
