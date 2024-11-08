import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET ?? '';

export function generateToken(userId, expiresIn = '1h') {
    const payload = { id: userId };
    return jwt.sign(payload, secret, { expiresIn });
}