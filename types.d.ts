type User = {
  id: string;
  email: string;
  username: string;
  password: string;
  salt: string;
};

type Post = {
  id: string;
  authorId: string;
  tweet: string;
};
