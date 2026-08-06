import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function seed() {
  try {
    await addDoc(collection(db, 'banners'), {
      imageUrl: 'https://lh3.googleusercontent.com/d/1oZkplCaMaGezluzDWr13db5zW_TIOSyL',
      link: 'https://kharandi.com',
      active: true,
      createdAt: serverTimestamp()
    });
    console.log('Banner seeded');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

seed();
