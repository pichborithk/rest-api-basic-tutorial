import { getUserBySessionToken } from '../db/users';
import { NextFunction, Request, Response } from 'express';
import { get, merge } from 'lodash';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken = req.cookies['qRecca-AUTH'];

    if (!sessionToken) {
      res.sendStatus(403);
      return;
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      res.sendStatus(403);
      return;
    }

    merge(req, { identity: existingUser });
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
    return;
  }
};

export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId: string = get(req, 'identity._id')!;
    if (!currentUserId) {
      res.sendStatus(403);
      return;
    }

    if (currentUserId.toString() !== id) {
      res.sendStatus(403);
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
    return;
  }
};
