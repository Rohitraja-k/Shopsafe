/**
 * Date and Expiry calculation utilities for ShopSafe
 */

export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const addDaysToDateString = (dateStr, days) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculates expiry status and day differences.
 * Status categories:
 * - 'expired': expiry date is in the past (daysLeft < 0)
 * - 'expiring-soon': expires in 0 to 7 days (0 <= daysLeft <= 7)
 * - 'safe': expires in > 7 days (daysLeft > 7)
 */
export const calculateExpiryStatus = (expiryDateStr) => {
  if (!expiryDateStr) {
    return {
      status: 'safe',
      daysLeft: 999,
      label: 'No Expiry',
      colorClass: 'status-safe',
      badgeText: 'Valid',
      urgency: 0
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse YYYY-MM-DD cleanly in local timezone
  const parts = expiryDateStr.split('-');
  if (parts.length !== 3) {
    return {
      status: 'safe',
      daysLeft: 999,
      label: 'Invalid Date',
      colorClass: 'status-safe',
      badgeText: 'Valid',
      urgency: 0
    };
  }

  const expiryDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  expiryDate.setHours(0, 0, 0, 0);

  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const pastDays = Math.abs(diffDays);
    return {
      status: 'expired',
      daysLeft: diffDays,
      label: pastDays === 1 ? 'Expired yesterday' : `Expired ${pastDays} days ago`,
      colorClass: 'status-expired',
      badgeText: 'Expired',
      urgency: 3, // Highest urgency
      percentageElapsed: 100
    };
  } else if (diffDays === 0) {
    return {
      status: 'expiring-soon',
      daysLeft: 0,
      label: 'Expires today!',
      colorClass: 'status-expiring-soon',
      badgeText: 'Expires Today',
      urgency: 2,
      percentageElapsed: 95
    };
  } else if (diffDays === 1) {
    return {
      status: 'expiring-soon',
      daysLeft: 1,
      label: 'Expires tomorrow',
      colorClass: 'status-expiring-soon',
      badgeText: '1 Day Left',
      urgency: 2,
      percentageElapsed: 90
    };
  } else if (diffDays <= 7) {
    return {
      status: 'expiring-soon',
      daysLeft: diffDays,
      label: `Expires in ${diffDays} days`,
      colorClass: 'status-expiring-soon',
      badgeText: 'Expiring Soon',
      urgency: 2,
      percentageElapsed: Math.min(85, 100 - diffDays * 5)
    };
  } else {
    return {
      status: 'safe',
      daysLeft: diffDays,
      label: `Expires in ${diffDays} days`,
      colorClass: 'status-safe',
      badgeText: 'Valid',
      urgency: 1,
      percentageElapsed: Math.max(10, Math.min(60, 100 - Math.floor(diffDays / 2)))
    };
  }
};

export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

/**
 * Calculate progress percentage from Manufacturing Date to Expiry Date relative to Today
 */
export const calculateLifecycleProgress = (mfgDateStr, expDateStr) => {
  if (!mfgDateStr || !expDateStr) return 50;

  const today = new Date().getTime();
  const mfg = new Date(mfgDateStr).getTime();
  const exp = new Date(expDateStr).getTime();

  if (isNaN(mfg) || isNaN(exp) || exp <= mfg) return 50;

  if (today >= exp) return 100;
  if (today <= mfg) return 0;

  const total = exp - mfg;
  const elapsed = today - mfg;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
};
