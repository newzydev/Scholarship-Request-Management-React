import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'แดชบอร์ด', icon: 'bi-speedometer2' },
  { to: '/admin/requests', label: 'รายการคำขอทุน', icon: 'bi-card-list' },
  { to: '/admin/reports', label: 'รายงานสรุป', icon: 'bi-file-earmark-bar-graph' },
  { to: '/admin/staff', label: 'จัดการเจ้าหน้าที่', icon: 'bi-people-fill' },
];

const PAGE_TITLES = {
  '/admin/dashboard': 'แดชบอร์ดสรุปภาพรวมคำขอทุน',
  '/admin/requests': 'รายการคำขอทุนการศึกษา',
  '/admin/reports': 'รายงานสรุปคำขอทุนการศึกษา',
  '/admin/staff': 'จัดการเจ้าหน้าที่',
};

const closeSidebarOnMobile = () => document.body.classList.remove('sidebar-open');

export default function AdminLayout() {
  const { staff, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const pageTitle =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.startsWith('/admin/requests') && 'จัดการคำขอทุนการศึกษา') ||
    (location.pathname.startsWith('/admin/staff') && 'จัดการเจ้าหน้าที่') ||
    'ระบบจัดการทุนการศึกษา';

  return (
    <div className="app-wrapper">
      {/* Header */}
      <nav className="app-header navbar navbar-expand bg-body">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className="nav-link"
                data-lte-toggle="sidebar"
                href="#"
                role="button"
                aria-label="Toggle sidebar"
              >
                <i className="bi bi-list" aria-hidden="true"></i>
              </a>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                data-lte-toggle="fullscreen"
                aria-label="สลับเต็มหน้าจอ"
              >
                <i data-lte-icon="maximize" className="bi bi-arrows-fullscreen"></i>
                <i data-lte-icon="minimize" className="bi bi-fullscreen-exit d-none"></i>
              </a>
            </li>
            <ThemeToggle />
          </ul>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="app-sidebar bg-body-secondary shadow d-flex flex-column" data-bs-theme="dark">
        <div className="sidebar-brand">
          <NavLink to="/admin/dashboard" className="brand-link">
            <i className="bi bi-mortarboard-fill brand-image opacity-75 fs-3" aria-hidden="true"></i>
            <span className="brand-text fw-semibold">SRM SYSTEM</span>
          </NavLink>
        </div>
        <div className="sidebar-search" role="search">
          <label htmlFor="sidebar-search-input" className="visually-hidden">
            ค้นหาเมนู
          </label>
          <input
            type="search"
            id="sidebar-search-input"
            className="form-control form-control-sm"
            placeholder="ค้นหาเมนู…"
            autoComplete="off"
            data-lte-toggle="sidebar-search"
            data-lte-target="#admin-navigation"
          />
          <p className="fs-7 text-secondary mt-2 mb-0" data-lte-search-empty role="status" hidden>
            ไม่พบเมนูที่ตรงกัน
          </p>
        </div>
        <div className="sidebar-wrapper flex-grow-1">
          <nav className="mt-2" aria-label="เมนูหลัก">
            <ul className="nav sidebar-menu flex-column" id="admin-navigation" role="menu">
              {NAV_ITEMS.map((item) => (
                <li className="nav-item" key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={closeSidebarOnMobile}
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  >
                    <i className={`nav-icon bi ${item.icon}`} aria-hidden="true"></i>
                    <p>{item.label}</p>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="p-2 border-top border-secondary-subtle">
          <div className="d-flex align-items-center text-white-50 small mb-2 px-1">
            <i className="bi bi-person-circle me-2" aria-hidden="true"></i>
            <span className="text-truncate">
              {staff?.firstName} {staff?.lastName} ({staff?.username})
            </span>
          </div>
          <button className="btn btn-outline-light btn-sm w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1" aria-hidden="true"></i>
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Mobile backdrop: closes the sidebar when tapped outside it */}
      <div className="sidebar-overlay" onClick={closeSidebarOnMobile}></div>

      {/* Main content */}
      <main className="app-main">
        <div className="app-content-header">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-sm-6">
                <h1 className="mb-0 fs-3">{pageTitle}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="app-content">
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์ มหาวิทยาลัยสงขลานครินทร์
      </footer>
    </div>
  );
}
