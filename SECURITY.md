# Security Implementation Guide

## 🔒 Implemented Security Features

### 1. **Rate Limiting**
Prevents brute force attacks and API abuse.

**Location:** `lib/security/rateLimit.ts`

**Configuration:**
- Auth routes (login, reset-password): **5 requests/minute**
- API routes: **30 requests/minute**
- Automatic cleanup of expired entries

**Usage:**
```typescript
import { rateLimit, getClientIdentifier } from '@/lib/security/rateLimit'

const identifier = getClientIdentifier(request)
const limit = rateLimit(identifier, {
    interval: 60000, // 1 minute
    maxRequests: 10
})

if (!limit.success) {
    return new Response('Too many requests', { status: 429 })
}
```

---

### 2. **Input Sanitization**
Prevents XSS, SQL Injection, and other injection attacks.

**Location:** `lib/security/sanitize.ts`

**Functions:**
- `sanitizeHtml()` - Prevents XSS attacks
- `sanitizeSql()` - Extra layer for SQL injection (Supabase already handles this)
- `isValidEmail()` - Email format validation
- `isValidPhone()` - Indonesian phone number validation
- `sanitizeFilename()` - Prevents path traversal
- `isValidFileType()` - File type validation
- `isValidFileSize()` - File size validation
- `sanitizeUrl()` - Prevents open redirect attacks
- `sanitizeProfileInput()` - Complete profile data validation

**Usage:**
```typescript
import { sanitizeHtml, isValidEmail } from '@/lib/security/sanitize'

const cleanName = sanitizeHtml(userInput)
if (!isValidEmail(email)) {
    return { error: 'Invalid email' }
}
```

---

### 3. **Security Headers**
Implements security best practices via HTTP headers.

**Location:** `lib/security/headers.ts`

**Headers Applied:**
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection (legacy browsers)
- `Referrer-Policy: strict-origin-when-cross-origin` - Referrer control
- `Permissions-Policy` - Restricts camera, microphone, geolocation
- `Content-Security-Policy` - Comprehensive CSP policy

**CSP Policy:**
```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval'
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com
img-src 'self' data: https: blob:
connect-src 'self' https://*.supabase.co wss://*.supabase.co
frame-ancestors 'none'
base-uri 'self'
form-action 'self'
```

---

### 4. **CSRF Protection**
Generates and validates CSRF tokens for state-changing operations.

**Location:** `lib/security/csrf.ts`

**Features:**
- Token generation with 1-hour expiry
- One-time use tokens
- Automatic cleanup of expired tokens

**Usage:**
```typescript
import { generateCsrfToken, validateCsrfToken } from '@/lib/security/csrf'

// Generate token
const token = generateCsrfToken(sessionId)

// Validate token
const isValid = validateCsrfToken(sessionId, token)
```

---

### 5. **Middleware Protection**
Centralized security enforcement in Next.js middleware.

**Location:** `middleware.ts`

**Features:**
- Security headers on all responses
- Rate limiting for auth and API routes
- Role-based access control (RBAC)
- Authentication checks
- Automatic redirects for unauthorized access

**Protected Routes:**
- `/admin/*` - Admin only
- `/teacher/*` - Pembina only
- `/student/*` - Siswa only

---

## 🛡️ Security Best Practices Implemented

### File Upload Security
```typescript
// In ProfileEditModal.tsx and UserFormModal.tsx
- Max file size: 1MB (Supabase free tier optimization)
- Allowed types: JPEG, PNG only
- File validation before upload
- Sanitized filenames
```

### Password Security
```typescript
// Handled by Supabase Auth
- Minimum 6 characters
- Hashed with bcrypt
- Secure password reset flow with tokens
```

### Database Security
```typescript
// Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Admin client used for privileged operations
- Service role key stored in environment variables
```

### Session Security
```typescript
// Handled by Supabase Auth
- HTTP-only cookies
- Secure flag in production
- Automatic session refresh
- Session expiry
```

---

## 🔧 Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📊 Security Testing Checklist

### Authentication & Authorization
- [ ] Login rate limiting works (max 5 attempts/minute)
- [ ] Invalid credentials rejected
- [ ] Session expires after timeout
- [ ] Logout clears session
- [ ] Role-based access enforced
- [ ] Unauthorized routes redirect properly

### Input Validation
- [ ] XSS attempts blocked (e.g., `<script>alert('xss')</script>`)
- [ ] SQL injection attempts blocked
- [ ] File upload validates type and size
- [ ] Email validation works
- [ ] Phone validation works

### Security Headers
- [ ] CSP blocks inline scripts (except allowed)
- [ ] X-Frame-Options prevents iframe embedding
- [ ] MIME sniffing disabled

### Rate Limiting
- [ ] Auth routes limited to 5 req/min
- [ ] API routes limited to 30 req/min
- [ ] 429 status returned when exceeded
- [ ] Retry-After header present

---

## 🚨 Known Limitations & Future Improvements

### Current Limitations
1. **Rate limiting is in-memory** - Resets on server restart
   - **Solution:** Use Redis for production
   
2. **CSRF tokens are in-memory** - Not suitable for multi-server setup
   - **Solution:** Use Redis or database storage

3. **CSP allows unsafe-inline/unsafe-eval** - Required by Next.js
   - **Solution:** Use nonce-based CSP in production

### Recommended Improvements
1. **Add CAPTCHA** for login after failed attempts
2. **Implement 2FA** for admin accounts
3. **Add audit logging** for sensitive operations
4. **Implement IP whitelisting** for admin access
5. **Add security monitoring** (e.g., Sentry)
6. **Regular security audits** with OWASP ZAP

---

## 📖 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [CSP Reference](https://content-security-policy.com/)

---

## 🔍 Testing Commands

```bash
# Run OWASP ZAP scan
# 1. Download ZAP: https://www.zaproxy.org/download/
# 2. Start dev server: npm run dev
# 3. Run automated scan targeting http://localhost:3000

# Test rate limiting
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}' \
  --repeat 10

# Check security headers
curl -I http://localhost:3000
```

---

**Last Updated:** 2026-01-14
**Version:** 1.0.0
