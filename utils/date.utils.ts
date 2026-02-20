// src/utils/date.utils.ts

export const formatMissionDate = (
  dateString: string | Date | undefined | null,
  locale: 'fr' | 'en' = 'fr'
): string | null => {
  if (!dateString) return null;

  // If it is already a Date object, convert it to an ISO string to process it uniformly.
  let inputStr: string;
  if (dateString instanceof Date) {
    if (isNaN(dateString.getTime())) return null;
    inputStr = dateString.toISOString();
  } else {
    inputStr = dateString;
  }
  // DETECTION: Is this a date alone (YYYY-MM-DD format without “T” or time)?
  // E.g.: ‘2024-01-15’
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(inputStr);

  if (isDateOnly) {
    // SAFE APPROACH: Cut the string manually.
    // This prevents new Date() from converting to UTC midnight and shifting by one day.
    const [year, month, day] = inputStr.split('-');
    if (locale === 'en') {
       return `${year}-${month}-${day}`; // ISOish or US style
    }
    return `${day}/${month}/${year}`;
  }

  // OTHERWISE: It is a date with time (e.g. ‘2024-01-15T14:30:00.000Z’)
  // We let JavaScript convert it to the phone's local time.
  const dateObj = new Date(inputStr);
  
  if (isNaN(dateObj.getTime())) return null;

  // Options to display the time only if it is relevant (not midnight if the API returns midnight)
  const hasTime = dateObj.getHours() !== 0 || dateObj.getMinutes() !== 0;

  const localeCode = locale === 'fr' ? 'fr-FR' : 'en-US';

  const datePart = dateObj.toLocaleDateString(localeCode, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  if (hasTime) {
    const timePart = dateObj.toLocaleTimeString(localeCode, {
      hour: "2-digit",
      minute: "2-digit"
    });
    const separator = locale === 'fr' ? ' à ' : ' at ';
    return `${datePart}${separator}${timePart}`;
  }

  return datePart;
};