import crypto from 'crypto';

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || 'genztech-admin-secure-2026';
}

export function validateAdminPassword(password: string): boolean {
  const secret = getAdminSecret();
  if (!password || !secret) return false;

  const bufA = Buffer.from(password);
  const bufB = Buffer.from(secret);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function createAdminToken(): string {
  const secret = getAdminSecret();
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac('sha256', secret).update(timestamp).digest('hex');
  return `${timestamp}.${signature}`;
}

export function verifyAdminToken(token?: string | null): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [timestamp, signature] = parts;
  const time = parseInt(timestamp, 10);
  if (isNaN(time)) return false;

  // Session valid for 7 days
  const SEVEN_DAYS = 7 * 24 * 3600 * 1000;
  if (Date.now() - time > SEVEN_DAYS) return false;

  const secret = getAdminSecret();
  const expectedSig = crypto.createHmac('sha256', secret).update(timestamp).digest('hex');
  const bufA = Buffer.from(signature);
  const bufB = Buffer.from(expectedSig);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function isRequestAuthorized(req: Request): boolean {
  // 1. Check Bearer Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (verifyAdminToken(token)) return true;
  }

  // 2. Check admin_session cookie
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  if (match && match[1]) {
    const token = decodeURIComponent(match[1]);
    if (verifyAdminToken(token)) return true;
  }

  return false;
}
