// utils/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "あなたのAPIキー",
  authDomain: "pawhouse-511c8.firebaseapp.com",
  projectId: "pawhouse-511c8",
  storageBucket: "pawhouse-511c8.appspot.com",
  messagingSenderId: "1084001463954",
  appId: "1:1084001463954:web:c36f2699c96b8f6596004b",
  measurementId: "G-LWPG3L0RL2"
};

// Firebase アプリの重複初期化を防ぐ
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// クライアントサイドのみで getAnalytics を実行
let analytics;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export { app, db, analytics };