import { deleteUserById, getUsers } from '../db/users';
import { Request, Response } from 'express';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
    return;
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);

    res.json(deletedUser);
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
    return;
  }
};
