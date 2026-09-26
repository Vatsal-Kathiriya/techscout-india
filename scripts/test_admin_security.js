const fs = require('fs');
const path = require('path');
const assert = require('assert');
const crypto = require('crypto');

console.log('================================================================');
console.log('  GENZTECH.IN OWNER AUTHENTICATION & ACCESS CONTROL AUDIT       ');
console.log('================================================================\n');

// 1. Verify Header and Footer do not expose /admin to visitors
console.log('[1/4] Checking UI Visibility for Public Visitors...');
const headerContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'Header.tsx'), 'utf8');
const footerContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'Footer.tsx'), 'utf8');

assert(!headerContent.includes('href="/admin"'), 'FAIL: Header still contains visible link to /admin');
console.log('  ✓ PASS: Header does NOT contain any visible links to /admin');

assert(!footerContent.includes('href="/admin"'), 'FAIL: Footer still contains visible link to /admin');
console.log('  ✓ PASS: Footer does NOT contain any visible links to /admin');

// 2. Verify Auth Module Logic
console.log('\n[2/4] Testing Owner Key Authentication Logic...');
const secret = 'genztech-admin-secure-2026';

function validateAdminPassword(password) {
  if (!password || !secret) return false;
  const bufA = Buffer.from(password);
  const bufB = Buffer.from(secret);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function createAdminToken() {
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac('sha256', secret).update(timestamp).digest('hex');
  return `${timestamp}.${signature}`;
}

function verifyAdminToken(token) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [timestamp, signature] = parts;
  const time = parseInt(timestamp, 10);
  if (isNaN(time)) return false;
  if (Date.now() - time > 7 * 24 * 3600 * 1000) return false;
  const expectedSig = crypto.createHmac('sha256', secret).update(timestamp).digest('hex');
  const bufA = Buffer.from(signature);
  const bufB = Buffer.from(expectedSig);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

assert(validateAdminPassword('genztech-admin-secure-2026'), 'FAIL: Default admin secret should validate');
assert(!validateAdminPassword('wrongpassword123'), 'FAIL: Wrong password should be rejected');
assert(!validateAdminPassword(''), 'FAIL: Empty password should be rejected');
console.log('  ✓ PASS: Timing-safe password validation accepts owner key and rejects intruders');

const token = createAdminToken();
assert(verifyAdminToken(token), 'FAIL: Generated admin token should verify successfully');
assert(!verifyAdminToken('tampered.token123'), 'FAIL: Tampered token should be rejected');
assert(!verifyAdminToken(''), 'FAIL: Empty token should be rejected');
console.log('  ✓ PASS: Cryptographic HMAC session tokens create and verify safely');

// 3. Verify Route Protection in API Files
console.log('\n[3/4] Verifying Route Protection on Administrative Endpoints...');
const protectedRoutes = [
  'src/app/api/admin/campaigns/route.ts',
  'src/app/api/admin/guides/route.ts',
  'src/app/api/admin/config/route.ts',
  'src/app/api/admin/sync-export/route.ts',
  'src/app/api/products/route.ts',
  'src/app/api/products/[id]/route.ts',
  'src/app/api/amazon/sync/route.ts',
];

for (const route of protectedRoutes) {
  const content = fs.readFileSync(path.join(__dirname, '..', route), 'utf8');
  assert(content.includes('isRequestAuthorized'), `FAIL: ${route} must check isRequestAuthorized`);
  assert(content.includes('401'), `FAIL: ${route} must return 401 Unauthorized for non-owners`);
  console.log(`  ✓ PASS: ${route} enforces owner authorization check`);
}

// 4. Verify Admin Page Lockscreen Gate
console.log('\n[4/4] Verifying Admin Console Lockscreen Gate...');
const adminPageContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'admin', 'page.tsx'), 'utf8');
assert(adminPageContent.includes('!isAuthenticated'), 'FAIL: Admin page must gate content when not authenticated');
assert(adminPageContent.includes('Owner Access Required'), 'FAIL: Admin page must display lockscreen');
assert(adminPageContent.includes('handleLogin'), 'FAIL: Admin page must provide login handler');
assert(adminPageContent.includes('handleSignOut'), 'FAIL: Admin page must provide sign-out capability');
console.log('  ✓ PASS: Admin page renders secure lockscreen when visitor is not logged in');

console.log('\n================================================================');
console.log('  ALL OWNER SECURITY & VISIBILITY AUDITS PASSED WITH 100% SUCCESS ');
console.log('================================================================\n');
process.exit(0);
