import { Pool } from 'pg';
import { Context } from 'hono';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { profile } from '../schema';
import { otpService } from '../services/otp_service'
config()
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    },
});
const db = drizzle(pool);

export const createProfile = async (c: Context) => {
    try {
        const { fullName, phone } = await c.req.json();
        const result = await db.insert(profile).values({
            fullName,
            phone,
        }).returning();

        return c.json(result[0], 201);
    } catch (error) {
        console.error('Error creating profile:', error);
        return c.json({ error: 'Failed to create profile' }, 500);
    }
};
export const sendOtp = async (c: Context) => {
    try {
        const { phone_number } = await c.req.json();
        if (phone_number != process.env.TWILIO_PHONE_NUMBER) {
            return c.json({
                success: false,
                message: "Make sure that Your number is verified"
            }, 400);
        }
        const status = await otpService.sendVerificationCode(phone_number);

        if (status === 'pending') {
            return c.json({
                success: true,
                message: 'OTP sent successfully',
                status: status,
            }, 200);
        } else {
            return c.json({
                success: false,
                message: 'Failed to send OTP',
                status: status,
            }, 500);
        }
    } catch (error) {
        return c.json({
            success: false,
            message: `can't send otp`,
            error: (error as Error).message,
        }, 500);
    }
};

export const verifyOtp = async (c: Context) => {
    try {
        const { phone_number, code } = await c.req.json();
        if (phone_number != process.env.TWILIO_PHONE_NUMBER) {
            return c.json({
                success: false,
                message: "Make sure that Your number is verified"
            }, 400);
        }
        const result = await otpService.checkVerification(phone_number, code);

        if (result.status === 'approved') {
            return c.json({
                success: true,
                message: result.message,
                status: result.status,
            }, 200);
        } else if (result.status === 'expired' || result.status === 'incorrect') {
            return c.json({
                success: false,
                message: result.message,
                status: result.status,
            }, 400);
        } else {
            return c.json({
                success: false,
                message: 'OTP verification failed',
                status: result.status,
            }, 400);
        }
    } catch (error) {
        return c.json({
            success: false,
            message: 'An error occurred while verifying OTP',
            error: (error as Error).message,
        }, 500);
    }
};