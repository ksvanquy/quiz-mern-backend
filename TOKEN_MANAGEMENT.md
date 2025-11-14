# Token Management & Session Tracking

## Overview
This project implements a sophisticated token management system with session tracking, device management, and automatic cleanup of expired sessions.

## Key Features

### 1. **Token Types**
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), stored in secure HttpOnly cookie, used for token rotation

### 2. **Session Tracking**
Each refresh token is associated with a session object containing:
- `tokenHash`: SHA-256 hashed refresh token (never store raw token)
- `deviceId`: Unique device identifier (SHA-256 hash of User-Agent + IP)
- `deviceName`: Human-readable device name (e.g., "Chrome on Windows")
- `ipAddress`: IP address from request
- `issuedAt`: Session creation timestamp
- `expiresAt`: Session expiration timestamp (7 days from creation)
- `lastUsedAt`: Last refresh timestamp (updated on each refresh)

### 3. **Session Limits**
- **Max 10 sessions per user**: Oldest session is automatically removed when limit is reached (FIFO)
- **Automatic cleanup**: Expired sessions are automatically removed on each save operation

### 4. **Token Rotation**
- On `/api/auth/refresh`: Old token hash is replaced with new token hash
- Maintains device metadata (deviceId, deviceName, ipAddress) across rotations
- Updates `lastUsedAt` timestamp on each refresh

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user (role: student)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

#### POST /api/auth/login
Login with email and password
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }' \
  -c cookies.txt
```
Response:
```json
{
  "success": true,
  "code": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "userId123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "expiresIn": 900
    }
  },
  "requestId": "uuid",
  "path": "/api/auth/login",
  "timestamp": "2024-01-15T10:00:00Z",
  "version": "1.0"
}
```
**Note**: Refresh token is automatically set as HttpOnly cookie (refreshToken)

#### POST /api/auth/refresh
Refresh access token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

#### POST /api/auth/logout
Logout from current session
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Session Management

#### GET /api/users/me/sessions
Get all active sessions for current user
```bash
curl -X GET http://localhost:3000/api/users/me/sessions \
  -H "Authorization: Bearer <accessToken>"
```

Response:
```json
{
  "success": true,
  "code": 200,
  "message": "Active sessions retrieved successfully",
  "data": {
    "sessions": [
      {
        "deviceId": "a1b2c3d4e5f6",
        "deviceName": "Chrome on Windows",
        "ipAddress": "192.168.1.1",
        "issuedAt": "2024-01-15T10:00:00Z",
        "expiresAt": "2024-01-22T10:00:00Z",
        "lastUsedAt": "2024-01-15T10:30:00Z"
      },
      {
        "deviceId": "f6e5d4c3b2a1",
        "deviceName": "Safari",
        "ipAddress": "192.168.1.2",
        "issuedAt": "2024-01-14T15:00:00Z",
        "expiresAt": "2024-01-21T15:00:00Z",
        "lastUsedAt": null
      }
    ],
    "count": 2
  },
  "requestId": "uuid",
  "path": "/api/users/me/sessions",
  "timestamp": "2024-01-15T10:00:00Z",
  "version": "1.0"
}
```

#### POST /api/users/me/sessions/logout
Logout from a specific device
```bash
curl -X POST http://localhost:3000/api/users/me/sessions/logout \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "a1b2c3d4e5f6"
  }'
```

#### POST /api/users/me/sessions/logout-all
Logout from all devices
```bash
curl -X POST http://localhost:3000/api/users/me/sessions/logout-all \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json"
```
**Note**: This also clears the current session's refresh token cookie

## Security Features

### 1. **Token Hashing**
- Refresh tokens are hashed using SHA-256 before storage
- Database never contains raw refresh tokens
- Token comparison is done using hashed values

### 2. **HttpOnly Cookies**
- Refresh tokens are stored as HttpOnly secure cookies
- Prevents XSS attacks from stealing tokens via JavaScript
- Cookie is marked as `secure` in production (HTTPS only)
- Cookie is marked as `sameSite: strict` to prevent CSRF attacks

### 3. **Token Expiration**
- Tokens expire after 7 days
- Expired sessions are automatically cleaned up on save
- Clients must refresh tokens before expiration

### 4. **Device Tracking**
- Each session is tied to a specific device/IP combination
- Allows users to see active sessions and log out from specific devices
- Users can identify suspicious login attempts

### 5. **Session Limits**
- Maximum 10 active sessions per user
- Prevents token sprawl and resource exhaustion
- Oldest session is automatically removed when limit is exceeded

## Client Implementation (Frontend)

### JavaScript/Fetch Example
```javascript
// 1. Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  credentials: 'include', // Important: send cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass123!'
  })
});

const data = await response.json();
const accessToken = data.data.tokens.accessToken;
localStorage.setItem('accessToken', accessToken);

