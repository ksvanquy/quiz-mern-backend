"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const passwordValidator_1 = require("../utils/passwordValidator");
const apiResponse_1 = require("../utils/apiResponse");
const authService = new auth_service_1.AuthService();
class AuthController {
    // Register bình thường (role luôn student)
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            // ✅ Validate input
            if (!name || !email || !password) {
                return res.status(400).json((0, apiResponse_1.validationErrorResponse)(req.originalUrl || req.url, [
                    ...((!name) ? [{ field: 'name', message: 'Name is required', code: 'REQUIRED' }] : []),
                    ...((!email) ? [{ field: 'email', message: 'Email is required', code: 'REQUIRED' }] : []),
                    ...((!password) ? [{ field: 'password', message: 'Password is required', code: 'REQUIRED' }] : [])
                ]));
            }
            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json((0, apiResponse_1.validationErrorResponse)(req.originalUrl || req.url, [
                    { field: 'email', message: 'Invalid email format', code: 'INVALID_FORMAT' }
                ]));
            }
            // ✅ Validate password meets security requirements
            const passwordValidation = (0, passwordValidator_1.validatePasswordFully)(password);
            if (!passwordValidation.valid) {
                return res.status(400).json((0, apiResponse_1.validationErrorResponse)(req.originalUrl || req.url, passwordValidation.errors.map((err, idx) => ({
                    field: 'password',
                    message: err,
                    code: `PASSWORD_${passwordValidation.strength.toUpperCase()}`
                })), 'Password does not meet security requirements'));
            }
            const user = await authService.register(name, email, password);
            return res.apiSuccess?.({ user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'User registered successfully', 201);
        }
        catch (error) {
            if (error.message.includes('Email')) {
                return res.apiError?.({ type: '/errors/conflict', title: 'Conflict', status: 409, detail: error.message });
            }
            return res.apiError?.({ type: '/errors/register', title: 'Register Error', status: 400, detail: error.message });
        }
    }
    // Admin tạo user với role tùy ý
    async createUserByAdmin(req, res) {
        try {
            const { name, email, password, role } = req.body;
            // Validate input
            if (!name || !email || !password || !role) {
                return res.status(400).json((0, apiResponse_1.validationErrorResponse)(req.originalUrl || req.url, [
                    ...((!name) ? [{ field: 'name', message: 'Name is required', code: 'REQUIRED' }] : []),
                    ...((!email) ? [{ field: 'email', message: 'Email is required', code: 'REQUIRED' }] : []),
                    ...((!password) ? [{ field: 'password', message: 'Password is required', code: 'REQUIRED' }] : []),
                    ...((!role) ? [{ field: 'role', message: 'Role is required', code: 'REQUIRED' }] : [])
                ]));
            }
            if (!['student', 'teacher', 'admin'].includes(role)) {
                return res.status(400).json((0, apiResponse_1.validationErrorResponse)(req.originalUrl || req.url, [
                    { field: 'role', message: 'Role must be one of: student, teacher, admin', code: 'INVALID_ROLE' }
                ]));
            }
            // ✅ Validate password meets security requirements
            const passwordValidation = (0, passwordValidator_1.validatePasswordFully)(password);
            if (!passwordValidation.valid) {
                return res.status(400).json((0, apiResponse_1.validationErrorResponse)(req.originalUrl || req.url, passwordValidation.errors.map(err => ({
                    field: 'password',
                    message: err,
                    code: `PASSWORD_${passwordValidation.strength.toUpperCase()}`
                })), 'Password does not meet security requirements'));
            }
            const user = await authService.createUserByAdmin(name, email, password, role);
            return res.apiSuccess?.({ user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'User created successfully', 201);
        }
        catch (error) {
            if (error.message.includes('Email')) {
                return res.apiError?.({ type: '/errors/conflict', title: 'Conflict', status: 409, detail: error.message });
            }
            return res.apiError?.({ type: '/errors/create_user', title: 'Create User Error', status: 400, detail: error.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json((0, apiResponse_1.validationErrorResponse)(req.originalUrl || req.url, [
                    ...((!email) ? [{ field: 'email', message: 'Email is required', code: 'REQUIRED' }] : []),
                    ...((!password) ? [{ field: 'password', message: 'Password is required', code: 'REQUIRED' }] : [])
                ]));
            }
            const result = await authService.login(email, password);
            // Set refresh token as HttpOnly secure cookie
            const refreshToken = result.refreshToken;
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/api/auth',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
            };
            res.cookie('refreshToken', refreshToken, cookieOptions);
            return res.apiSuccess?.({
                user: { id: result.user._id, name: result.user.name, email: result.user.email, role: result.user.role },
                tokens: {
                    accessToken: result.accessToken,
                    expiresIn: 900 // 15 minutes
                }
            }, 'Login successful', 200);
        }
        catch (err) {
            // Authentication errors should return 401, not 400
            return res.apiError?.({ type: '/errors/auth', title: 'Authentication Error', status: 401, detail: err.message });
        }
    }
    async refresh(req, res) {
        try {
            // Prefer cookie-based refresh token for browsers
            const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
            if (!refreshToken) {
                return res.apiError?.({ title: 'Refresh token missing', status: 400, detail: 'Refresh token is required' });
            }
            const tokens = await authService.refreshToken(refreshToken);
            // Rotate cookie with new refresh token
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/api/auth',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.apiSuccess?.({
                tokens: {
                    accessToken: tokens.accessToken,
                    expiresIn: 900
                }
            }, 'Tokens refreshed successfully', 200);
        }
        catch (err) {
            return res.apiError?.({ type: '/errors/auth', title: 'Authentication Error', status: 401, detail: err.message });
        }
    }
    async logout(req, res) {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
            if (!refreshToken) {
                return res.apiError?.({ title: 'Refresh token missing', status: 400, detail: 'Refresh token is required' });
            }
            await authService.logout(refreshToken);
            // Clear cookie
            res.clearCookie('refreshToken', { path: '/api/auth' });
            return res.apiSuccess?.(null, 'Logout successful', 200);
        }
        catch (err) {
            return res.apiError?.({ title: 'Logout error', status: 400, detail: err.message });
        }
    }
}
exports.AuthController = AuthController;
