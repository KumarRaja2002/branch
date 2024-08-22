import { Hono } from 'hono';
import { sendOtp, verifyOtp } from './controllers/profile_controller';
import {loginValidationMiddleware} from './validation_middleware'
const otpRoutes = new Hono();

otpRoutes.post('/send-otp',loginValidationMiddleware.validateLogin, sendOtp);
otpRoutes.post('/verify-otp', loginValidationMiddleware.validateLogin,verifyOtp);

export { otpRoutes };
