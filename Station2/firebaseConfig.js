//firebaseConfig.js 파일 생성 후 코드입력
import { initializeFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD_RBT_gzPy-E1ZSmoCF0bXGnPrOmx8XTw",
    authDomain: "finalproject-878e2.firebaseapp.com",
    projectId: "finalproject-878e2",
    storageBucket: "finalproject-878e2.appspot.com",
    messagingSenderId: "999716342014",
    appId: "1:999716342014:web:327fd3ab7d863456723daf"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
})
export { db }

//App.js에 firebaseConfig.js import하기