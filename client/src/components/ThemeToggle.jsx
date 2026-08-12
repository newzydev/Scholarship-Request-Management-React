export default function ThemeToggle() {
  return (
    <li className="nav-item dropdown">
      <a
        className="nav-link"
        href="#"
        id="bd-theme"
        aria-label="สลับโหมดสี"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-sun-fill" data-lte-theme-icon="light"></i>
        <i className="bi bi-moon-fill d-none" data-lte-theme-icon="dark"></i>
        <i className="bi bi-circle-half d-none" data-lte-theme-icon="auto"></i>
      </a>
      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="bd-theme"
        style={{ '--bs-dropdown-min-width': '8rem' }}
      >
        <li>
          <button
            type="button"
            className="dropdown-item d-flex align-items-center"
            data-bs-theme-value="light"
            aria-pressed="false"
          >
            <i className="bi bi-sun-fill me-2"></i>
            สว่าง
            <i className="bi bi-check-lg ms-auto d-none"></i>
          </button>
        </li>
        <li>
          <button
            type="button"
            className="dropdown-item d-flex align-items-center"
            data-bs-theme-value="dark"
            aria-pressed="false"
          >
            <i className="bi bi-moon-fill me-2"></i>
            มืด
            <i className="bi bi-check-lg ms-auto d-none"></i>
          </button>
        </li>
        <li>
          <button
            type="button"
            className="dropdown-item d-flex align-items-center active"
            data-bs-theme-value="auto"
            aria-pressed="true"
          >
            <i className="bi bi-circle-half me-2"></i>
            อัตโนมัติ
            <i className="bi bi-check-lg ms-auto d-none"></i>
          </button>
        </li>
      </ul>
    </li>
  );
}
