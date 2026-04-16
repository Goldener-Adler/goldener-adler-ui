export const toDateOnly = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const getUTCDateString = (date: Date) => `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;

export function getNights(checkIn: Date, checkOut: Date) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
}