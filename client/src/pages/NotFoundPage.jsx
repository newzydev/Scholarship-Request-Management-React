import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <h1 className="display-4">404</h1>
      <p className="text-muted mb-3">ไม่พบหน้าที่ต้องการ</p>
      <Link to="/request" className="btn btn-primary">
        กลับหน้าแรก
      </Link>
    </div>
  );
}
