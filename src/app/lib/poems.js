import { adminDb } from "@/app/lib/firebaseAdmin";
import { toPlain } from "@/app/lib/firestorePlain";

const poemsCol = adminDb.collection("poems");

export async function getPoemBySlug(slug) {
  const docRef = poemsCol.doc(slug);
  const one = await docRef.get();
  if (one.exists) return toPlain({ id: one.id, ...one.data() });

  const snap = await poemsCol.where("slug", "==", slug).limit(1).get();
  if (snap.empty) return null;

  const d = snap.docs[0];
  return toPlain({ id: d.id, ...d.data() });
}

export async function listPoemSlugs(max = 5000) {
  const snap = await poemsCol.orderBy("createdAt", "desc").limit(max).get();

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      slug: String(data.slug || d.id),
      updatedAt: toPlain(data.createdAt) || new Date().toISOString(),
    };
  });
}

export async function upsertPoem(poem) {
  const ref = poemsCol.doc(poem.slug);

  await ref.set({ ...poem }, { merge: true });

  const fresh = await ref.get();
  return toPlain({ id: fresh.id, ...fresh.data() });
}
