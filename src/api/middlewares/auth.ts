import { Request, Response, NextFunction } from 'express';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface UserJwtPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    res.status(401).json({ error: 'You need to sign in to your account first.' });
    return;
  }

  const [bearer, token] = bearerToken.split(' ');

  const decoded: UserJwtPayload = jwtDecode<UserJwtPayload>(token);

  if (decoded.exp && Date.now() >= decoded.exp * 1000) {
    return res.status(401).json({ error: 'Token has expired. Please log in again.' });
  }

  if (!decoded.id || !decoded.name || !decoded.email || !decoded.username) {
    return res.status(401).json({ error: 'Invalid token: user information is missing.' });
  }

  (req as any).authUser = decoded;

  next();
};
