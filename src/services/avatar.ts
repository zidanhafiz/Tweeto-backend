import { storage } from '@/db';
import { insertAvatar, updateAvatarByid } from '@/repository/avatar';
import { findUserById } from '@/repository/user';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { nanoid } from 'nanoid';

export const createAvatar = async (avatar: Avatar) => {
  return await insertAvatar(avatar);
};

export const uploadAvatar = async (avatar: Express.Multer.File, userId: string) => {
  const currentUser = await findUserById(userId);

  const randomName = userId + avatar?.originalname;
  let fileName = randomName.split(' ').join('');

  let newAvatar: Avatar = {
    id: nanoid(),
    name: 'profile.png',
    url: 'https://firebasestorage.googleapis.com/v0/b/tweeto-storage.appspot.com/o/profiles%2Fprofile.png?alt=media&token=b35a09de-f3ed-46bf-ba9a-f85b56c643d4',
  };

  // check if user already login
  if (currentUser) {
    // if user's avatar is not default modify the newAvatar to user's avatar
    if (currentUser.avatar.name !== 'profile.png') {
      fileName = currentUser.avatar.name;
    }
    // delete newAvatar id
    delete newAvatar.id;
  }

  if (avatar) {
    try {
      const profileRef = ref(storage, `profiles/${fileName}`);

      // convert stream file into image
      const contentType = avatar.mimetype;

      // upload into firebase
      await uploadBytes(profileRef, avatar.buffer, { contentType });

      // get image url
      const url = await getDownloadURL(profileRef);

      // create avatar
      newAvatar.name = fileName;
      newAvatar.url = url;

      return newAvatar;
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }
  return newAvatar;
};

export const deleteAvatar = async (avatar: Avatar) => {
  if (avatar !== null) {
    const profileRef = ref(storage, `profiles/${avatar.name}`);

    try {
      await deleteObject(profileRef);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }
  throw Error('Avatar must not null!');
};

export const updateAvatar = async (avatarId: string, avatar: Avatar) => {
  return await updateAvatarByid(avatarId, avatar);
};
