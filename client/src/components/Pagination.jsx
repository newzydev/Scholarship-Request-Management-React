export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="เปลี่ยนหน้ารายการ">
      <ul className="pagination justify-content-center mb-0">
        <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onChange(page - 1)} disabled={page <= 1}>
            ก่อนหน้า
          </button>
        </li>
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onChange(p)}>
              {p}
            </button>
          </li>
        ))}
        <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onChange(page + 1)}
            disabled={page >= totalPages}
          >
            ถัดไป
          </button>
        </li>
      </ul>
    </nav>
  );
}
