import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

console.log('Initializing Firebase Admin...');
console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('Private Key present:', !!process.env.FIREBASE_PRIVATE_KEY);

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
};

let app;
try {
  app = !getApps().length ? initializeApp(firebaseAdminConfig) : getApps()[0];
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  throw error;
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);

export async function getPoetBySlug(slug) {
  try {
    const snap = await adminDb
      .collection("poets")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snap.empty) return null;
    const doc = snap.docs[0].data();

    return {
      name: doc.name || slug.replace("-", " "),
      slug: doc.slug || slug,
      bio: doc.bio || "",
      image: doc.image || null,
      createdAt: doc.createdAt ? doc.createdAt.toDate().toISOString() : null,
    };
  } catch (error) {
    console.error("getPoetBySlug error:", error);
    return null;
  }
}

export async function getPoemsByAuthor(authorName, limit = 50) {
  try {
    const snap = await adminDb
      .collection("poems")
      .where("author", "==", authorName)
      .get();

    let poems = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt || null,
      };
    });

    poems = poems.sort((a, b) => {
      const aTs = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bTs = b.createdAt ? Date.parse(b.createdAt) : 0;
      return bTs - aTs;
    });

    return poems.slice(0, limit);
  } catch (error) {
    console.error("getPoemsByAuthor error:", error);
    return [];
  }
}

export async function getDocuments(collectionName, filters = [], limit = 50) {
  try {
    let ref = adminDb.collection(collectionName);
    for (const f of filters) {
      ref = ref.where(f.field, f.op, f.value);
    }
    if (limit) ref = ref.limit(limit);

    const snap = await ref.get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("getDocuments error:", error);
    return [];
  }
}
