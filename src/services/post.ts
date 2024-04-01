import {
  deleteManyPosts,
  deletePostById,
  findManyPost,
  findManyPostByUserId,
  findPostById,
  insertPost,
  updatePostById,
} from '@/repository/post';
import { uploadTweetImg } from '@/repository/tweet-img';
import { nanoid } from 'nanoid';

export const createPost = async (post: Post, image: Express.Multer.File) => {
  if (image) {
    const randomName = post.id + image.originalname;
    const fileName = randomName.split(' ').join('');

    try {
      const tweetImg = await uploadTweetImg(image, fileName);

      post.tweetImg = {
        create: tweetImg,
      };

      return await insertPost(post);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  return await insertPost(post);
};

export const getAllPosts = async () => {
  return await findManyPost();
};

export const getPost = async (id: string) => {
  return await findPostById(id);
};

export const getUserPosts = async (userId: string) => {
  return await findManyPostByUserId(userId);
};

export const deletePost = async (id: string) => {
  return await deletePostById(id);
};

export const deleteAllPosts = async (userId: string) => {
  return await deleteManyPosts(userId);
};

export const updatePost = async (
  id: string,
  data: UpdatedPost,
  image: Express.Multer.File
) => {
  const post = await getPost(id);

  if (image) {
    try {
      const randomName = id + image.originalname;
      let fileName = randomName.split(' ').join('');

      let imgId = nanoid(30);

      // if post already have tweet's image edit into post's value
      if (post.tweetImg) {
        fileName = post.tweetImg.name;
        imgId = post.tweetImg.id;
      }

      const tweetImg = await uploadTweetImg(image, fileName);

      // change tweet's image id and tweet's post id into current post value;
      tweetImg.id = imgId;

      // if post already have tweet img update the tweet img
      if (post.tweetImg) {
        data.tweetImg = {
          update: tweetImg,
        };
        return await updatePostById(id, data);
      }

      // if is not create a new table tweet img
      data.tweetImg = {
        create: tweetImg,
      };
      return await updatePostById(id, data);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  return await updatePostById(id, data);
};
