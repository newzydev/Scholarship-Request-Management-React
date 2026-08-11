export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: 'ไม่พบเส้นทางที่ร้องขอ' });
};

export const errorHandler = (err, req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'เกิดข้อผิดพลาดภายในระบบ' });
};
