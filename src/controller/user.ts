import { Router, Request, Response } from 'express';
import { deleteUserById, getUserById, getUsers, updateUserById } from '@/services/user';
import { isOwner, isUser } from '@/middlewares';
import multer from 'multer';
import { createAvatar, deleteAvatar, uploadAvatar } from '@/services/avatar';
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
    const user = await getUserById(id);

    console.log(user);

    // delete user's post and user's avatar
    await deleteAllPosts(id);

    if (user.avatar.name !== 'profile.png') {
      await deleteAvatar(user.avatar);
    }

    // delete user
    const deletedUser = await deleteUserById(id);

    return res.status(200).send(deletedUser);
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
      let avatar = user.avatar;

      // if user doesn't exist
      if (!user) {
        return res.sendStatus(400);
      }

      // modified user's username
      user.username = username;

      if (newAvatar) {
        // Upload avatar to firebase
        avatar = await uploadAvatar(newAvatar, user.id);

        // if user's avatar is default insert into database
        if (user.avatarId === 'Xy058vlSSKoLpZ3p7Keo5') {
          await createAvatar(avatar);
          console.log('created');
        } else {
          await updateAvatarByid(user.avatarId, avatar);
          console.log('updated');
        }
      }

      const newUser = {
        username,
        avatarId: avatar.id,
      };

      const updatedUser = await updateUserById(id, newUser);

      return res.status(201).send({
        data: updatedUser,
        avatar,
      });
    } catch (error) {
      console.error(error);
      return res.sendStatus(400);
    }
  }
);

export default router;
