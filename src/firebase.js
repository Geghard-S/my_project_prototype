import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCvqvVonQgY47ivCQs4-MPxjUg8srAdC9I",
    authDomain: "sheettomap-401917.firebaseapp.com",
    projectId: "sheettomap-401917",
    storageBucket: "sheettomap-401917.appspot.com",
    messagingSenderId: "976806242656",
    appId: "1:976806242656:web:58a31b4130e2c11efc1605",
    measurementId: "G-0MG3655K25"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const createDoc = (doc) => {
    const colName = 'coordinates'
    addDoc(collection(db, colName), doc);
}

export default app;