// 2. Make authenticated requests
const apiResponse = await fetch('/api/users/me/sessions', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

// 3. Refresh token (automatic on 401)
const refreshResponse = await fetch('/api/auth/refresh', {
  method: 'POST',
  credentials: 'include', // Automatically sends refreshToken cookie
  headers: { 'Content-Type': 'application/json' }
});

const refreshData = await refreshResponse.json();
const newAccessToken = refreshData.data.tokens.accessToken;
localStorage.setItem('accessToken', newAccessToken);
```

### Axios Example
```javascript
import axios from 'axios';

// 1. Configure axios to include cookies
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Important: send cookies
  headers: { 'Content-Type': 'application/json' }
});

// 2. Login
const loginResponse = await api.post('/auth/login', {
  email: 'john@example.com',
  password: 'SecurePass123!'
});

const accessToken = loginResponse.data.data.tokens.accessToken;
localStorage.setItem('accessToken', accessToken);

// 3. Set token in Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 4. Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await axios.post('/api/auth/refresh', {}, {
          withCredentials: true
        });
        const newToken = refreshResponse.data.data.tokens.accessToken;
        localStorage.setItem('accessToken', newToken);
        
        // Retry original request
        return api(error.config);
      } catch {
        // Refresh failed, redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 5. Get active sessions
const sessions = await api.get('/users/me/sessions');
console.log(sessions.data.data.sessions);

// 6. Logout from specific device
await api.post('/users/me/sessions/logout', {
  deviceId: 'a1b2c3d4e5f6'
});

// 7. Logout from all devices
await api.post('/users/me/sessions/logout-all');
```

## Database Schema

### User Model - refreshSessions
```typescript
interface RefreshTokenSession {
  tokenHash: string;      // SHA-256 hashed refresh token
  deviceId: string;       // Unique device identifier
  deviceName?: string;    // Human-readable device name
  ipAddress?: string;     // Request IP address
  issuedAt: Date;         // Session creation time
  expiresAt: Date;        // Session expiration time (7 days from creation)
  lastUsedAt?: Date;      // Last refresh timestamp
}

// Max 10 sessions per user
// Expired sessions automatically cleaned up on save
```

## Troubleshooting

### 1. "Refresh token is required" Error
- Ensure `credentials: 'include'` is set in fetch/axios
- Check browser DevTools > Application > Cookies for `refreshToken` cookie
- Verify cookie path is `/api/auth` (or broader path like `/`)

### 2. "Refresh token invalid or expired" Error
- Session has expired (7-day limit)
- User must log in again
- Check `expiresAt` timestamp in sessions list

### 3. "User hit session limit" Error
- User has 10 active sessions
- Can view sessions via `GET /api/users/me/sessions`
- Can logout from specific device or all devices

### 4. Token Not Rotating
- Ensure refresh endpoint is being called before token expires
- Check that `lastUsedAt` is updating in sessions

## Best Practices

1. **Always include credentials in cross-origin requests**
   ```javascript
   // ✅ Correct
   credentials: 'include'
   withCredentials: true

   // ❌ Wrong
   credentials: 'omit'
   withCredentials: false
   ```

2. **Never store refresh tokens in localStorage**
   - Use HttpOnly cookies instead
   - Prevents XSS token theft

3. **Validate tokens before each request**
   - Check `expiresIn` and refresh if needed
   - Implement automatic refresh via interceptor

4. **Monitor active sessions**
   - Periodically call `GET /api/users/me/sessions`
   - Alert users of suspicious devices
   - Provide logout button for each device

5. **Handle token expiration gracefully**
   - Redirect to login only after refresh fails
   - Don't log out on single failed request (might be network issue)

6. **Use secure cookie flags in production**
   - `secure: true` (HTTPS only)
   - `sameSite: strict` (prevent CSRF)
   - `httpOnly: true` (prevent XSS)

## Future Enhancements

1. **Cleanup Scheduler**: Add background job to clean expired sessions
   ```typescript
   // Optional: for high-traffic apps
   setInterval(async () => {
     await User.updateMany(
       {},
       {
         $pull: {
           refreshSessions: { expiresAt: { $lt: new Date() } }
         }
       }
     );
   }, 60 * 60 * 1000); // Every hour
   ```

2. **Geolocation Tracking**: Track device location for suspicious activity detection
   ```typescript
   // Add to RefreshTokenSession
   location?: {
     country: string;
     city: string;
     latitude: number;
     longitude: number;
   }
   ```

3. **Suspicious Activity Detection**: Alert users of unusual login patterns
   - New IP/device
   - Multiple login attempts in short time
   - Login from impossible locations

4. **Session Notifications**: Notify users when new session created
   - Email notification
   - In-app notification
   - Option to revoke immediately

## References
- RFC 7235: HTTP Authentication
- OWASP Token Storage Best Practices
- RFC 6265: HTTP State Management
