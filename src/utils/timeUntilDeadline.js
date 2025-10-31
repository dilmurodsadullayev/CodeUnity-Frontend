export function timeUntilDeadline(deadline) {
  const now = new Date();
  const end = new Date(deadline);

  const diffMs = end - now;

  if (diffMs <= 0) {
    return "⏰ Muddat tugagan";
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear > 0) return `${diffYear} yil qoldi`;
  if (diffMonth > 0) return `${diffMonth} oy qoldi`;
  if (diffWeek > 0) return `${diffWeek} hafta qoldi`;
  if (diffDay > 0) return `${diffDay} kun qoldi`;
  if (diffHour > 0) return `${diffHour} soat qoldi`;
  if (diffMin > 0) return `${diffMin} daqiqa qoldi`;
  return `${diffSec} soniya qoldi`;
}
