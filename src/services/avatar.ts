import { storage } from '@/db';
import { deleteAvatarById, insertAvatar, updateAvatarByid } from '@/repository/avatar';
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

  // create default avatar
  let newAvatar: Avatar = {
    id: nanoid(),
    name: 'profile.png',
    url: 'https://firebasestorage.googleapis.com/v0/b/tweeto-storage.appspot.com/o/profiles%2Fprofile.png?alt=media&token=fe4369e0-f421-44bc-a040-10abcc85029b',
  };

  // if user already login change newAvatar id and fileName into user's fileName and avatarId
  if (currentUser) {
    if (currentUser.avatar.name !== 'profile.png') {
      fileName = currentUser.avatar.name;
      newAvatar.id = currentUser.avatarId;
    }
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
  // change into default id if no avatar and user login
  newAvatar.id = 'Xy058vlSSKoLpZ3p7Keo5';

  return newAvatar;
};

export const deleteAvatar = async (avatar: Avatar) => {
  const profileRef = ref(storage, `profiles/${avatar.name}`);

  try {
    await deleteAvatarById(avatar.id);
    await deleteObject(profileRef);
  } catch (error) {
    console.error(error);
    throw Error(error);
  }
};

export const updateAvatar = async (avatarId: string, avatar: Avatar) => {
  return await updateAvatarByid(avatarId, avatar);
};
