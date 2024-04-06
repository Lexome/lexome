import { Timestamp } from "firebase/firestore";

export const HEIGHT = 700;

export const HEIGHT_PADDING = 16;

export const WIDTH = 1100;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const formatTimestamp = (timestamp: Timestamp): string => {
  try {
    const d = timestamp.toDate();

    return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  } catch {
    console.log('ERROR', timestamp, typeof timestamp);
    return 'error';
  }

}
