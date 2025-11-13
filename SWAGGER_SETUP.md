# Swagger Integration - Complete Setup & Documentation

## 🎉 Status: ✅ COMPLETE

Swagger/OpenAPI documentation is now fully integrated into your Quiz MERN backend!

---

## 📝 What Was Done

### 1. **Created Swagger Configuration** (`src/swagger.ts`)
- Set up `swagger-jsdoc` to generate OpenAPI 3.0 spec
- Configured security scheme for Bearer JWT authentication
- Scans route and controller files for JSDoc annotations
- Base URL: `http://localhost:5000/api`

### 2. **Mounted Swagger UI** (`src/app.ts`)
- Added Swagger UI middleware at `/api-docs`
- Integrated with Express app before API routes

### 3. **Added OpenAPI JSDoc Annotations**
Documented all key endpoints with complete JSDoc comments in:
- ✅ `src/routes/auth.routes.ts` (4 endpoints)
- ✅ `src/routes/user.routes.ts` (6 endpoints)
- ✅ `src/routes/node.routes.ts` (5 endpoints)

Each annotation includes:
- Endpoint description
- Request body schema (with examples)
- Response schemas (success & error cases)
- Security requirements (Bearer token where needed)
- Parameter documentation

### 4. **Fixed TypeScript Error**
- Updated `src/controllers/user.controller.ts` to use `userId` instead of `_id`
- Token payload uses `userId` field from JWT

### 5. **Verified Compilation**
- ✅ TypeScript compiles without errors
- ✅ Dev server starts successfully
- ✅ Swagger UI loads at `http://localhost:5000/api-docs`

---

## 🚀 How to Use

### 1. **Access Swagger UI**
```
http://localhost:5000/api-docs
```

### 2. **Test APIs Directly from Swagger**
- Click "Try it out" on any endpoint
- For authenticated endpoints: Click the lock icon and enter your JWT token
- Fill in request body/parameters
- Execute and see response

### 3. **Import into Postman** (Optional)
```
http://localhost:5000/api-docs/swagger.json
```
- Go to Postman → Import → Link tab
- Paste the OpenAPI spec URL above
- All endpoints auto-import with documentation

---

## 📚 Documented Endpoints

### Auth Routes (`/auth`)
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/register` | POST | ❌ | Register new user (student role) |
| `/login` | POST | ❌ | Login and get tokens |
| `/refresh` | POST | ❌ | Refresh access token |
| `/create-user` | POST | ✅ Admin | Create user with custom role |

### User Routes (`/users`)
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/me` | GET | ✅ | Get current user profile |
| `/me` | PUT | ✅ | Update own profile |
| `/` | GET | ✅ Admin | List all users |
| `/:id` | GET | ✅ Admin | Get user by ID |
| `/:id` | PUT | ✅ Admin | Update user |
| `/:id` | DELETE | ✅ Admin | Delete user |

### Node Routes (`/nodes`)
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/` | POST | ✅ Admin/Teacher | Create node |
| `/` | GET | ❌ | List all nodes |
| `/:id` | GET | ❌ | Get node by ID |
| `/:id` | PUT | ✅ Admin/Teacher | Update node |
| `/:id` | DELETE | ✅ Admin | Delete node |

---

## 🔐 Authentication in Swagger

### To Test Protected Endpoints:

1. **Register a user** (POST `/auth/register`)
2. **Login** (POST `/auth/login`) - Get `accessToken`
3. **Authorize** - Click the 🔒 lock icon at top-right of Swagger UI
4. **Paste token**: `Bearer <your_access_token>`
5. **Try protected endpoints** - They'll use your token automatically

---

## 📦 Dependencies Used

| Package | Version | Purpose |
|---------|---------|---------|
| `swagger-jsdoc` | ^6.2.8 | Generate OpenAPI spec from JSDoc |
| `swagger-ui-express` | ^5.0.1 | Serve Swagger UI web interface |

Both packages were **already installed** in your project.

---

## 📋 Files Modified

### New Files
- `REFACTOR_REPORT.md` - verifyToken refactor documentation
- (Swagger config already existed in `src/swagger.ts`)

### Updated Files
1. **`src/swagger.ts`**
   - Added security scheme definition for Bearer JWT
   - Enhanced server info and description

2. **`src/app.ts`**
   - Imported swagger UI and spec
   - Mounted at `/api-docs`

3. **`src/routes/auth.routes.ts`**
   - Added JSDoc for all 4 endpoints
   - Documented request/response schemas

4. **`src/routes/user.routes.ts`**
   - Added JSDoc for all 6 endpoints
   - Documented admin-only restrictions

5. **`src/routes/node.routes.ts`**
   - Added JSDoc for all 5 endpoints
   - Documented role-based access

6. **`src/controllers/user.controller.ts`**
   - Fixed: Changed `req.user._id` → `req.user.userId`

7. **`README.md`**
   - Added Swagger setup instructions

---

## 🧪 Testing the Integration

### Option 1: Use Swagger UI (Easiest)
```
http://localhost:5000/api-docs
```
- Interactive, visual testing
- Real-time validation
- Easy token management

### Option 2: Import to Postman
```
http://localhost:5000/api-docs/swagger.json
```
- Import as OpenAPI collection
- All endpoints pre-configured
- Organize in folders

### Option 3: Command Line (curl)
```powershell
# Test register endpoint
curl.exe -X POST "http://localhost:5000/api/auth/register" `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"Pass123\"}"

# Test protected endpoint (need token first)
curl.exe -X GET "http://localhost:5000/api/users/me" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🐛 Troubleshooting

### Issue: "No operations defined in spec!"
**Solution**: Ensure JSDoc comments are properly formatted before route definitions.

### Issue: Token not working in Swagger
**Solution**: 
1. Register and login to get token
2. Click 🔒 icon at top-right
3. Paste token in format: `Bearer <token_value>`

### Issue: Endpoints not showing
**Solution**: Make sure `src/routes/*.ts` files have `@swagger` JSDoc blocks.

---

## 📚 Next Steps (Optional Enhancements)

1. **Add more endpoints documentation**
   - Assessment routes
   - Question routes
   - Answer routes
   - Attempt routes
   - Lazy routes

2. **Add request/response examples** to each endpoint

3. **Create API usage guide** in Swagger description

4. **Set up webhook documentation** if needed

5. **Add contact/license info** to OpenAPI spec

---

## ✨ Quick Commands

```powershell
# Start dev server
npm run dev

# Build TypeScript
npm run build

# View Swagger UI
# Open browser to: http://localhost:5000/api-docs

# Get OpenAPI JSON spec
# Visit: http://localhost:5000/api-docs/swagger.json

# Stop dev server
Ctrl+C
```

---

## 📞 Support

If you encounter any issues:
1. Check that MongoDB is connected (see server logs)
2. Ensure `.env` has correct `PORT` and token secrets
3. Make sure dependencies are installed: `npm install`
4. Verify port 5000 is not in use by another process

**Server logs show:**
- ✅ MongoDB connected
- ✅ Server running on port 5000
- ✅ Swagger UI requests successful

Happy API testing! 🚀
