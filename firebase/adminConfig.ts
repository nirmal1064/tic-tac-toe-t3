import * as admin from "firebase-admin";
import { AppOptions, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

const firebaseAdminConfig: AppOptions = {
  credential: admin.credential.cert({
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
};

export const adminApp =
  getApps().length === 0
    ? admin.initializeApp(firebaseAdminConfig)
    : getApps()[0];

export const adminAuth = getAuth(adminApp);

export const adminDb = getDatabase(adminApp);
