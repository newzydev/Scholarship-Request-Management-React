import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { staff, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link${isActive ? ' active fw-semibold' : ' text-white-50'}`;

  return (
    <div className="d-flex min-vh-100">
      <aside className="bg-dark text-white p-3" style={{ width: 240 }}>
        <div className="fs-5 fw-semibold mb-4">ระบบจัดการทุนการศึกษา</div>
        <nav className="nav nav-pills flex-column gap-1">
          <NavLink to="/admin/dashboard" className={navLinkClass}>
            แดชบอร์ด
          </NavLink>
          <NavLink to="/admin/requests" className={navLinkClass}>
            รายการคำขอทุน
          </NavLink>
        </nav>
      </aside>
      <div className="flex-grow-1 d-flex flex-column">
        <header className="navbar navbar-light bg-white border-bottom px-3">
          <span className="text-muted">
            เจ้าหน้าที่: {staff?.firstName} {staff?.lastName} ({staff?.username})
          </span>
          <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </header>
        <main className="flex-grow-1 bg-light p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
