import { Link, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/request">
            ระบบบริหารจัดการคำขอทุนการศึกษา
          </Link>
          <Link className="btn btn-outline-light btn-sm" to="/login">
            เจ้าหน้าที่เข้าสู่ระบบ
          </Link>
        </div>
      </nav>
      <main className="flex-grow-1 bg-light">
        <div className="container py-4">
          <Outlet />
        </div>
      </main>
      <footer className="text-center text-muted small py-3">
        กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์ มหาวิทยาลัยสงขลานครินทร์
      </footer>
    </div>
  );
}
