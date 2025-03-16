// utils/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase 設定（Firebase コンソールから取得）
const firebaseConfig = {
  apiKey: "AIzaSyDFyjyPdDAFOB05l7V0pwtdpEQphNO10AA",
  authDomain: "pawhouse-511c8.firebaseapp.com",
  projectId: "pawhouse-511c8",
  storageBucket: "pawhouse-511c8.appspot.com", // ✅ 修正: ".app" → ".com"
  messagingSenderId: "1084001463954",
  appId: "1:1084001463954:web:c36f2699c96b8f6596004b",
  measurementId: "G-LWPG3L0RL2"
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Firestore を追加
const analytics = getAnalytics(app);

export { app, db, analytics };