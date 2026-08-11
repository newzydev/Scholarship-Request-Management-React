import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { fetchDashboardSummary } from '../../api/dashboard';
import { STATUS_LABELS } from '../../constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const STATUS_COLORS = {
  pending: '#ffc107',
  approved: '#198754',
  rejected: '#dc3545',
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardSummary()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const byStatusMap = Object.fromEntries(data.byStatus.map((s) => [s.status, s.count]));

  const pieData = {
    labels: Object.keys(STATUS_LABELS).map((s) => STATUS_LABELS[s]),
    datasets: [
      {
        data: Object.keys(STATUS_LABELS).map((s) => byStatusMap[s] || 0),
        backgroundColor: Object.keys(STATUS_LABELS).map((s) => STATUS_COLORS[s]),
      },
    ],
  };

  const barData = {
    labels: data.byType.map((t) => t.name_th),
    datasets: [
      {
        label: 'จำนวนคำขอ (รายการ)',
        data: data.byType.map((t) => t.count),
        backgroundColor: '#0d6efd',
      },
    ],
  };

  const formatAmount = (n) => Number(n).toLocaleString('th-TH', { minimumFractionDigits: 2 });

  return (
    <div>
      <h4 className="mb-3">แดชบอร์ดสรุปภาพรวมคำขอทุน</h4>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <div className="text-muted small">คำขอทั้งหมด</div>
              <div className="fs-3 fw-bold">{data.total}</div>
            </div>
          </div>
        </div>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div className="col-md-3" key={key}>
            <div className="card shadow-sm text-center">
              <div className="card-body">
                <div className="text-muted small">{label}</div>
                <div className="fs-3 fw-bold" style={{ color: STATUS_COLORS[key] }}>
                  {byStatusMap[key] || 0}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">จำนวนคำขอแยกตามสถานะ</h6>
              <Pie data={pieData} />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">จำนวนคำขอแยกตามประเภททุน</h6>
              <Bar
                data={barData}
                options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h6 className="card-title">สรุปจำนวนคำขอและยอดเงินรวม แยกตามประเภททุน</h6>
          <div className="table-responsive">
            <table className="table table-sm mb-0">
              <thead>
                <tr>
                  <th>ประเภททุน</th>
                  <th className="text-end">จำนวนคำขอ</th>
                  <th className="text-end">ยอดเงินรวมที่ขอ (บาท)</th>
                </tr>
              </thead>
              <tbody>
                {data.byType.map((t) => (
                  <tr key={t.code}>
                    <td>{t.name_th}</td>
                    <td className="text-end">{t.count}</td>
                    <td className="text-end">{formatAmount(t.total_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
