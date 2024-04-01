type User = {
  id: string;
  email: string;
  username: string;
  password: string;
  salt: string;
  avatarId: string;
};

type Post = {
  id: string;
  authorId: string;
  tweet: string;
  tweetImg?: {
    create: TweetImg;
  };
};

type UpdatedPost = {
  tweet: string;
  isEdit: boolean;
  tweetImg?: {
    update?: TweetImg;
    create?: TweetImg;
  };
};

type Avatar = {
  id: string;
  name: string;
  url: string;
};

type UpdatedUser = {
  username: string;
};

type TweetImg = {
  id: string;
  name: string;
  url: string;
};
