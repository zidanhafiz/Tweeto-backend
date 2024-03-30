import prisma from '@/db';

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

export const findManyPostByUserId = async (userId: string) => {
  return await prisma.post.findUnique({
    where: {
      authorId: userId,
    },
  });
};

export const insertPost = async (post: Post) => {
  return await prisma.post.create({
    data: post,
  });
};
