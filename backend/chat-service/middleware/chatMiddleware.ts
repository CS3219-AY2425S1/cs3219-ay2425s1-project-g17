import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const secret = process.env.JWT_SECRET ?? '';

// Middleware to verify JWT token
export function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).json({ message: "Authentication failed" });
      return
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, secret, async (err, user) => {
      if (err) {
        res.status(401).json({ message: "Authentication failed" });
        return
      }

      next();
    });
  }
