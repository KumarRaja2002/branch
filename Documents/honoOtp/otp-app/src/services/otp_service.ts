import { config } from 'dotenv'
config()
import { Twilio } from 'twilio';
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

class OtpService {
    otpExpiryTime: number;
    otpMap: Map<string, number>;

    constructor() {
        this.otpExpiryTime = 5 * 60 * 1000;
        this.otpMap = new Map();
    }

    async sendVerificationCode(phoneNumber: string) {
        try {
            const data = await client.verify.v2.services(String(process.env.TWILIO_VERIFY_SERVICE_SID))
                .verifications
                .create({
                    to: phoneNumber,
                    channel: 'sms'
                });
            if (data.status === 'pending') {
                this.otpMap.set(phoneNumber, Date.now());
            }

            return data.status;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async checkVerification(phoneNumber: string, code: string) {
        try {
            const sentTime = this.otpMap.get(phoneNumber);
            if (!sentTime) {
                return { status: 'pending', message: 'No OTP sent for this number.' };
            }

            const currentTime = Date.now();
            if (currentTime - sentTime > this.otpExpiryTime) {
                this.otpMap.delete(phoneNumber);
                return { status: 'expired', message: 'OTP has expired.' };
            }

            const data = await client.verify.v2.services(String(process.env.TWILIO_VERIFY_SERVICE_SID))
                .verificationChecks
                .create({
                    to: phoneNumber,
                    code: code
                });

            if (data.status === 'approved') {
                this.otpMap.delete(phoneNumber);
                return { status: 'approved', message: 'OTP verified successfully.' };
            } else {
                return { status: 'incorrect', message: 'OTP is incorrect.' };
            }
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}

export const otpService = new OtpService();
