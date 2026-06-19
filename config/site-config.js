// Single source of truth for site-wide dates.
// Update RATES_LAST_VERIFIED whenever you refresh the bank database.
// Every component that displays this date should import from here.

export const RATES_LAST_VERIFIED = "June 19, 2026";

// Convenience: get just the month + year for compact displays
// e.g. home page badge: "Rates verified June 2026"
export const RATES_LAST_VERIFIED_SHORT = "June 2026";
