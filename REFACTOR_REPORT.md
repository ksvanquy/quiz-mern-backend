# Refactor Report: verifyToken Consolidation

## 📋 Tóm tắt
Tôi đã kiểm tra dự án và refactor JWT verification logic từ nhiều nơi vào một utility function centralized: `src/utils/verifyToken.ts`

---

## 🔍 Kết quả kiểm tra

### Hiện tại JWT verification ở đâu:
1. **`src/middlewares/auth.middleware.ts`** - dùng `jwt.verify()` trực tiếp trong middleware
2. **`src/services/auth.service.ts`** - dùng `jwt.verify()` cho refresh token
3. **`src/services/auth.service.ts`** - dùng `jwt.decode()` cho logout

### Vấn đề:
- ❌ Logic scattered (phân tán) ở nhiều chỗ
- ❌ Không có type safety
- ❌ Khó bảo trì nếu thay đổi logic verify
- ❌ Lặp code (duplication)

---

## ✅ Giải pháp: Tạo `verifyToken.ts`

### File mới: `src/utils/verifyToken.ts`
```typescript
// Các function có sẵn:
- verifyToken()          // Core verify function
- extractBearerToken()   // Extract token từ Authorization header
- verifyAccessToken()    // Wrapper cho access token verify
- verifyRefreshToken()   // Wrapper cho refresh token verify
- TokenPayload interface // Type-safe payload
```

### Lợi ích:
✅ **Centralized** - Một nơi quản lý tất cả verify logic
✅ **Type-safe** - Có interface `TokenPayload` 
✅ **Reusable** - Dễ import ở bất cứ nơi cần
✅ **Maintainable** - Thay đổi 1 chỗ, apply everywhere
✅ **Testable** - Dễ test riêng lẻ function

---

## 🔄 Files đã cập nhật

### 1. `src/utils/verifyToken.ts` (NEW - tạo mới)
**Trước**: File rỗng
**Sau**: 
- Thêm `verifyToken()` - core function
- Thêm `extractBearerToken()` - helper
- Thêm `verifyAccessToken()` - wrapper
- Thêm `verifyRefreshToken()` - wrapper
- Thêm `TokenPayload` interface

### 2. `src/middlewares/auth.middleware.ts` (UPDATED)
**Trước**:
```typescript
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/env";

const token = authHeader.split(" ")[1];
const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string; role: string };
```

**Sau**:
```typescript
import { verifyAccessToken, extractBearerToken } from "../utils/verifyToken";

const token = extractBearerToken(authHeader);
const payload = verifyAccessToken(token, ACCESS_TOKEN_SECRET);
```

**Thay đổi**: 
- ✅ Import `verifyAccessToken` và `extractBearerToken`
- ✅ Sử dụng helper function thay vì inline logic
- ✅ Loại bỏ import `REFRESH_TOKEN_SECRET` (không dùng)

### 3. `src/services/auth.service.ts` (UPDATED)
**Trước**:
```typescript
import jwt from "jsonwebtoken";

async refreshToken(oldRefreshToken: string) {
  const payload = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET || "...");
  // ...
}

async logout(refreshToken: string) {
  const payload = require("jsonwebtoken").decode(refreshToken);
  // ...
}
```

**Sau**:
```typescript
import jwt from "jsonwebtoken";
import { verifyRefreshToken } from "../utils/verifyToken";

async refreshToken(oldRefreshToken: string) {
  const payload = verifyRefreshToken(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET || "...");
  // ...
}

async logout(refreshToken: string) {
  const payload = jwt.decode(refreshToken);
  // ...
}
```

**Thay đổi**:
- ✅ Import `verifyRefreshToken` từ utility
- ✅ Sử dụng `verifyRefreshToken()` thay vì `jwt.verify()`
- ✅ Keep `jwt` import (vẫn cần dùng `jwt.decode()` ở logout)

---

## 🚀 Cách dùng

### Trong middleware:
```typescript
import { verifyAccessToken, extractBearerToken } from "../utils/verifyToken";

const token = extractBearerToken(req.headers.authorization);
const payload = verifyAccessToken(token, ACCESS_TOKEN_SECRET);
```

### Trong service:
```typescript
import { verifyRefreshToken } from "../utils/verifyToken";

const payload = verifyRefreshToken(oldRefreshToken, REFRESH_TOKEN_SECRET);
```

### Lấy token từ header:
```typescript
import { extractBearerToken } from "../utils/verifyToken";

const token = extractBearerToken(req.headers.authorization);
if (!token) return res.status(401).json({ message: "Unauthorized" });
```

---

## 📊 Thống kê thay đổi

| File | Status | Thay đổi |
|------|--------|---------|
| `src/utils/verifyToken.ts` | ✨ NEW | Tạo mới với 4 functions + 1 interface |
| `src/middlewares/auth.middleware.ts` | 🔄 UPDATED | Refactor để dùng verifyToken utility |
| `src/services/auth.service.ts` | 🔄 UPDATED | Dùng verifyRefreshToken, keep jwt.decode |

---

## 🧪 Kiểm tra

### Test authenticate middleware:
```bash
# Có Authorization header hợp lệ
curl -H "Authorization: Bearer <valid_token>" http://localhost:5000/api/users/me

# Không có header
curl http://localhost:5000/api/users/me  # 401 Unauthorized

# Token không hợp lệ
curl -H "Authorization: Bearer invalid" http://localhost:5000/api/users/me  # 401 Token không hợp lệ
```

### Test refresh token:
```bash
POST /api/auth/refresh-token
{
  "refreshToken": "<old_refresh_token>"
}
```

---

## 💡 Recommendations

1. **Type-safe imports**: Luôn import từ `src/utils/verifyToken` thay vì trực tiếp `jsonwebtoken`
2. **Error handling**: Wrap trong try-catch như hiện tại (đã có)
3. **Logging**: Log được enable, dễ debug token issues
4. **Future**: Nếu thêm logic verify mới, thêm vào `verifyToken.ts`

---

## ❓ FAQ

**Q: Tại sao không dùng middleware builder pattern?**
A: Hiện tại simple hơn. Nếu cần authorize by role, có thể nâng cấp sau.

**Q: JWT secret nên ở đâu?**
A: Hiện tại ở `process.env`. Tốt hơn: tạo config class centralized.

**Q: Có cần decode token không verify ở logout?**
A: Đúng - logout chỉ cần lấy userId, không cần verify signature (vì đã xoá khỏi DB rồi).

