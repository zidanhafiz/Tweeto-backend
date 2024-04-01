import { prisma } from '@/db';

export const findManyUser = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      posts: true,
      avatar: true,
      avatarId: true,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findUserBySessionToken = async (sessionToken: string) => {
  return await prisma.user.findUnique({
    where: {
      sessionToken,
    },
  });
};

export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      avatar: true,
    },
  });
};

export const insertUser = async (data: User) => {
  return await prisma.user.create({
    data,
  });
};

export const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
};

export const updateUser = async (id: string, data: UpdatedUser) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
};
