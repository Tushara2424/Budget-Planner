import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCaJs98WfJscI79MgBaObPhiCSu0ci55Pg",
    authDomain: "budget-tracker-e54d4.firebaseapp.com",
    projectId: "budget-tracker-e54d4",
    storageBucket: "budget-tracker-e54d4.appspot.com",
    messagingSenderId: "790111247822",
    appId: "1:790111247822:web:7239604adb52ee5d781f9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
export const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
        console.log(result);
        // window.location.href = "/dashboard";
    }).catch((error) => {
        console.log(error);
    })
};