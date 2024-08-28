import { Hono } from 'hono';
import { sendOtp, verifyOtp } from './controllers/profileController';
// import {loginValidationMiddleware} from './validation_middleware'
const otpRoutes = new Hono();

otpRoutes.post('/send-otp', sendOtp);
otpRoutes.post('/verify-otp', verifyOtp);

export { otpRoutes };
