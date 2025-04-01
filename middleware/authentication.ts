import type { IncomingMessage, ServerResponse } from 'http';

import { verify, type JwtPayload } from 'jsonwebtoken';

import config from '../config';
import { isTokenRevoked } from '../models';

/**
 * Extends the IncomingMessage interface to include user authentication data.
 */
export interface AuthenticatedRequest extends IncomingMessage {
  user?: JwtPayload | string;
}

/**
 * Middleware function to authenticate a JWT token.
 * @param {AuthenticatedRequest} req - The incoming request object.
 * @param {ServerResponse} res - The server response object.
 * @returns {Promise<boolean>} Resolves to true if authentication is successful, otherwise false.
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: ServerResponse
): Promise<boolean> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: 'Unauthorized' }));
    return false;
  }

  if (isTokenRevoked(token)) {
    res.statusCode = 403;
    res.end(JSON.stringify({ message: 'Forbidden' }));
  }

  try {
    const decoded = verify(token, config.jwtSecret);
    req.user = decoded;
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    res.statusCode = 403;
    res.end(JSON.stringify({ message: 'Unauthorized' }));
    return false;
  }
};
