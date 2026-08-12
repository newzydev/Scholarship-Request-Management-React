import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page bg-body-secondary">
      <main className="login-box">
        <div className="login-logo">
          <i className="bi bi-mortarboard-fill me-2" aria-hidden="true"></i>
          <b>ระบบจัดการ</b>ทุนการศึกษา
        </div>
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">เข้าสู่ระบบสำหรับเจ้าหน้าที่</p>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <label className="visually-hidden" htmlFor="username">
                ชื่อผู้ใช้
              </label>
              <div className="input-group mb-3">
                <input
                  id="username"
                  type="text"
                  className="form-control"
                  placeholder="ชื่อผู้ใช้"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                  autoComplete="off"
                />
                <div className="input-group-text">
                  <span className="bi bi-person-fill" aria-hidden="true"></span>
                </div>
              </div>

              <label className="visually-hidden" htmlFor="password">
                รหัสผ่าน
              </label>
              <div className="input-group mb-3">
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="รหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="off"
                />
                <div className="input-group-text">
                  <span className="bi bi-lock-fill" aria-hidden="true"></span>
                </div>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </button>
              </div>
            </form>

            <p className="mt-3 mb-0 text-center">
              <Link to="/">
                <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>
                กลับหน้ายื่นคำขอทุนสำหรับนักศึกษา
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
