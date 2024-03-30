import { Router, Request, Response } from 'express';
import { createUser, getUserByEmail, updateUserById } from '@/services/user';
import { authentication, random } from '@/helpers';
import { isLogin } from '@/middlewares';
import { nanoid } from 'nanoid';

const router = Router();

router.post('/register', isLogin, async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body as User;

    // if email, username or password are empty
    if (!email || !username || !password) {
      return res.sendStatus(400);
    }

    // check if user already exist
    const isUserExist = await getUserByEmail(email);
    if (isUserExist) {
      return res.sendStatus(400);
    }

    // create user
    const salt = random();
    const id = nanoid();
    const user = await createUser({
      id,
      username,
      email,
      salt,
      password: authentication(salt, password),
    });

    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

router.post('/login', isLogin, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // if email and password are empty
    if (!email || !password) {
      return res.sendStatus(400);
    }

    // check user is exist on database
    const user = await getUserByEmail(email);
    if (!user) {
      return res.sendStatus(400);
    }

    // check hash password
    const expectedHash = authentication(user.salt, password);
    if (expectedHash !== user.password) {
      return res.sendStatus(403);
    }

    // create session token
    const salt = random();
    user.sessionToken = authentication(salt, user.id);
    await updateUserById(user.id, user);

    // create cookie
    res.cookie('AUTH', user.sessionToken, { domain: 'localhost', path: '/' });

    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
});

router.get('/logout', async (req: Request, res: Response) => {
  try {
    return res.clearCookie('AUTH').sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
});

export default router;
