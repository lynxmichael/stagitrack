const daysLeft = (dateStr) => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000*60*60*24));
};

const formatDate = (d) => {
  if (!d) return null;
  return new Date(d).toISOString().split('T')[0];
};

const isExpiringSoon = (dateStr, threshold = 7) => {
  const d = daysLeft(dateStr);
  return d !== null && d >= 0 && d <= threshold;
};

module.exports = { daysLeft, formatDate, isExpiringSoon };
