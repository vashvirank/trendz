import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCL4-UM_PdyA3nl_iLxLrWTMuSKrauCUgA",
  authDomain: "trendz-8967d.firebaseapp.com",
  projectId: "trendz-8967d",
  storageBucket: "trendz-8967d.firebasestorage.app",
  messagingSenderId: "1017587600943",
  appId: "1:1017587600943:web:88ba4051d376039b5d00da",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
