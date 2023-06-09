import { Request, Response } from 'express';

import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      res.sendStatus(400);
      return;
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: { salt, password: authentication(salt, password) },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.sendStatus(400);
      return;
    }

    const user = await getUserByEmail(email).select(
      '+authentication.salt +authentication.password'
    );

    if (!user) {
      res.sendStatus(400);
      return;
    }

    const expectedHash = authentication(user.authentication?.salt!, password);

    if (user.authentication?.password !== expectedHash) {
      res.sendStatus(403);
      return;
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();

    res.cookie('qRecca-AUTH', user.authentication.sessionToken, {
      domain: 'localhost',
      path: '/',
    });

    res.status(200).json(user).end();
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
    return;
  }
};
