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
  imgTweet?: string;
};

type UpdatedPost = {
  tweet: string;
  imgTweet?: string;
  isEdit: boolean;
};

type Avatar = {
  id: string;
  name: string;
  url: string;
};

type UpdatedUser = {
  username: string;
};
