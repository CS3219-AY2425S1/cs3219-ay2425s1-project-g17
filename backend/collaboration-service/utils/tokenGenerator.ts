import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET ?? '';

export function generateToken(userId: string, expiresIn: string = '1h'): string {
    const payload = { id: userId };
    return jwt.sign(payload, secret, { expiresIn });
}