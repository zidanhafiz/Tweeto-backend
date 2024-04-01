import { Router, Request, Response } from 'express';
import { deleteUserById, getUserById, getUsers, updateUserById } from '@/services/user';
import { isOwner, isUser } from '@/middlewares';
import multer from 'multer';
import { updateAvatar, uploadAvatar } from '@/services/avatar';
import { deleteAllPosts } from '@/services/post';
import { updateAvatarByid } from '@/repository/avatar';

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

    await deleteAllPosts(id);

    const user = await deleteUserById(id);

    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
});

router.patch(
  '/:id',
  upload.single('avatar'),
  isUser,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { username } = req.body;
      const newAvatar = req.file;

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

      // Upload avatar to firebase
      const avatar = await uploadAvatar(newAvatar, user.id);

      // if avatar is not default update it to database
      if (avatar.name !== 'profile.png') {
        await updateAvatarByid(user.avatarId, avatar);
      }

      const newUser = {
        username,
      };

      const updatedUser = await updateUserById(id, newUser);

      return res.status(201).send({
        updatedUser,
        avatar,
      });
    } catch (error) {
      console.error(error);
      return res.sendStatus(400);
    }
  }
);

export default router;
