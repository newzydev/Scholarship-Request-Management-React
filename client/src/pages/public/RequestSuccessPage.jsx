import { Link, useLocation, Navigate } from 'react-router-dom';

export default function RequestSuccessPage() {
  const location = useLocation();
  const state = location.state;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-7">
        <div className="card shadow-sm text-center">
          <div className="card-body p-5">
            <div className="display-6 text-success mb-3">✓</div>
            <h4 className="card-title">ส่งคำขอทุนสำเร็จ</h4>
            <p className="text-muted mb-1">เลขที่คำขอของท่านคือ</p>
            <p className="fs-4 fw-bold mb-3">{state.requestNo}</p>
            <p className="mb-4">{state.message}</p>
            <Link to="/" className="btn btn-primary">
              ยื่นคำขออีกรายการ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
