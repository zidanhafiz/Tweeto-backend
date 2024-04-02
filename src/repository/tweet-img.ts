import { storage } from '@/db';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { nanoid } from 'nanoid';

export const uploadTweetImg = async (image: Express.Multer.File, fileName: string) => {
  try {
    const tweetImgRef = ref(storage, `posts/${fileName}`);

    const contentType = image.mimetype;

    await uploadBytes(tweetImgRef, image.buffer, { contentType });

    const url = await getDownloadURL(tweetImgRef);

    const tweetImg = {
      id: nanoid(30),
      name: fileName,
      url,
    };

    return tweetImg;
  } catch (error) {
    console.error(error);
    throw Error(error);
  }
};

export const deleteTweetImg = async (tweetImg: TweetImg) => {
  const profileRef = ref(storage, `posts/${tweetImg.name}`);

  try {
    await deleteObject(profileRef);
  } catch (error) {
    console.error(error);
    throw Error(error);
  }
};
