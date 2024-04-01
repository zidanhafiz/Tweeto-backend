import { prisma } from '@/db';

export const findManyPost = async () => {
  return await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
};

export const findPostById = async (id: string) => {
  return await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
};

export const findManyPostByUserId = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      posts: true,
    },
  });
};

export const insertPost = async (post: Post) => {
  return await prisma.post.create({
    data: post,
  });
};

export const deletePostById = async (id: string) => {
  return await prisma.post.delete({
    where: {
      id,
    },
  });
};

export const deleteManyPosts = async (authorId: string) => {
  return await prisma.post.deleteMany({
    where: {
      authorId,
    },
  });
};

export const updatePostById = async (id: string, data: UpdatedPost) => {
  return await prisma.post.update({
    where: {
      id,
    },
    data,
  });
};
