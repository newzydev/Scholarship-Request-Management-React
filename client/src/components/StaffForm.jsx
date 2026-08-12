import { useEffect, useState } from 'react';

const emptyValues = {
  first_name: '',
  last_name: '',
  username: '',
  password: '',
};

export default function StaffForm({
  initialValues,
  onSubmit,
  submitLabel = 'บันทึก',
  isEdit = false,
  showPassword = true,
  submitting = false,
  serverErrors = [],
  extraActions = null,
  readOnly = false,
}) {
  const [values, setValues] = useState({ ...emptyValues, ...initialValues });

  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({ ...prev, ...initialValues, password: '' }));
    }
  }, [initialValues]);

  const errorFor = (field) => serverErrors.find((e) => e.field === field)?.message;
  const fieldClass = (field) => `form-control${errorFor(field) ? ' is-invalid' : ''}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { first_name: values.first_name, last_name: values.last_name, username: values.username };
    if (values.password) payload.password = values.password;
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">ชื่อ *</label>
          <input
            type="text"
            name="first_name"
            className={fieldClass('first_name')}
            placeholder="กรอกชื่อ"
            value={values.first_name}
            onChange={handleChange}
            required
            autoComplete="off"
            disabled={readOnly}
          />
          {errorFor('first_name') && <div className="invalid-feedback">{errorFor('first_name')}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">นามสกุล *</label>
          <input
            type="text"
            name="last_name"
            className={fieldClass('last_name')}
            placeholder="กรอกนามสกุล"
            value={values.last_name}
            onChange={handleChange}
            required
            autoComplete="off"
            disabled={readOnly}
          />
          {errorFor('last_name') && <div className="invalid-feedback">{errorFor('last_name')}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">ชื่อผู้ใช้ *</label>
          <input
            type="text"
            name="username"
            className={fieldClass('username')}
            placeholder="เช่น staff02"
            value={values.username}
            onChange={handleChange}
            required
            autoComplete="off"
            disabled={readOnly}
          />
          {errorFor('username') && <div className="invalid-feedback">{errorFor('username')}</div>}
        </div>
        {showPassword && (
          <div className="col-md-6">
            <label className="form-label">{isEdit ? 'รหัสผ่านใหม่' : 'รหัสผ่าน *'}</label>
            <input
              type="password"
              name="password"
              className={fieldClass('password')}
              placeholder={isEdit ? 'เว้นว่างไว้หากไม่ต้องการเปลี่ยน' : 'อย่างน้อย 6 ตัวอักษร'}
              value={values.password}
              onChange={handleChange}
              required={!isEdit}
              autoComplete="off"
              disabled={readOnly}
            />
            {errorFor('password') && <div className="invalid-feedback">{errorFor('password')}</div>}
          </div>
        )}
      </div>

      {(!readOnly || extraActions) && (
        <div className="d-flex gap-2 mt-4">
          {!readOnly && (
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'กำลังบันทึก...' : submitLabel}
            </button>
          )}
          {extraActions}
        </div>
      )}
    </form>
  );
}
