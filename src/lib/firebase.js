// Firebase integration with lazy initialization and local fallback (no top-level await)
// Provide Vite env vars to enable: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
// VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID

let firebaseEnabled = false;
let initialized = false;
let app, db, storage;

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function hasConfig() {
  return Object.values(cfg).every(Boolean);
}

async function ensureFirebase() {
  if (initialized) return firebaseEnabled;
  initialized = true;
  try {
    if (!hasConfig()) {
      firebaseEnabled = false;
      return false;
    }
    const { initializeApp } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');
    const { getStorage } = await import('firebase/storage');
    app = initializeApp(cfg);
    db = getFirestore(app);
    storage = getStorage(app);
    firebaseEnabled = true;
    return true;
  } catch (e) {
    console.warn('Firebase init failed:', e);
    firebaseEnabled = false;
    return false;
  }
}

function uid(len = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function saveOrder(order) {
  const payload = {
    ...order,
    status: 'pending',
    createdAt: Date.now(),
  };

  const canUseFirebase = await ensureFirebase();
  if (canUseFirebase) {
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await addDoc(collection(db, 'orders'), { ...payload, createdAt: serverTimestamp() });
    return { id: ref.id };
  }

  const id = uid();
  const key = `orders:${id}`;
  localStorage.setItem(key, JSON.stringify({ id, ...payload }));
  return { id };
}

export async function submitPaymentProof({ orderId, txnId, file }) {
  const payload = {
    orderId,
    txnId: txnId || null,
    status: 'payment_submitted',
    submittedAt: Date.now(),
    proofUrl: null,
  };

  const canUseFirebase = await ensureFirebase();

  if (canUseFirebase) {
    const { collection, addDoc, serverTimestamp, doc, updateDoc } = await import('firebase/firestore');
    const { ref: sRef, uploadBytes, getDownloadURL } = await import('firebase/storage');

    if (file) {
      const path = `payment_proofs/${orderId}-${Date.now()}-${file.name}`;
      const ref = sRef(storage, path);
      await uploadBytes(ref, file);
      payload.proofUrl = await getDownloadURL(ref);
    }

    await addDoc(collection(db, 'payment_proofs'), { ...payload, submittedAt: serverTimestamp() });
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: 'payment_submitted' });
    } catch {}

    return { orderId, proofUrl: payload.proofUrl };
  }

  if (file) {
    payload.proofUrl = await fileToDataUrl(file);
  }
  localStorage.setItem(`payment_proofs:${orderId}:${Date.now()}`, JSON.stringify(payload));
  const orderKey = `orders:${orderId}`;
  const existing = localStorage.getItem(orderKey);
  if (existing) {
    try {
      const o = JSON.parse(existing);
      o.status = 'payment_submitted';
      o.paymentSubmittedAt = Date.now();
      localStorage.setItem(orderKey, JSON.stringify(o));
    } catch {}
  }
  return { orderId, proofUrl: payload.proofUrl };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
