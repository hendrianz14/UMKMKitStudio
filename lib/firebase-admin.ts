import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getStorage, Storage } from "firebase-admin/storage";

let app: App | null = null;
let storage: Storage | null = null;

export function firebaseApp() {
  if (!app) {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
    });
  }
  return app;
}

export function firebaseBucket() {
  if (!storage) storage = getStorage(firebaseApp());
  return storage.bucket(process.env.FIREBASE_STORAGE_BUCKET!);
}

// Signed URL v4 untuk upload (PUT) + URL publik sederhana
export async function getFirebaseUploadAndPublicUrls(objectPath: string, contentType: string) {
  const file = firebaseBucket().file(objectPath);
  const [uploadUrl] = await file.getSignedUrl({
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 menit
    contentType,
    version: "v4",
  });
  const publicUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${objectPath}`;
  return { uploadUrl, publicUrl };
}
