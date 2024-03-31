import { prisma, storage } from '@/db';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { nanoid } from 'nanoid';

export const findManyUser = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      posts: true,
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

export const updateUser = async (id: string, data: User) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
};

export const uploadAvatar = async (avatar: Express.Multer.File, userId: string) => {
  if (avatar) {
    const randomName = userId + avatar.originalname;
    const fileName = randomName.split(' ').join('');

    try {
      const profileRef = ref(storage, `profiles/${fileName}`);

      // convert stream file into image
      const contentType = avatar.mimetype;

      // upload into firebase
      await uploadBytes(profileRef, avatar.buffer, { contentType });

      // get image url
      const url = await getDownloadURL(profileRef);

      // create avatar
      const newAvatar = {
        id: nanoid(),
        name: fileName,
        url,
      };

      await prisma.avatar.create({
        data: newAvatar,
      });

      return newAvatar;
    } catch (error) {
      console.error(error);
    }
  }
  return null;
};

export const deleteAvatar = async (avatarUrl: string) => {
  if (avatarUrl === '') {
    return;
  }
};
