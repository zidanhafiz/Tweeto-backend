import { createPost, getAllPosts, getPostById } from '@/services/post';
import { getUserBySessionToken } from '@/services/user';
import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';

const router = Router();

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

    const post = await getPostById(id);
    if (!post) {
      return res.sendStatus(404);
    }

    return res.status(200).send(post);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { tweet } = req.body as Post;

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

    const postedTweet = await createPost(post);
    return res.status(201).send(postedTweet);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
});

export default router;
