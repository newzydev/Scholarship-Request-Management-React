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
        <div className="card card-outline card-success text-center">
          <div className="card-body p-5">
            <i className="bi bi-check-circle-fill text-success display-4 mb-3" aria-hidden="true"></i>
            <h3 className="card-title">ส่งคำขอทุนสำเร็จ</h3>
            <p className="text-secondary mb-1">เลขที่คำขอของท่านคือ</p>
            <p className="fs-4 fw-bold mb-3">{state.requestNo}</p>
            <p className="mb-4">{state.message}</p>
            <Link to="/" className="btn btn-primary">
              <i className="bi bi-arrow-repeat me-1" aria-hidden="true"></i>
              ยื่นคำขออีกรายการ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
