import { isAuthor } from '@/middlewares';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from '@/services/post';
import { getUserBySessionToken } from '@/services/user';
import { Router, Request, Response } from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';

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
    const posts = await getAllPosts();

    return res.status(200).send(posts);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await getPost(id);
    if (!post) {
      return res.sendStatus(404);
    }

    return res.status(200).send(post);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
});

router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { tweet } = req.body as Post;
    const image = req.file;

    if (!tweet) {
      return res.sendStatus(500);
    }

    // Check for session token if is empty return 403
    const sessionToken = req.cookies['AUTH'];
    if (!sessionToken) {
      return res.sendStatus(403);
    }

    // Get current user
    const currentUser = await getUserBySessionToken(sessionToken);

    // Create post
    const id = nanoid();
    const post = {
      id,
      authorId: currentUser.id,
      tweet,
    };

    const postedTweet = await createPost(post, image);
    return res.status(201).send(postedTweet);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
});

router.delete('/:id', isAuthor, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedPost = await deletePost(id);

    return res.status(201).send(deletedPost);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
});

router.patch(
  '/:id',
  isAuthor,
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { tweet } = req.body;
      const image = req.file;

      const post: UpdatedPost = {
        tweet,
        isEdit: true,
      };

      const updatedPost = await updatePost(id, post, image);

      return res.status(201).send(updatedPost);
    } catch (error) {
      console.error(error);
      return res.sendStatus(400);
    }
  }
);

export default router;
