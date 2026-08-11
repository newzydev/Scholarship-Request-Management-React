import { STATUS_LABELS, STATUS_BADGE_CLASS } from '../constants';

export default function StatusBadge({ status }) {
  return (
    <span className={`badge rounded-pill ${STATUS_BADGE_CLASS[status] || 'text-bg-secondary'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
