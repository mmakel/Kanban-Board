import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      res.sendStatus(401);
      return;
    }

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    req.user = user;
    next();
  } catch (err) {
    console.log('Error from token verification: ', err);
    res.sendStatus(403);
    return;
  }
};
