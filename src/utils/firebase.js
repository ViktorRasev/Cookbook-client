import { initializeApp } from "firebase/app";
import { getFirestore  } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCwWYKWnb-enQ9bpsWwFTKSZfmBS9whICg",
    authDomain: "cookbook-fffcf.firebaseapp.com",
    projectId: "cookbook-fffcf",
    storageBucket: "cookbook-fffcf.appspot.com",
    messagingSenderId: "422454620516",
    appId: "1:422454620516:web:a27e529abac8aa8b000a71"
};

  const app = initializeApp(firebaseConfig)
  export const db = getFirestore(app)