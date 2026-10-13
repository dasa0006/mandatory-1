// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAVOlKInbJ8vdtZZitWvwkWMI_CUGnnIa4",
	authDomain: "mandatory-1-a112f.firebaseapp.com",
	projectId: "mandatory-1-a112f",
	storageBucket: "mandatory-1-a112f.firebasestorage.app",
	messagingSenderId: "500772569255",
	appId: "1:500772569255:web:5ce9802a8c2600ab195b82",
	measurementId: "G-JP7NSPD5WQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app, db };
