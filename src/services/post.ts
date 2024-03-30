import {
  deletePostById,
  findManyPost,
  findManyPostByUserId,
  findPostById,
  insertPost,
  updatePostById,
} from '@/repository/post';

export const createPost = async (post: Post) => {
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

export const updatePost = async (id: string, data: UpdatedPost) => {
  return await updatePostById(id, data);
};
