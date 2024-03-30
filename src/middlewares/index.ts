import { Request, Response, NextFunction } from 'express';
import { getUserBySessionToken } from '@/services/user';
import { get, merge } from 'lodash';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken = req.cookies['AUTH'];

    // if session token is empty
    if (!sessionToken) {
      return res.sendStatus(403);
    }

    // check if there user already sign in
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity.id') as string;

    // if current user is not exist
    if (!currentUserId) {
      return res.sendStatus(403);
    }

    // if current user deleted
    if (currentUserId === id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const isLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies['AUTH'];

    if (sessionToken) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};
