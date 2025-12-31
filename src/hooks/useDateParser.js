import { useMemo } from 'react';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const useDateParser = date => {
  const extractedDate = date.substring(0, 10);
  const formattedDate = useMemo(() => {
    if (!extractedDate) return '';

    const dateObj = new Date(extractedDate);
    if (isNaN(dateObj)) return 'Invalid date';

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = MONTH_NAMES[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  }, [extractedDate]);

  return formattedDate;
};

export default useDateParser;
