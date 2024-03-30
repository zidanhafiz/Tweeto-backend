import {
  findManyPost,
  findManyPostByUserId,
  findPostById,
  insertPost,
} from '@/repository/post';

export const createPost = async (post: Post) => {
  return await insertPost(post);
};

export const getAllPosts = async () => {
  return await findManyPost();
};

export const getPostById = async (id: string) => {
  return await findPostById(id);
};

export const getAllPostsByUserId = async (userId: string) => {
  return await findManyPostByUserId(userId);
};
