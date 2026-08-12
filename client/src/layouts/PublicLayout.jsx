import { NavLink, Outlet, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const PAGE_TITLES = {
  '/': 'ยื่นคำขอทุนการศึกษา',
  '/success': 'ผลการยื่นคำขอทุน',
};

const closeSidebarOnMobile = () => document.body.classList.remove('sidebar-open');

export default function PublicLayout() {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || 'ระบบบริหารจัดการคำขอทุนการศึกษา';

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
      <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
        <div className="sidebar-brand">
          <NavLink to="/" className="brand-link">
            <i className="bi bi-mortarboard-fill brand-image opacity-75 fs-3" aria-hidden="true"></i>
            <span className="brand-text fw-semibold">SRM SYSTEM</span>
          </NavLink>
        </div>
        <div className="sidebar-wrapper">
          <nav className="mt-2" aria-label="เมนูหลัก">
            <ul className="nav sidebar-menu flex-column" role="menu">
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  onClick={closeSidebarOnMobile}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  <i className="nav-icon bi bi-file-earmark-text" aria-hidden="true"></i>
                  <p>ยื่นคำขอทุนการศึกษา</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/login"
                  onClick={closeSidebarOnMobile}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  <i className="nav-icon bi bi-box-arrow-in-right" aria-hidden="true"></i>
                  <p>เจ้าหน้าที่เข้าสู่ระบบ</p>
                </NavLink>
              </li>
            </ul>
          </nav>
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
