import { PrismaClient } from '@prisma/client';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// firebase config
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

// firebase init
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

// prisma init
export const prisma = new PrismaClient();
