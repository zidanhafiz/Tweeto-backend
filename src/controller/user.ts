import { Router, Request, Response } from 'express';
import { deleteUserById, getUserById, getUsers, updateUserById } from '@/services/user';
import { isOwner } from '@/middlewares';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await getUsers();

    return res.status(201).send(users);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
});

router.delete('/:id', isOwner, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await deleteUserById(id);

    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    // if username is empty
    if (!username) {
      return res.sendStatus(400);
    }

    const user = await getUserById(id);

    // if user doesn't exist
    if (!user) {
      return res.sendStatus(400);
    }

    // modified user's username
    user.username = username;
    const updatedUser = await updateUserById(id, user);

    return res.status(201).send(updatedUser);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
});

export default router;
