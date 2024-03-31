import { Router, Request, Response } from 'express';
import { createUser, getUserByEmail, updateUserById } from '@/services/user';
import { authentication, random } from '@/helpers';
import { isLogin } from '@/middlewares';
import { nanoid } from 'nanoid';
import multer from 'multer';
import { uploadAvatar } from '@/repository/user';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed.'));
    }
    cb(null, true);
  },
});

router.post(
  '/register',
  isLogin,
  upload.single('avatar'),
  async (req: Request, res: Response) => {
    try {
      const { email, username, password } = req.body as User;
      const avatar = req.file;

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

      // upload avatar to firebase and get avatar data
      const newAvatar = await uploadAvatar(avatar, id);

      // create user
      const user = await createUser({
        id,
        username,
        email,
        salt,
        avatarId: newAvatar.id,
        password: authentication(salt, password),
      });

      return res.status(200).send({
        user,
        avatar: newAvatar,
      });
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  }
);

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
