import { adminDb } from './firebaseAdmin'; 
import { toPlain } from './firestorePlain';

function toMillis(v) {
  if (!v) return 0;
  if (typeof v?.toDate === 'function') {
    return v.toDate().getTime();
  }
  const ms = Date.parse(v);
  return Number.isFinite(ms) ? ms : 0;
}

function extractMatlaFromDoc(data) {
  let lines = [];
  if (Array.isArray(data.lines)) {
    lines = data.lines;
  } else if (typeof data.lines === 'string') {
    lines = data.lines.split('\n');
  } else if (typeof data.content === 'string') {
    lines = data.content.split('। ');
  }
  const first = (lines[0] || '').trim();
  const second = (lines[1] || '').trim();
  if (!first || !second) return null;
  return [first, second];
}

export async function getLatestPoems(limit = 10) {
  const poemsSnap = await adminDb.collection('poems').orderBy('createdAt', 'desc').limit(limit).get();
  return poemsSnap.docs.map(d => toPlain({ id: d.id, ...d.data() }));
}


export async function getLatestGhazals(limit = 4) {
  const windowLimit = 20; 
  const ghazalsSnap = await adminDb.collection('poems').orderBy('createdAt', 'desc').limit(windowLimit).get();

  const ghazalCandidates = ghazalsSnap.docs.map(d => ({ id: d.id, data: d.data() }));

  const ghazalsProcessed = ghazalCandidates.reduce((acc, doc) => {
    const data = doc.data || {};
    if (String(data.category || '').toLowerCase() !== 'ghazal') return acc;
    
    const matla = extractMatlaFromDoc(data);
    if (!matla) return acc;

    const createdAtMs = toMillis(data.createdAt) || toMillis(data.updatedAt);
    acc.push({
      id: doc.id,
      slug: data.slug || doc.id,
      poet: data.author || data.poet || 'Unknown',
      createdAt: data.createdAt?.toDate?.().toISOString() || String(data.createdAt || ''),
      createdAtMs,
      matla
    });
    return acc;
  }, []);

  return ghazalsProcessed
    .sort((a, b) => b.createdAtMs - a.createdAtMs)
    .slice(0, limit);
}

export async function getLatestBlogs(limit = 7) {
  const windowLimit = 25;
  const colRef = adminDb.collection('blogs');
  const snap = await colRef.orderBy('createdAt', 'desc').limit(windowLimit).get();

  const items = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!d?.published) return;

    items.push({
      id: doc.id,
      title: d?.title || 'Untitled',
      content: d?.content || '',
      excerpt: d?.excerpt || (d?.content ? d.content.substring(0, 180) + '...' : ''),
      coverImage: d?.coverImage || null,
      slug: d?.slug || doc.id,
      author: d?.author || 'MicTale',
      createdAt: d?.createdAt?.toDate?.().toISOString() || String(d.createdAt || new Date().toISOString()),
      tags: d?.tags || []
    });
  });

  return items.slice(0, limit);
}

function safeDate(dateField) {
  return dateField?.toDate?.().toISOString?.() || new Date().toISOString();
}

export async function getBlogBySlug(slug) {
  const docSnap = await adminDb.collection('blogs').doc(slug).get();

  if (!docSnap.exists) {
    return null;
  }

  const blogData = docSnap.data();

  if (blogData.published === false) {
    return null;
  }

  return {
    id: docSnap.id,
    ...blogData,
    createdAt: safeDate(blogData.createdAt),
    updatedAt: safeDate(blogData.updatedAt || blogData.createdAt),
  };
}

export async function getSimilarBlogs(currentBlog, currentBlogId) {
  if (!currentBlog) return [];
  const similarBlogs = [];

  try {
    const blogsRef = adminDb.collection('blogs');
    const existingIds = new Set([currentBlogId]);

    if (currentBlog.tags?.length > 0) {
      const tagQuerySnap = await blogsRef
        .where('tags', 'array-contains-any', currentBlog.tags.slice(0, 2))
        .orderBy('createdAt', 'desc')
        .limit(8)
        .get();

      tagQuerySnap.forEach(doc => {
        if (!existingIds.has(doc.id) && doc.data().published !== false) {
          const blogData = doc.data();
          similarBlogs.push({
            id: doc.id,
            slug: doc.id,
            ...blogData,
            createdAt: safeDate(blogData.createdAt),
          });
          existingIds.add(doc.id);
        }
      });
    }
    if (similarBlogs.length < 4) {
      const recentSnap = await blogsRef.orderBy('createdAt', 'desc').limit(12).get();
      recentSnap.forEach(doc => {
        if (similarBlogs.length < 4 && !existingIds.has(doc.id) && doc.data().published !== false) {
          const blogData = doc.data();
          similarBlogs.push({
            id: doc.id,
            slug: doc.id,
            ...blogData,
            createdAt: safeDate(blogData.createdAt),
          });
          existingIds.add(doc.id);
        }
      });
    }

    return similarBlogs.slice(0, 4);
  } catch (err) {
    console.error('Error fetching similar blogs:', err);
    return [];
  }
}
export async function getAllPublishedBlogSlugs() {
    try {
        const snapshot = await adminDb.collection('blogs').where('published', '!=', false).get();
        return snapshot.docs.map(doc => ({ slug: doc.id }));
    } catch {
        return [];
    }
}
