import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, PolarArea } from 'react-chartjs-2';
import { fetchDashboardSummary } from '../../api/dashboard';
import { STATUS_LABELS } from '../../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const STATUS_COLORS = {
  pending: '#ffc107',
  approved: '#198754',
  rejected: '#dc3545',
};

const STATUS_BOX_CLASS = {
  pending: 'text-bg-warning',
  approved: 'text-bg-success',
  rejected: 'text-bg-danger',
};

const STATUS_ICON = {
  pending: 'bi-hourglass-split',
  approved: 'bi-check-circle-fill',
  rejected: 'bi-x-circle-fill',
};

const TYPE_COLORS = ['#0d6efd', '#20c997', '#fd7e14', '#6f42c1', '#d63384'];

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
  const typeColors = data.byType.map((_, i) => TYPE_COLORS[i % TYPE_COLORS.length]);

  const statusDoughnutData = {
    labels: Object.keys(STATUS_LABELS).map((s) => STATUS_LABELS[s]),
    datasets: [
      {
        data: Object.keys(STATUS_LABELS).map((s) => byStatusMap[s] || 0),
        backgroundColor: Object.keys(STATUS_LABELS).map((s) => STATUS_COLORS[s]),
      },
    ],
  };

  const typeCountBarData = {
    labels: data.byType.map((t) => t.name_th),
    datasets: [
      {
        label: 'จำนวนคำขอ (รายการ)',
        data: data.byType.map((t) => t.count),
        backgroundColor: '#0d6efd',
      },
    ],
  };

  const typeProportionPolarData = {
    labels: data.byType.map((t) => t.name_th),
    datasets: [
      {
        data: data.byType.map((t) => t.count),
        backgroundColor: typeColors.map((c) => `${c}b3`),
        borderColor: typeColors,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
  };

  const formatAmount = (n) => Number(n).toLocaleString('th-TH', { minimumFractionDigits: 2 });

  return (
    <div>
      <div className="row g-3 mb-2">
        <div className="col-lg-3 col-6">
          <div className="small-box text-bg-primary">
            <div className="inner">
              <h3>{data.total}</h3>
              <p>คำขอทั้งหมด</p>
            </div>
            <i className="bi bi-collection-fill small-box-icon" aria-hidden="true"></i>
          </div>
        </div>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div className="col-lg-3 col-6" key={key}>
            <div className={`small-box ${STATUS_BOX_CLASS[key]}`}>
              <div className="inner">
                <h3>{byStatusMap[key] || 0}</h3>
                <p>{label}</p>
              </div>
              <i className={`bi ${STATUS_ICON[key]} small-box-icon`} aria-hidden="true"></i>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-2">
        <div className="col-lg-4 col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="card-title">จำนวนคำขอแยกตามสถานะ</h3>
            </div>
            <div className="card-body" style={{ height: 260 }}>
              <Doughnut data={statusDoughnutData} options={chartOptions} />
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="card-title">จำนวนคำขอแยกตามประเภททุน</h3>
            </div>
            <div className="card-body" style={{ height: 260 }}>
              <Bar
                data={typeCountBarData}
                options={{
                  ...chartOptions,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="card-title">สัดส่วนคำขอแยกตามประเภททุน</h3>
            </div>
            <div className="card-body" style={{ height: 260 }}>
              <PolarArea data={typeProportionPolarData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-2">
        <div className="card-header">
          <h3 className="card-title">สรุปจำนวนคำขอและยอดเงินรวม แยกตามประเภททุน</h3>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
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
