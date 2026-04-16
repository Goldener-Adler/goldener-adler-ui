export function createSessionId(): string {
  const now = new Date();

  const timestamp = now.toISOString()
    .replace(/[-:.]/g, '')
    .replace('T', 'T')
    .slice(0, 15);

  const random = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  return `${timestamp}I${random}`;
}