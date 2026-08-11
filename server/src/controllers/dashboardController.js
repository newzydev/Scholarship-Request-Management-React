import { dashboardSummary } from '../models/requestModel.js';

export const summary = async (req, res) => {
  const data = await dashboardSummary();
  res.json(data);
};
