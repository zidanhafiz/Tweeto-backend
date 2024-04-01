import { prisma } from '@/db';

export const insertAvatar = async (data: Avatar) => {
  return await prisma.avatar.create({
    data,
  });
};

export const updateAvatarByid = async (id: string, data: Avatar) => {
  return await prisma.avatar.update({
    where: {
      id,
    },
    data,
  });
};
