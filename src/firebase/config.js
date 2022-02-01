import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD3z2cqKz3P1-9UkKe4QpeWKs4qZTU5fTI",
    authDomain: "muntinlupa-locals.firebaseapp.com",
    databaseURL: "https://muntinlupa-locals-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "muntinlupa-locals",
    storageBucket: "muntinlupa-locals.appspot.com",
    messagingSenderId: "1022967806356",
    appId: "1:1022967806356:web:cbccfcd683b30cf0383781",
    measurementId: "G-8GD92QDRJN"
    };

const app = initializeApp(firebaseConfig);

export default getFirestore(app);
