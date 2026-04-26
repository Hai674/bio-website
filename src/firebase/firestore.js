import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { db, firebaseEnabled } from './config';

const localRead = (key, fallback) => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
};

const localWrite = (key, payload) => {
  localStorage.setItem(key, JSON.stringify(payload));
};

export const fetchCollection = async (name) => {
  if (!firebaseEnabled) {
    return localRead(`future2066_${name}`, []);
  }

  const snap = await getDocs(collection(db, name));
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
};

export const upsertDocument = async (name, id, data) => {
  if (!firebaseEnabled) {
    const list = localRead(`future2066_${name}`, []);
    const next = [...list.filter((item) => item.id !== id), { id, ...data }];
    localWrite(`future2066_${name}`, next);
    return;
  }

  await setDoc(doc(db, name, id), data, { merge: true });
};

export const removeDocument = async (name, id) => {
  if (!firebaseEnabled) {
    const list = localRead(`future2066_${name}`, []);
    localWrite(
      `future2066_${name}`,
      list.filter((item) => item.id !== id),
    );
    return;
  }

  await deleteDoc(doc(db, name, id));
};

export const replaceCollection = async (name, items) => {
  if (!firebaseEnabled) {
    localWrite(`future2066_${name}`, items);
    return;
  }

  const batch = writeBatch(db);
  const docs = await getDocs(collection(db, name));

  docs.forEach((item) => batch.delete(item.ref));
  items.forEach((item) => batch.set(doc(db, name, item.id), item));

  await batch.commit();
};
