// Mirrors server/src/utils/mask.js — show only the last 4 digits of a bank account number.
export const maskBankAccount = (accountNo) => {
  if (!accountNo || accountNo.length <= 4) return accountNo;
  const visible = accountNo.slice(-4);
  return `${'X'.repeat(accountNo.length - 4)}${visible}`;
};
