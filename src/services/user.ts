import {
  deleteUser,
  findManyUser,
  findUserByEmail,
  findUserById,
  findUserBySessionToken,
  insertUser,
  updateUser,
} from '@/repository/user';

export const getUsers = async () => {
  return await findManyUser();
};

export const getUserByEmail = async (email: string) => {
  return await findUserByEmail(email);
};

export const getUserBySessionToken = async (sessionToken: string) => {
  return await findUserBySessionToken(sessionToken);
};

export const getUserById = async (id: string) => {
  return await findUserById(id);
};

export const createUser = async (data: User) => {
  return await insertUser(data);
};

export const deleteUserById = async (id: string) => {
  return await deleteUser(id);
};

export const updateUserById = async (id: string, data: User) => {
  return await updateUser(id, data);
};
