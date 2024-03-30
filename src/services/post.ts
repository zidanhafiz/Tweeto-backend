import { findManyPost, findManyPostByUserId, insertPost } from '@/repository/post';

export const createPost = async (post: Post) => {
  return await insertPost(post);
};

export const getAllPosts = async () => {
  return await findManyPost();
};

export const getAllPostsByUserId = async (userId: string) => {
  return await findManyPostByUserId(userId);
};
