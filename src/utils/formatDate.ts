export const toDateOnly = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const getUTCDateString = (date: Date) => `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;